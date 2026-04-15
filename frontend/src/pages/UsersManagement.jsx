import { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Tag, Select, message, Modal, Switch, Badge, Card, Row, Col } from 'antd';
import { DeleteOutlined, StopOutlined, ExclamationCircleOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import { getUserRole } from '../utils/auth';
import { useEnterprise } from '../context/EnterpriseContext';
import axiosClient from '../api/axiosClient';

const { Title } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const UsersManagement = () => {
  const currentRole = getUserRole() || 'user';

  const { activeEnterprise } = useEnterprise();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [activeEnterprise, currentRole]);

  const fetchUsers = async () => {
    if (currentRole === 'admin' && !activeEnterprise) return;
    
    setLoading(true);
    try {
      const url = currentRole === 'admin' && activeEnterprise 
        ? `auth/users/?entreprise_id=${activeEnterprise.id}` 
        : `auth/users/`;
        
      const res = await axiosClient.get(url);
      
      const formatted = res.map(u => ({
        ...u,
        name: u.first_name && u.last_name ? `${u.first_name} ${u.last_name}` : u.username,
        active: u.is_active !== undefined ? u.is_active : true
      }));
      
      setData(formatted);
    } catch (e) {
      console.error(e);
      message.error("Erreur lors de la récupération des utilisateurs.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (userId, newRole) => {
    setData(data.map(user => user.id === userId ? { ...user, role: newRole } : user));
    message.success('Rôle mis à jour avec succès');
  };

  const handleToggleActive = async (userId) => {
    try {
      const res = await axiosClient.patch(`auth/users/${userId}/toggle-active/`);
      setData(data.map(user => {
        if (user.id === userId) {
          const newStatus = res.is_active;
          message.success(`Utilisateur ${newStatus ? 'activé' : 'désactivé'}`);
          return { ...user, active: newStatus };
        }
        return user;
      }));
    } catch (e) {
      message.error(e?.response?.data?.error || "Erreur lors du changement de statut.");
    }
  };

  const handleDelete = (record) => {
    confirm({
      title: 'Confirmer la suppression',
      icon: <ExclamationCircleOutlined />,
      content: `Êtes-vous sûr de vouloir supprimer l'utilisateur "${record.name}" ? Cette action est irréversible.`,
      okText: 'Supprimer',
      okType: 'danger',
      cancelText: 'Annuler',
      async onOk() {
        try {
          await axiosClient.delete(`auth/users/${record.id}/delete/`);
          setData(data.filter(user => user.id !== record.id));
          message.success(`Utilisateur "${record.name}" supprimé`);
        } catch (e) {
          message.error(e?.response?.data?.error || "Erreur lors de la suppression.");
        }
      },
    });
  };

  const columns = [
    {
      title: 'Nom', dataIndex: 'name', key: 'name',
      render: (name, record) => (
        <span style={{ fontWeight: 600 }}>
          {name}
          {!record.active && <Tag color="default" style={{ marginLeft: 8 }}>Inactif</Tag>}
        </span>
      ),
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Rôle', dataIndex: 'role', key: 'role',
      render: (role, record) => {
        const colors = { admin: 'red', manager: 'gold', user: 'blue' };
        const labels = { admin: 'Admin', manager: 'Manager', user: 'Utilisateur' };
        
        // Only admin can change roles, but they cannot change their own admin role
        if (currentRole === 'admin' && record.role !== 'admin') {
          return (
            <Select
              value={role}
              style={{ width: 130 }}
              onChange={(val) => handleRoleChange(record.id, val)}
            >
              <Option value="manager">Manager</Option>
              <Option value="user">Utilisateur</Option>
            </Select>
          );
        }
        return <Tag color={colors[role] || 'default'}>{labels[role] || role}</Tag>;
      }
    },
    {
      title: 'Statut', dataIndex: 'active', key: 'active',
      render: (active, record) => (
        <Switch
          checked={active}
          onChange={() => handleToggleActive(record.id)}
          checkedChildren="Actif"
          unCheckedChildren="Inactif"
          disabled={record.role === 'admin'}
        />
      ),
    },
    {
      title: 'Actions', key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          {record.role !== 'admin' && (
            <Button
              type="text"
              danger
              icon={<DeleteOutlined style={{ color: '#E91E63' }} />}
              onClick={() => handleDelete(record)}
              style={{ borderRadius: 8, background: 'rgba(233, 30, 99, 0.1)' }}
            />
          )}
        </Space>
      )
    }
  ];

  const activeCount = data.filter(u => u.active).length;
  const inactiveCount = data.filter(u => !u.active).length;

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <Title level={2} style={{ marginBottom: 24, fontWeight: 800, color: '#1a1a40' }}>
        {currentRole === 'admin' ? '🛡️' : '👔'} Gestion des Utilisateurs
      </Title>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <TeamOutlined style={{ fontSize: 24, color: '#667eea' }} />
              <div>
                <div style={{ fontSize: 24, fontWeight: 700 }}>{data.length}</div>
                <div style={{ color: '#8c8c8c' }}>Total</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Badge status="success" />
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#52c41a' }}>{activeCount}</div>
                <div style={{ color: '#8c8c8c' }}>Actifs</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Badge status="default" />
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#8c8c8c' }}>{inactiveCount}</div>
                <div style={{ color: '#8c8c8c' }}>Inactifs</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: 20, boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id" 
          loading={loading}
          pagination={{ position: ['bottomCenter'] }}
          rowClassName="history-row"
        />
      </Card>

      {currentRole === 'manager' && (
        <div style={{ marginTop: 16, padding: 12, background: '#fff7e6', borderRadius: 8, border: '1px solid #ffe58f' }}>
          <span style={{ color: '#d48806' }}>ℹ️ En tant que Manager, vous ne pouvez gérer que les utilisateurs (rôle User).</span>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
