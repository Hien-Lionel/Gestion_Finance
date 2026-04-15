import { Typography, Table, Tag, Card, Select, Row, Col, Button, message } from 'antd';
import { useState } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { useCurrency } from '../context/CurrencyContext';

const { Title, Text } = Typography;
const { Option } = Select;

const ManagerHistory = () => {
  const { formatMoney } = useCurrency();
  const [filterUser, setFilterUser] = useState('all');

  const data = [
    { id: 1, date: '2023-10-15 14:30', user: 'Charlie Roux', action: 'Ajout transaction', detail: `Vente produit +${formatMoney(3280000)}`, type: 'transaction' },
    { id: 2, date: '2023-10-15 13:00', user: 'Diana Lefèvre', action: 'Création facture', detail: 'FAC-2023-006 — Client GHI', type: 'facture' },
    { id: 3, date: '2023-10-14 17:20', user: 'Emma Petit', action: 'Paiement dette', detail: `Fournisseur C — ${formatMoney(295200)}`, type: 'dette' },
    { id: 4, date: '2023-10-14 16:10', user: 'Charlie Roux', action: 'Modification catégorie', detail: 'Catégorie "Logiciels" ajoutée', type: 'categorie' },
    { id: 5, date: '2023-10-14 10:00', user: 'François Moreau', action: 'Ajout transaction', detail: `Prestation conseil +${formatMoney(1640000)}`, type: 'transaction' },
    { id: 6, date: '2023-10-13 15:30', user: 'Diana Lefèvre', action: 'Suppression transaction', detail: 'Transaction #301 supprimée', type: 'transaction' },
    { id: 7, date: '2023-10-13 11:00', user: 'Emma Petit', action: 'Création facture', detail: 'FAC-2023-005 — Client JKL', type: 'facture' },
    { id: 8, date: '2023-10-12 09:45', user: 'François Moreau', action: 'Ajout transaction', detail: `Achat matériel -${formatMoney(492000)}`, type: 'transaction' },
  ];

  const users = [...new Set(data.map(d => d.user))];
  const filteredData = filterUser === 'all' ? data : data.filter(d => d.user === filterUser);

  const handleExport = () => {
    import('../utils/exportUtils').then(({ exportToCSV }) => {
      const columns = [
        { title: 'Date', dataIndex: 'date' },
        { title: 'Utilisateur', dataIndex: 'user' },
        { title: 'Action', dataIndex: 'action' },
        { title: 'Détail', dataIndex: 'detail' },
        { title: 'Type', dataIndex: 'type' }
      ];
      exportToCSV(filteredData, columns, 'historique_equipe');
      message.success('Export CSV généré avec succès !');
    });
  };

  const columns = [
    { title: 'Date', dataIndex: 'date', key: 'date', width: 180, sorter: (a, b) => new Date(a.date) - new Date(b.date) },
    { title: 'Utilisateur', dataIndex: 'user', key: 'user', render: (user) => <span style={{ fontWeight: 600, color: '#2d3436' }}>{user}</span> },
    { title: 'Action', dataIndex: 'action', key: 'action', render: text => <Text strong>{text}</Text> },
    { title: 'Détail', dataIndex: 'detail', key: 'detail', render: text => <Text type="secondary">{text}</Text> },
    {
      title: 'Type', dataIndex: 'type', key: 'type',
      render: (type) => {
        const colors = { transaction: 'blue', facture: 'purple', categorie: 'cyan', dette: 'red' };
        return <Tag color={colors[type] || 'default'} style={{ borderRadius: 6 }}>{type.toUpperCase()}</Tag>;
      },
      filters: [
        { text: 'Transaction', value: 'transaction' },
        { text: 'Facture', value: 'facture' },
        { text: 'Catégorie', value: 'categorie' },
        { text: 'Dette', value: 'dette' },
      ],
      onFilter: (value, record) => record.type === value,
    },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col><Title level={2} style={{ margin: 0, fontWeight: 800, color: '#1a1a40' }}>📊 Historique Équipe</Title></Col>
        <Col>
          <Button 
            type="primary" 
            icon={<DownloadOutlined />} 
            onClick={handleExport}
            style={{ borderRadius: 10, background: 'linear-gradient(135deg, #3F51B5, #E91E63)', border: 'none', fontWeight: 600 }}
          >
            Exporter CSV
          </Button>
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: 20, boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
        <Row style={{ marginBottom: 24, padding: '16px', background: '#f8f9fa', borderRadius: 12 }}>
          <Col>
            <span style={{ marginRight: 8, fontWeight: 600, color: '#636e72' }}>👤 Filtrer par utilisateur :</span>
            <Select value={filterUser} onChange={setFilterUser} style={{ width: 220 }} size="large">
              <Option value="all">Tous les membres</Option>
              {users.map(u => <Option key={u} value={u}>{u}</Option>)}
            </Select>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{ pageSize: 10, position: ['bottomCenter'] }}
          rowClassName="history-row"
        />
      </Card>
    </div>
  );
};

export default ManagerHistory;
