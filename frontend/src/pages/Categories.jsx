import { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Row, Col, Typography, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Categories = () => {
  const [data, setData] = useState([
    { id: 1, name: 'Logiciels', description: 'Abonnements SaaS' },
    { id: 2, name: 'Ventes', description: 'Revenus liés aux ventes' },
  ]);
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
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    setData(data.filter(item => item.id !== id));
    message.success('Catégorie supprimée');
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingRecord) {
        setData(data.map(item => item.id === editingRecord.id ? { ...values, id: item.id } : item));
        message.success('Catégorie modifiée');
      } else {
        setData([...data, { ...values, id: Date.now() }]);
        message.success('Catégorie ajoutée');
      }
      setIsModalVisible(false);
    });
  };

  const columns = [
    { title: 'Nom', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Actions', key: 'actions', width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button type="text" icon={<EditOutlined style={{ color: '#3F51B5' }} />} onClick={() => handleEdit(record)} style={{ background: 'rgba(63, 81, 181, 0.1)', borderRadius: 8 }} />
          <Button type="text" danger icon={<DeleteOutlined style={{ color: '#E91E63' }} />} onClick={() => handleDelete(record.id)} style={{ background: 'rgba(233, 30, 99, 0.1)', borderRadius: 8 }} />
        </Space>
      )
    }
  ];

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col><Title level={2} style={{ margin: 0, fontWeight: 800, color: '#1a1a40' }}>🏷️ Gestion des Catégories</Title></Col>
        <Col>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAdd}
            style={{ borderRadius: 10, background: 'linear-gradient(135deg, #3F51B5, #E91E63)', border: 'none', fontWeight: 600 }}
          >
            Ajouter Catégorie
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

      <Modal title={editingRecord ? "Modifier Catégorie" : "Nouvelle Catégorie"} open={isModalVisible} onOk={handleOk} onCancel={() => setIsModalVisible(false)} okText="Sauvegarder" cancelText="Annuler">
        <Form form={form} layout="vertical">
             <Form.Item name="name" label="Nom" rules={[{ required: true }]}>
                <Input />
             </Form.Item>
             <Form.Item name="description" label="Description">
                <Input.TextArea rows={3} />
             </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Categories;
