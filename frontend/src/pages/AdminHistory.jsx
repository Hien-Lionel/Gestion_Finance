import { Typography, Table, Tag, Card, Select, Row, Col, Button, message } from 'antd';
import { useState } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { useCurrency } from '../context/CurrencyContext';

const { Title, Text } = Typography;
const { Option } = Select;

const AdminHistory = () => {
  const { formatMoney } = useCurrency();
  const [filterUser, setFilterUser] = useState('all');
  const [filterRole, setFilterRole] = useState('all');

  const data = [
    { id: 1, date: '2023-10-15 14:30', user: 'Alice Dupont', role: 'admin', action: 'Modification paramètres', detail: 'Devise changée vers FCFA', type: 'system' },
    { id: 2, date: '2023-10-15 13:00', user: 'Bob Martin', role: 'manager', action: 'Ajout transaction', detail: `Vente service +${formatMoney(3280000)}`, type: 'transaction' },
    { id: 3, date: '2023-10-15 11:45', user: 'Charlie Roux', role: 'user', action: 'Modification catégorie', detail: 'Catégorie "Outils" mise à jour', type: 'categorie' },
    { id: 4, date: '2023-10-14 17:20', user: 'Diana Lefèvre', role: 'user', action: 'Paiement dette', detail: `Fournisseur B — ${formatMoney(295200)}`, type: 'dette' },
    { id: 5, date: '2023-10-14 16:10', user: 'Alice Dupont', role: 'admin', action: 'Suppression utilisateur', detail: 'Utilisateur "Test User" supprimé', type: 'system' },
    { id: 6, date: '2023-10-14 10:00', user: 'Bob Martin', role: 'manager', action: 'Export rapport', detail: 'Rapport mensuel PDF exporté', type: 'rapport' },
    { id: 7, date: '2023-10-13 15:30', user: 'Emma Petit', role: 'user', action: 'Création facture', detail: 'FAC-2023-007 — Client MNO', type: 'facture' },
    { id: 8, date: '2023-10-13 11:00', user: 'François Moreau', role: 'user', action: 'Ajout transaction', detail: `Achat équipement -${formatMoney(820000)}`, type: 'transaction' },
    { id: 9, date: '2023-10-12 09:45', user: 'Alice Dupont', role: 'admin', action: 'Désactivation utilisateur', detail: 'Utilisateur "Inactif" désactivé', type: 'system' },
    { id: 10, date: '2023-10-11 14:00', user: 'Bob Martin', role: 'manager', action: 'Création facture', detail: 'FAC-2023-006 — Client PQR', type: 'facture' },
  ];

  const users = [...new Set(data.map(d => d.user))];

  const filteredData = data.filter(d => {
    if (filterUser !== 'all' && d.user !== filterUser) return false;
    if (filterRole !== 'all' && d.role !== filterRole) return false;
    return true;
  });

  const handleExport = () => {
    import('../utils/exportUtils').then(({ exportToCSV }) => {
      const columns = [
        { title: 'Date', dataIndex: 'date' },
        { title: 'Utilisateur', dataIndex: 'user' },
        { title: 'Rôle', dataIndex: 'role' },
        { title: 'Action', dataIndex: 'action' },
        { title: 'Détail', dataIndex: 'detail' },
        { title: 'Type', dataIndex: 'type' }
      ];
      exportToCSV(filteredData, columns, 'historique_admin');
      message.success('Export CSV généré avec succès !');
    });
  };

  const columns = [
    { title: 'Date', dataIndex: 'date', key: 'date', width: 180, sorter: (a, b) => new Date(a.date) - new Date(b.date) },
    { title: 'Utilisateur', dataIndex: 'user', key: 'user', render: (user) => <span style={{ fontWeight: 600, color: '#2d3436' }}>{user}</span> },
    {
      title: 'Rôle', dataIndex: 'role', key: 'role',
      render: (role) => {
        const colors = { admin: 'magenta', manager: 'gold', user: 'blue' };
        const labels = { admin: 'Admin', manager: 'Manager', user: 'Utilisateur' };
        return <Tag color={colors[role]} style={{ borderRadius: 6, fontWeight: 500 }}>{labels[role]}</Tag>;
      }
    },
    { title: 'Action', dataIndex: 'action', key: 'action', render: text => <Text strong>{text}</Text> },
    { title: 'Détail', dataIndex: 'detail', key: 'detail', render: text => <Text type="secondary">{text}</Text> },
    {
      title: 'Type', dataIndex: 'type', key: 'type',
      render: (type) => {
        const colors = { transaction: 'blue', facture: 'purple', categorie: 'cyan', dette: 'red', rapport: 'green', system: 'volcano' };
        return <Tag color={colors[type] || 'default'} style={{ borderRadius: 6 }}>{type.toUpperCase()}</Tag>;
      },
    },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col><Title level={2} style={{ margin: 0, fontWeight: 800, color: '#1a1a40' }}>🛡️ Historique Administrateur</Title></Col>
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
        <Row gutter={16} style={{ marginBottom: 24, padding: '16px', background: '#f8f9fa', borderRadius: 12 }}>
          <Col>
            <span style={{ marginRight: 8, fontWeight: 600, color: '#636e72' }}>👤 Utilisateur :</span>
            <Select value={filterUser} onChange={setFilterUser} style={{ width: 220 }} size="large">
              <Option value="all">Tous les utilisateurs</Option>
              {users.map(u => <Option key={u} value={u}>{u}</Option>)}
            </Select>
          </Col>
          <Col>
            <span style={{ marginRight: 8, fontWeight: 600, color: '#636e72', marginLeft: 16 }}>🔑 Rôle :</span>
            <Select value={filterRole} onChange={setFilterRole} style={{ width: 180 }} size="large">
              <Option value="all">Tous les rôles</Option>
              <Option value="admin">Admin</Option>
              <Option value="manager">Manager</Option>
              <Option value="user">Utilisateur</Option>
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

export default AdminHistory;
