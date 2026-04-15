import { useState } from 'react';
import { Table, Button, Tag, Space, Typography, Badge, Row, Col, message, Modal, Input, Select, InputNumber, DatePicker, Radio, Divider, Steps, Descriptions } from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, DollarOutlined,
  CreditCardOutlined, BankOutlined, MobileOutlined, WalletOutlined,
  CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined,
  EyeOutlined, FileDoneOutlined, PrinterOutlined, DownloadOutlined,
} from '@ant-design/icons';
import { useCurrency } from '../context/CurrencyContext';
import { getUserRole, getUserInfo } from '../utils/auth';

const { Title, Text } = Typography;
const { Option } = Select;

const PAYMENT_METHODS = [
  { key: 'card', label: 'Carte Bancaire', icon: <CreditCardOutlined style={{ fontSize: 28, color: '#3F51B5' }} />, description: 'Visa, Mastercard, etc.' },
  { key: 'mobile', label: 'Mobile Money', icon: <MobileOutlined style={{ fontSize: 28, color: '#E91E63' }} />, description: 'Orange Money, MTN Money, Wave' },
  { key: 'bank', label: 'Virement Bancaire', icon: <BankOutlined style={{ fontSize: 28, color: '#4CAF50' }} />, description: 'Virement SEPA / Local' },
  { key: 'cash', label: 'Espèces', icon: <WalletOutlined style={{ fontSize: 28, color: '#FF9800' }} />, description: 'Paiement en liquide' },
];

const Factures = () => {
  const { formatMoney } = useCurrency();
  const role = getUserRole() || 'user';
  const canEdit = role === 'admin' || role === 'manager';

  const [payModalOpen, setPayModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentStep, setPaymentStep] = useState(0);
  const [partialAmount, setPartialAmount] = useState(0);
  const [paymentType, setPaymentType] = useState('full');

  // New/Edit invoice form state
  const [newInvoice, setNewInvoice] = useState({ id: null, reference: '', client: '', amount: 0, dueDate: '', items: '' });

  const [data, setData] = useState([
    { id: 1, reference: 'FAC-2024-001', client: 'Client ABC', amount: 984000, paid: 0, dueDate: '2024-11-01', status: 'en_retard', createdBy: 'Alice Traoré', paymentHistory: [
      { date: '2024-09-15', method: 'bank', amount: 0, note: 'Facture créée' },
    ]},
    { id: 2, reference: 'FAC-2024-002', client: 'Entreprise XYZ', amount: 2099200, paid: 500000, dueDate: '2024-12-15', status: 'en_attente', createdBy: 'Jean Dupont', paymentHistory: [
      { date: '2024-10-01', method: 'mobile', amount: 500000, note: 'Acompte via Orange Money' },
    ]},
    { id: 3, reference: 'FAC-2024-003', client: 'Startup Inc', amount: 557600, paid: 557600, dueDate: '2024-10-20', status: 'paye', createdBy: 'Oumar Koné', paymentHistory: [
      { date: '2024-10-18', method: 'card', amount: 557600, note: 'Paiement intégral par carte' },
    ]},
    { id: 4, reference: 'FAC-2024-004', client: 'Tech Solutions', amount: 1475000, paid: 0, dueDate: '2025-01-30', status: 'en_attente', createdBy: 'Jean Dupont', paymentHistory: [] },
    { id: 5, reference: 'FAC-2024-005', client: 'Commerce Global', amount: 3280000, paid: 1640000, dueDate: '2024-12-01', status: 'en_attente', createdBy: 'Alice Traoré', paymentHistory: [
      { date: '2024-11-10', method: 'bank', amount: 1640000, note: 'Paiement partiel par virement' },
    ]},
  ]);

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Supprimer la facture',
      content: 'Êtes-vous sûr de vouloir supprimer cette facture?',
      okText: 'Supprimer',
      okType: 'danger',
      cancelText: 'Annuler',
      onOk: () => {
        setData(data.filter(item => item.id !== id));
        message.success('Facture supprimée');
      },
    });
  };

  const openPayModal = (record) => {
    setSelectedInvoice(record);
    setPaymentMethod(null);
    setPaymentStep(0);
    setPaymentType('full');
    setPartialAmount(record.amount - (record.paid || 0));
    setPayModalOpen(true);
  };

  const handlePayment = () => {
    if (!paymentMethod) {
      message.error('Veuillez sélectionner un mode de paiement');
      return;
    }

    const payAmount = paymentType === 'full' ? (selectedInvoice.amount - (selectedInvoice.paid || 0)) : partialAmount;

    if (payAmount <= 0) {
      message.error('Le montant doit être supérieur à 0');
      return;
    }

    const remaining = selectedInvoice.amount - (selectedInvoice.paid || 0);
    if (payAmount > remaining) {
      message.error('Le montant dépasse le solde restant');
      return;
    }

    setData(prev => prev.map(inv => {
      if (inv.id === selectedInvoice.id) {
        const newPaid = (inv.paid || 0) + payAmount;
        const newStatus = newPaid >= inv.amount ? 'paye' : 'en_attente';
        return {
          ...inv,
          paid: newPaid,
          status: newStatus,
          paymentHistory: [
            ...(inv.paymentHistory || []),
            {
              date: new Date().toISOString().split('T')[0],
              method: paymentMethod,
              amount: payAmount,
              note: `Paiement ${paymentType === 'full' ? 'intégral' : 'partiel'} via ${PAYMENT_METHODS.find(m => m.key === paymentMethod)?.label}`,
            },
          ],
        };
      }
      return inv;
    }));

    message.success(`✅ Paiement de ${formatMoney(payAmount)} effectué avec succès !`);
    setPayModalOpen(false);
  };

  const handleCreateOrUpdateInvoice = () => {
    if (!newInvoice.reference || !newInvoice.client || !newInvoice.amount) {
      message.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (isEditMode) {
      setData(prev => prev.map(inv => {
        if (inv.id === newInvoice.id) {
          return {
            ...inv,
            reference: newInvoice.reference,
            client: newInvoice.client,
            amount: newInvoice.amount,
            dueDate: newInvoice.dueDate,
          };
        }
        return inv;
      }));
      message.success(`Facture ${newInvoice.reference} modifiée !`);
    } else {
      const inv = {
        id: Date.now(),
        reference: newInvoice.reference,
        client: newInvoice.client,
        amount: newInvoice.amount,
        paid: 0,
        dueDate: newInvoice.dueDate || new Date().toISOString().split('T')[0],
        status: 'en_attente',
        createdBy: getUserInfo()?.username || 'Système',
        paymentHistory: [],
      };
      setData(prev => [inv, ...prev]);
      message.success(`Facture ${inv.reference} créée !`);
    }
    
    setCreateModalOpen(false);
    setNewInvoice({ id: null, reference: '', client: '', amount: 0, dueDate: '', items: '' });
  };

  // Stats
  const totalAmount = data.reduce((s, i) => s + i.amount, 0);
  const totalPaid = data.reduce((s, i) => s + (i.paid || 0), 0);
  const overdue = data.filter(i => i.status === 'en_retard').length;
  const pending = data.filter(i => i.status === 'en_attente').length;

  const columns = [
    {
      title: 'Référence', dataIndex: 'reference', key: 'reference',
      render: (ref) => <span style={{ fontWeight: 600, color: '#3F51B5' }}>{ref}</span>,
    },
    { title: 'Client', dataIndex: 'client', key: 'client' },
    ...(canEdit ? [
      { 
        title: 'Créé par', 
        dataIndex: 'createdBy', 
        key: 'createdBy',
        render: (text) => <Tag color="purple">{text || 'Inconnu'}</Tag>
      }
    ] : []),
    {
      title: 'Montant', dataIndex: 'amount', key: 'amount',
      render: (val) => <span style={{ fontWeight: 700 }}>{formatMoney(val)}</span>,
    },
    {
      title: 'Payé', key: 'paid',
      render: (_, record) => {
        const paid = record.paid || 0;
        const percent = Math.round((paid / record.amount) * 100);
        return (
          <div>
            <span style={{ fontWeight: 600, color: paid >= record.amount ? '#4CAF50' : '#636e72' }}>
              {formatMoney(paid)}
            </span>
            <div style={{
              height: 4, borderRadius: 2, background: '#e9ecef', marginTop: 4, width: 80,
            }}>
              <div style={{
                height: '100%', borderRadius: 2, width: `${percent}%`,
                background: percent >= 100 ? '#4CAF50' : percent > 0 ? '#FF9800' : '#e9ecef',
                transition: 'width 0.5s ease',
              }} />
            </div>
          </div>
        );
      },
    },
    { title: 'Échéance', dataIndex: 'dueDate', key: 'dueDate' },
    {
      title: 'Statut', dataIndex: 'status', key: 'status',
      render: (status) => {
        const config = {
          paye: { color: '#4CAF50', bg: '#e8f5e9', text: 'Payée', icon: <CheckCircleOutlined /> },
          en_attente: { color: '#FF9800', bg: '#fff3e0', text: 'En attente', icon: <ClockCircleOutlined /> },
          en_retard: { color: '#f44336', bg: '#ffebee', text: 'En retard', icon: <ExclamationCircleOutlined /> },
        };
        const s = config[status] || config.en_attente;
        return (
          <Tag
            icon={s.icon}
            style={{
              background: s.bg, color: s.color, border: `1px solid ${s.color}30`,
              borderRadius: 20, fontWeight: 600, padding: '2px 12px',
            }}
          >
            {s.text}
          </Tag>
        );
      },
    },
    {
      title: 'Actions', key: 'actions', width: 200,
      render: (_, record) => (
        <Space size="small">
          {record.status !== 'paye' && (
            <Button
              type="primary"
              size="small"
              icon={<DollarOutlined />}
              onClick={() => openPayModal(record)}
              style={{
                background: 'linear-gradient(135deg, #3F51B5, #E91E63)',
                border: 'none', borderRadius: 8, fontWeight: 600, height: 32,
              }}
            >
              Payer
            </Button>
          )}
          <Button
            type="text" size="small" icon={<EyeOutlined style={{ color: '#00b894' }} />}
            onClick={() => { setSelectedInvoice(record); setViewModalOpen(true); }}
            style={{ borderRadius: 8, background: 'rgba(0, 184, 148, 0.1)' }}
          />
          {canEdit && (
            <Button
              type="text" size="small" icon={<EditOutlined style={{ color: '#3F51B5' }} />}
              onClick={() => {
                setNewInvoice({
                  id: record.id,
                  reference: record.reference,
                  client: record.client,
                  amount: record.amount,
                  dueDate: record.dueDate || '',
                  items: record.items || '',
                });
                setIsEditMode(true);
                setCreateModalOpen(true);
              }}
              style={{ borderRadius: 8, background: 'rgba(63, 81, 181, 0.1)' }}
            />
          )}
          {canEdit && (
            <Button type="text" size="small" danger icon={<DeleteOutlined style={{ color: '#E91E63' }} />} onClick={() => handleDelete(record.id)} style={{ borderRadius: 8, background: 'rgba(233, 30, 99, 0.1)' }} />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#2d3436' }}>📄 Factures</Title>
          <Text style={{ color: '#636e72' }}>Gestion et paiement de vos factures</Text>
        </Col>
        <Col>
          {canEdit && (
            <Button
              type="primary" icon={<PlusOutlined />}
              onClick={() => {
                setIsEditMode(false);
                setNewInvoice({ id: null, reference: '', client: '', amount: 0, dueDate: '', items: '' });
                setCreateModalOpen(true);
              }}
              style={{
                borderRadius: 12, height: 44, paddingInline: 24,
                background: 'linear-gradient(135deg, #3F51B5, #E91E63)',
                border: 'none', fontWeight: 600, boxShadow: '0 4px 14px rgba(63,81,181,0.25)',
              }}
            >
              Créer une facture
            </Button>
          )}
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Factures', value: formatMoney(totalAmount), icon: <FileDoneOutlined />, color: '#3F51B5' },
          { label: 'Total Payé', value: formatMoney(totalPaid), icon: <CheckCircleOutlined />, color: '#4CAF50' },
          { label: 'En Attente', value: String(pending), icon: <ClockCircleOutlined />, color: '#FF9800' },
          { label: 'En Retard', value: String(overdue), icon: <ExclamationCircleOutlined />, color: '#f44336' },
        ].map((stat, i) => (
          <Col xs={24} sm={12} md={6} key={i}>
            <div className="reduction-card" style={{
              animation: `slideUp 0.4s ease-out ${i * 0.06}s both`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontSize: 12, color: '#636e72', textTransform: 'uppercase', letterSpacing: 0.8 }}>{stat.label}</p>
                  <h3 style={{ margin: '6px 0 0', fontSize: 22, fontWeight: 800, color: '#2d3436' }}>{stat.value}</h3>
                </div>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: `${stat.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: stat.color, fontSize: 22,
                }}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Table */}
      <div className="reduction-card reduction-table" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px 0' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#2d3436', margin: 0 }}>Liste des factures</h3>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          style={{ margin: '12px 0 0' }}
          pagination={{ pageSize: 10, position: ['bottomCenter'] }}
          rowClassName="history-row"
        />
      </div>

      {/* ══════ PAYMENT MODAL ══════ */}
      <Modal
        open={payModalOpen}
        onCancel={() => setPayModalOpen(false)}
        footer={null}
        width={560}
        centered
        styles={{ body: { padding: 0 } }}
      >
        {selectedInvoice && (
          <div style={{ padding: 24 }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16, margin: '0 auto 12px',
                background: 'linear-gradient(135deg, #3F51B5, #E91E63)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <DollarOutlined style={{ fontSize: 26, color: '#fff' }} />
              </div>
              <Title level={3} style={{ margin: 0 }}>Payer la facture</Title>
              <Text type="secondary">{selectedInvoice.reference} — {selectedInvoice.client}</Text>
            </div>

            {/* Amount info */}
            <div style={{
              background: '#f8f9fa', borderRadius: 16, padding: 20, marginBottom: 24,
              display: 'flex', justifyContent: 'space-around', textAlign: 'center',
            }}>
              <div>
                <div style={{ fontSize: 12, color: '#636e72', textTransform: 'uppercase' }}>Total</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#2d3436' }}>{formatMoney(selectedInvoice.amount)}</div>
              </div>
              <div style={{ width: 1, background: '#e9ecef' }} />
              <div>
                <div style={{ fontSize: 12, color: '#636e72', textTransform: 'uppercase' }}>Payé</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#4CAF50' }}>{formatMoney(selectedInvoice.paid || 0)}</div>
              </div>
              <div style={{ width: 1, background: '#e9ecef' }} />
              <div>
                <div style={{ fontSize: 12, color: '#636e72', textTransform: 'uppercase' }}>Restant</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#E91E63' }}>{formatMoney(selectedInvoice.amount - (selectedInvoice.paid || 0))}</div>
              </div>
            </div>

            {/* Payment type */}
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontWeight: 600, fontSize: 14, display: 'block', marginBottom: 8 }}>Type de paiement</span>
              <Radio.Group value={paymentType} onChange={e => setPaymentType(e.target.value)} style={{ width: '100%' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Radio value="full" style={{ padding: '8px 0' }}>
                    Paiement intégral — <b>{formatMoney(selectedInvoice.amount - (selectedInvoice.paid || 0))}</b>
                  </Radio>
                  <Radio value="partial" style={{ padding: '8px 0' }}>
                    Paiement partiel
                  </Radio>
                </Space>
              </Radio.Group>
              {paymentType === 'partial' && (
                <InputNumber
                  value={partialAmount}
                  onChange={setPartialAmount}
                  min={1}
                  max={selectedInvoice.amount - (selectedInvoice.paid || 0)}
                  style={{ width: '100%', marginTop: 8, borderRadius: 10 }}
                  size="large"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                  parser={value => value.replace(/\s/g, '')}
                  addonAfter="FCFA"
                />
              )}
            </div>

            {/* Payment methods */}
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontWeight: 600, fontSize: 14, display: 'block', marginBottom: 12 }}>Mode de paiement</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {PAYMENT_METHODS.map(method => (
                  <div
                    key={method.key}
                    onClick={() => setPaymentMethod(method.key)}
                    style={{
                      padding: 16, borderRadius: 14, cursor: 'pointer',
                      border: paymentMethod === method.key
                        ? '2px solid #3F51B5'
                        : '2px solid #e9ecef',
                      background: paymentMethod === method.key ? '#3F51B515' : '#fff',
                      transition: 'all 0.2s',
                      textAlign: 'center',
                    }}
                  >
                    {method.icon}
                    <div style={{ fontWeight: 600, fontSize: 13, marginTop: 6, color: '#2d3436' }}>{method.label}</div>
                    <div style={{ fontSize: 11, color: '#636e72' }}>{method.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirm button */}
            <Button
              type="primary"
              size="large"
              block
              onClick={handlePayment}
              disabled={!paymentMethod}
              style={{
                borderRadius: 14, height: 52, fontSize: 16, fontWeight: 700,
                background: paymentMethod ? 'linear-gradient(135deg, #3F51B5, #E91E63)' : '#e9ecef',
                border: 'none',
                boxShadow: paymentMethod ? '0 6px 20px rgba(63,81,181,0.3)' : 'none',
              }}
            >
              <CheckCircleOutlined /> Confirmer le paiement de {formatMoney(
                paymentType === 'full' ? (selectedInvoice.amount - (selectedInvoice.paid || 0)) : partialAmount
              )}
            </Button>
          </div>
        )}
      </Modal>

      {/* ══════ CREATE INVOICE MODAL ══════ */}
      <Modal
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        footer={null}
        width={520}
        centered
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FileDoneOutlined style={{ color: '#3F51B5', fontSize: 20 }} />
            <span style={{ fontWeight: 700 }}>{isEditMode ? 'Modifier la facture' : 'Créer une facture'}</span>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 8 }}>
          <div>
            <label style={{ fontWeight: 600, fontSize: 13, display: 'block', marginBottom: 6 }}>Référence *</label>
            <Input
              placeholder="FAC-2024-006"
              value={newInvoice.reference}
              onChange={e => setNewInvoice(p => ({ ...p, reference: e.target.value }))}
              style={{ borderRadius: 10 }} size="large"
            />
          </div>
          <div>
            <label style={{ fontWeight: 600, fontSize: 13, display: 'block', marginBottom: 6 }}>Client *</label>
            <Input
              placeholder="Nom du client"
              value={newInvoice.client}
              onChange={e => setNewInvoice(p => ({ ...p, client: e.target.value }))}
              style={{ borderRadius: 10 }} size="large"
            />
          </div>
          <div>
            <label style={{ fontWeight: 600, fontSize: 13, display: 'block', marginBottom: 6 }}>Montant *</label>
            <InputNumber
              value={newInvoice.amount}
              onChange={v => setNewInvoice(p => ({ ...p, amount: v }))}
              min={0}
              style={{ width: '100%', borderRadius: 10 }}
              size="large"
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
              parser={value => value.replace(/\s/g, '')}
              addonAfter="FCFA"
            />
          </div>
          <div>
            <label style={{ fontWeight: 600, fontSize: 13, display: 'block', marginBottom: 6 }}>Date d'échéance</label>
            <Input
              type="date"
              value={newInvoice.dueDate}
              onChange={e => setNewInvoice(p => ({ ...p, dueDate: e.target.value }))}
              style={{ borderRadius: 10 }} size="large"
            />
          </div>
          <div>
            <label style={{ fontWeight: 600, fontSize: 13, display: 'block', marginBottom: 6 }}>Description / Articles</label>
            <Input.TextArea
              rows={3}
              placeholder="Détails de la facture..."
              value={newInvoice.items}
              onChange={e => setNewInvoice(p => ({ ...p, items: e.target.value }))}
              style={{ borderRadius: 10 }}
            />
          </div>
          <Button
            type="primary" size="large" block
            onClick={handleCreateOrUpdateInvoice}
            style={{
              borderRadius: 14, height: 48, fontWeight: 700, marginTop: 8,
              background: 'linear-gradient(135deg, #3F51B5, #E91E63)', border: 'none',
            }}
          >
            {isEditMode ? 'Enregistrer les modifications' : 'Créer la facture'}
          </Button>
        </div>
      </Modal>

      {/* ══════ VIEW / DETAIL MODAL ══════ */}
      <Modal
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={
          <Space>
            <Button 
              icon={<PrinterOutlined />} 
              onClick={() => {
                import('../utils/exportUtils').then(({ exportInvoicePDF }) => {
                  exportInvoicePDF(selectedInvoice, formatMoney);
                });
              }}
            >
              Imprimer
            </Button>
            <Button 
              icon={<DownloadOutlined />} 
              type="primary" 
              style={{ background: '#3F51B5', borderColor: '#3F51B5' }}
              onClick={() => {
                import('../utils/exportUtils').then(({ exportInvoicePDF }) => {
                  exportInvoicePDF(selectedInvoice, formatMoney);
                  message.success('Facture PDF générée !');
                });
              }}
            >
              Télécharger PDF
            </Button>
          </Space>
        }
        width={560}
        centered
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <EyeOutlined style={{ color: '#3F51B5' }} />
            <span style={{ fontWeight: 700 }}>Détail Facture</span>
          </div>
        }
      >
        {selectedInvoice && (
          <div>
            <Descriptions bordered column={1} size="small" style={{ marginBottom: 20 }}>
              <Descriptions.Item label="Référence"><b>{selectedInvoice.reference}</b></Descriptions.Item>
              <Descriptions.Item label="Client">{selectedInvoice.client}</Descriptions.Item>
              {canEdit && (
                <Descriptions.Item label="Créée par"><Tag color="purple">{selectedInvoice.createdBy || 'Inconnu'}</Tag></Descriptions.Item>
              )}
              <Descriptions.Item label="Montant total"><b>{formatMoney(selectedInvoice.amount)}</b></Descriptions.Item>
              <Descriptions.Item label="Montant payé">
                <span style={{ color: '#4CAF50', fontWeight: 600 }}>{formatMoney(selectedInvoice.paid || 0)}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Reste à payer">
                <span style={{ color: '#E91E63', fontWeight: 600 }}>
                  {formatMoney(selectedInvoice.amount - (selectedInvoice.paid || 0))}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Échéance">{selectedInvoice.dueDate}</Descriptions.Item>
              <Descriptions.Item label="Statut">
                {selectedInvoice.status === 'paye' && <Tag color="success">Payée</Tag>}
                {selectedInvoice.status === 'en_attente' && <Tag color="warning">En attente</Tag>}
                {selectedInvoice.status === 'en_retard' && <Tag color="error">En retard</Tag>}
              </Descriptions.Item>
            </Descriptions>

            {/* Payment history */}
            <h4 style={{ fontWeight: 700, marginBottom: 12 }}>📋 Historique des paiements</h4>
            {(selectedInvoice.paymentHistory || []).length === 0 ? (
              <Text type="secondary">Aucun paiement enregistré</Text>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(selectedInvoice.paymentHistory || []).map((entry, i) => (
                  <div key={i} style={{
                    padding: '10px 14px', borderRadius: 10, background: '#f8f9fa',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#2d3436' }}>{entry.note}</div>
                      <div style={{ fontSize: 11, color: '#636e72' }}>{entry.date}</div>
                    </div>
                    {entry.amount > 0 && (
                      <span style={{ fontWeight: 700, color: '#4CAF50' }}>+{formatMoney(entry.amount)}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Factures;
