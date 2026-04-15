import { Typography, Table, Tag, Card, Row, Col, Button, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useCurrency } from '../context/CurrencyContext';
import { getUserInfo } from '../utils/auth';

const { Title, Text } = Typography;

const History = () => {
  const { formatMoney } = useCurrency();
  const userInfo = getUserInfo();
  const currentUsername = userInfo?.username || 'Moi';

  const data = [
    { id: 1, date: '2023-10-15 14:30', action: 'Ajout transaction', detail: `Prestation développement +${formatMoney(1968000)}`, type: 'transaction' },
    { id: 2, date: '2023-10-14 10:00', action: 'Création facture', detail: 'FAC-2023-005 — Client DEF', type: 'facture' },
    { id: 3, date: '2023-10-13 16:45', action: 'Paiement dette', detail: `Fournisseur A — ${formatMoney(787200)}`, type: 'dette' },
    { id: 4, date: '2023-10-12 09:15', action: 'Modification catégorie', detail: 'Catégorie "Marketing" mise à jour', type: 'categorie' },
    { id: 5, date: '2023-10-11 11:30', action: 'Suppression transaction', detail: 'Transaction #245 supprimée', type: 'transaction' },
    { id: 6, date: '2023-10-10 15:00', action: 'Ajout transaction', detail: `Achat fournitures -${formatMoney(131200)}`, type: 'transaction' },
    { id: 7, date: '2023-10-09 08:45', action: 'Création facture', detail: 'FAC-2023-004 — Client ABC', type: 'facture' },
    { id: 8, date: '2023-10-08 14:20', action: 'Modification profil', detail: 'Email mis à jour', type: 'profil' },
  ];

  const handleExport = () => {
    import('../utils/exportUtils').then(({ exportToCSV }) => {
      const columns = [
        { title: 'Date', dataIndex: 'date' },
        { title: 'Action', dataIndex: 'action' },
        { title: 'Détail', dataIndex: 'detail' },
        { title: 'Type', dataIndex: 'type' }
      ];
      exportToCSV(data, columns, 'mon_historique');
      message.success('Export CSV généré avec succès !');
    });
  };

  const columns = [
    { title: 'Date', dataIndex: 'date', key: 'date', width: 180, sorter: (a, b) => new Date(a.date) - new Date(b.date) },
    { title: 'Action', dataIndex: 'action', key: 'action', render: text => <Text strong>{text}</Text> },
    { title: 'Détail', dataIndex: 'detail', key: 'detail', render: text => <Text type="secondary">{text}</Text> },
    {
      title: 'Type', dataIndex: 'type', key: 'type',
      render: (type) => {
        const colors = { transaction: 'blue', facture: 'purple', categorie: 'cyan', dette: 'red', profil: 'green' };
        const labels = { transaction: 'Transaction', facture: 'Facture', categorie: 'Catégorie', dette: 'Dette', profil: 'Profil' };
        return <Tag color={colors[type] || 'default'} style={{ borderRadius: 6, fontWeight: 500 }}>{labels[type] || type}</Tag>;
      },
      filters: [
        { text: 'Transaction', value: 'transaction' },
        { text: 'Facture', value: 'facture' },
        { text: 'Catégorie', value: 'categorie' },
        { text: 'Dette', value: 'dette' },
        { text: 'Profil', value: 'profil' },
      ],
      onFilter: (value, record) => record.type === value,
    },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#1a1a40' }}>📋 Mon Historique</Title>
          <Text type="secondary">Actions effectu&eacute;es par {currentUsername}</Text>
        </Col>
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
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={{ pageSize: 10, position: ['bottomCenter'] }}
          rowClassName="history-row"
        />
      </Card>
    </div>
  );
};

export default History;
