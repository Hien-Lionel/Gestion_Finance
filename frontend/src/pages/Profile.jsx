import { useState } from 'react';
import { Card, Typography, Form, Input, Button, Divider, Avatar, Row, Col, message, Descriptions, Tabs } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, EditOutlined } from '@ant-design/icons';
import { getUserInfo, updateUserInfo, getUserRole } from '../utils/auth';

const { Title } = Typography;

const Profile = () => {
  const [userInfo, setUserInfo] = useState(getUserInfo() || {
    username: 'test',
    email: 'test@test.com',
    role: getUserRole() || 'user',
    dateJoined: '2023-01-15',
  });

  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const getRoleBadge = (role) => {
    const colors = { admin: '#f5222d', manager: '#fa8c16', user: '#1890ff' };
    const labels = { admin: 'Administrateur', manager: 'Manager', user: 'Utilisateur' };
    return <span style={{ background: colors[role] || '#1890ff', color: '#fff', padding: '2px 12px', borderRadius: 12, fontSize: 12 }}>{labels[role] || role}</span>;
  };

  const handleProfileUpdate = (values) => {
    setProfileLoading(true);
    setTimeout(() => {
      const updated = updateUserInfo(values);
      setUserInfo(updated);
      message.success('Profil mis à jour avec succès !');
      setProfileLoading(false);
    }, 800);
  };

  const handlePasswordChange = (values) => {
    setPasswordLoading(true);
    setTimeout(() => {
      if (values.newPassword !== values.confirmPassword) {
        message.error('Les mots de passe ne correspondent pas.');
        setPasswordLoading(false);
        return;
      }
      if (values.newPassword.length < 6) {
        message.error('Le mot de passe doit contenir au moins 6 caractères.');
        setPasswordLoading(false);
        return;
      }
      message.success('Mot de passe modifié avec succès !');
      passwordForm.resetFields();
      setPasswordLoading(false);
    }, 800);
  };

  const tabItems = [
    {
      key: 'profile',
      label: 'Profil',
      children: (
        <div>
          <Card bordered={false} style={{ marginBottom: 24 }}>
            <Row align="middle" gutter={24}>
              <Col>
                <Avatar size={80} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
              </Col>
              <Col>
                <Title level={4} style={{ margin: 0 }}>{userInfo.username}</Title>
                <p style={{ color: '#8c8c8c', margin: '4px 0' }}>{userInfo.email}</p>
                {getRoleBadge(userInfo.role)}
              </Col>
            </Row>
          </Card>

          <Card bordered={false} title={<span><EditOutlined /> Modifier mes informations</span>}>
            <Form
              form={profileForm}
              layout="vertical"
              initialValues={{ username: userInfo.username, email: userInfo.email }}
              onFinish={handleProfileUpdate}
              style={{ maxWidth: 500 }}
            >
              <Form.Item name="username" label="Nom d'utilisateur" rules={[{ required: true, message: 'Requis' }]}>
                <Input prefix={<UserOutlined />} placeholder="Nom d'utilisateur" />
              </Form.Item>
              <Form.Item name="email" label="Adresse Email" rules={[{ required: true, message: 'Requis' }, { type: 'email', message: 'Email invalide' }]}>
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={profileLoading} icon={<EditOutlined />}>
                  Enregistrer les modifications
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      ),
    },
    {
      key: 'password',
      label: 'Mot de passe',
      children: (
        <Card bordered={false} title={<span><LockOutlined /> Changer le mot de passe</span>}>
          <Form form={passwordForm} layout="vertical" onFinish={handlePasswordChange} style={{ maxWidth: 500 }}>
            <Form.Item name="currentPassword" label="Mot de passe actuel" rules={[{ required: true, message: 'Requis' }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Mot de passe actuel" />
            </Form.Item>
            <Divider />
            <Form.Item name="newPassword" label="Nouveau mot de passe" rules={[{ required: true, message: 'Requis' }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Nouveau mot de passe" />
            </Form.Item>
            <Form.Item name="confirmPassword" label="Confirmer le nouveau mot de passe" rules={[{ required: true, message: 'Requis' }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Confirmer le mot de passe" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={passwordLoading} danger>
                Modifier le mot de passe
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Title level={2}>Mon Profil</Title>
      <Tabs defaultActiveKey="profile" items={tabItems} />
    </div>
  );
};

export default Profile;
