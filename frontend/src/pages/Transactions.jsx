import { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, Select, Tag, DatePicker, message, Row, Col, Typography, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
import dayjs from 'dayjs';
import { useCurrency } from '../context/CurrencyContext';
import { getUserRole, getUserInfo } from '../utils/auth';

const { Option } = Select;

const Transactions = () => {
  const { formatMoney } = useCurrency();
  const role = getUserRole() || 'user';
  const userInfo = getUserInfo();
  const currentUsername = userInfo?.username || 'Moi';

  const allData = [
    { id: 1, date: '2023-10-01', description: 'Achat logiciel', amount: -98400, type: 'expense', category: 'Outils', owner: currentUsername },
    { id: 2, date: '2023-10-05', description: 'Prestation développement', amount: 1968000, type: 'income', category: 'Ventes', owner: currentUsername },
    { id: 3, date: '2023-10-10', description: 'Abonnement cloud', amount: -65600, type: 'expense', category: 'Logiciels', owner: 'user_team1' },
    { id: 4, date: '2023-10-15', description: 'Consultation stratégique', amount: 984000, type: 'income', category: 'Services', owner: 'user_team2' },
  ];

  // Role-based filtering
  const getFilteredData = () => {
    if (role === 'admin') return allData; // Admin voit tout
    if (role === 'manager') return allData.filter(d => d.owner !== 'admin'); // Manager voit users
    return allData.filter(d => d.owner === currentUsername); // User voit que lui
  };

  const [data, setData] = useState(getFilteredData());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      date: dayjs(record.date),
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    setData(data.filter(item => item.id !== id));
    message.success('Transaction supprimée');
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      const formattedValues = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
      };

      if (editingRecord) {
        setData(data.map(item => item.id === editingRecord.id ? { ...formattedValues, id: item.id } : item));
        message.success('Transaction modifiée');
      } else {
        setData([...data, { ...formattedValues, id: Date.now() }]);
        message.success('Transaction ajoutée');
      }
      setIsModalVisible(false);
    });
  };

  const columns = [
    { title: 'Date', dataIndex: 'date', key: 'date', sorter: (a, b) => new Date(a.date) - new Date(b.date) },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Catégorie', dataIndex: 'category', key: 'category' },
    { 
      title: 'Type', dataIndex: 'type', key: 'type',
      render: type => <Tag color={type === 'income' ? 'green' : 'red'}>{type === 'income' ? 'Revenu' : 'Dépense'}</Tag>
    },
    { 
      title: 'Montant', dataIndex: 'amount', key: 'amount',
      render: (amount, record) => (
        <span style={{ color: record.type === 'income' ? '#3f8600' : '#cf1322', fontWeight: 500 }}>
          {record.type === 'income' ? '+' : ''}{formatMoney(amount)}
        </span>
      )
    },
    {
      title: 'Actions', key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button type="text" icon={<EditOutlined style={{ color: '#3F51B5' }} />} onClick={() => handleEdit(record)} style={{ background: 'rgba(63, 81, 181, 0.1)', borderRadius: 8 }} />
          {(role === 'admin' || role === 'manager') && (
            <Button type="text" danger icon={<DeleteOutlined style={{ color: '#E91E63' }} />} onClick={() => handleDelete(record.id)} style={{ background: 'rgba(233, 30, 99, 0.1)', borderRadius: 8 }} />
          )}
        </Space>
      )
    }
  ];

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col><Title level={2} style={{ margin: 0, fontWeight: 800, color: '#1a1a40' }}>💸 Gestion des Transactions</Title></Col>
        <Col>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAdd}
            style={{ borderRadius: 10, background: 'linear-gradient(135deg, #3F51B5, #E91E63)', border: 'none', fontWeight: 600 }}
          >
            Ajouter Transaction
          </Button>
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: 20, boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id" 
          pagination={{ position: ['bottomCenter'] }}
          rowClassName="history-row"
        />
      </Card>

      <Modal title={editingRecord ? "Modifier Transaction" : "Nouvelle Transaction"} open={isModalVisible} onOk={handleOk} onCancel={() => setIsModalVisible(false)} okText="Sauvegarder" cancelText="Annuler">
        <Form form={form} layout="vertical">
          <Form.Item name="date" label="Date" rules={[{ required: true }]}>
             <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
             <Input />
          </Form.Item>
          <Form.Item name="amount" label="Montant" rules={[{ required: true }]}>
             <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
             <Select>
               <Option value="income">Revenu</Option>
               <Option value="expense">Dépense</Option>
             </Select>
          </Form.Item>
          <Form.Item name="category" label="Catégorie" rules={[{ required: true }]}>
             <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Transactions;
