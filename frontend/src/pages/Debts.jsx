import { Table, Tag, Row, Col, Typography, Card } from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

const { Title } = Typography;

const Debts = () => {
  const { formatMoney } = useCurrency();
  const navigate = useNavigate();

  const data = [
    { id: 1, creditor: 'Banque XYZ', amount: 3280000, dueDate: '2023-11-01', status: 'en_cours' },
    { id: 2, creditor: 'Fournisseur A', amount: 787200, dueDate: '2023-09-15', status: 'en_retard' },
    { id: 3, creditor: 'Fournisseur B', amount: 295200, dueDate: '2023-10-20', status: 'paye' },
  ];

  const columns = [
    { title: 'Créancier', dataIndex: 'creditor', key: 'creditor', render: text => <span style={{ fontWeight: 600, color: '#2d3436' }}>{text}</span> },
    { title: 'Montant', dataIndex: 'amount', key: 'amount', render: (val) => <span style={{ fontWeight: 700 }}>{formatMoney(val)}</span> },
    { title: 'Échéance', dataIndex: 'dueDate', key: 'dueDate' },
    {
      title: 'Statut', dataIndex: 'status', key: 'status',
      render: (status, record) => {
        const isLate = dayjs().isAfter(dayjs(record.dueDate)) && status !== 'paye';
        const color = status === 'paye' ? 'green' : (isLate || status === 'en_retard' ? 'red' : 'gold');
        const text = status === 'paye' ? 'Payé' : (isLate || status === 'en_retard' ? 'En retard' : 'En cours');
        return <Tag color={color} style={{ borderRadius: 6, fontWeight: 500 }}>{text}</Tag>;
      }
    }
  ];

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col><Title level={2} style={{ margin: 0, fontWeight: 800, color: '#1a1a40' }}>💳 Gestion des Dettes</Title></Col>
      </Row>
      <Card bordered={false} style={{ borderRadius: 20, boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id" 
          pagination={{ position: ['bottomCenter'] }}
          rowClassName={() => 'history-row clickable-row'}
          onRow={(record) => {
            return {
              onClick: () => {
                // Navigates to factures, potentially passing a search param or state.
                navigate(`/factures?debt_id=${record.id}`);
              },
              style: { cursor: 'pointer' }
            };
          }}
        />
      </Card>
    </div>
  );
};

export default Debts;
