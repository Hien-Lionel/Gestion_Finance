import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Select, Alert } from 'antd';
import { LockOutlined, UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const { Title, Text } = Typography;
const { Option } = Select;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('user');
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Call Django backend registration endpoint
      const response = await axiosClient.post('auth/register/', {
        username: values.username,
        email: values.email,
        password: values.password,
        role: selectedRole,
        telephone: values.telephone || '',
        roleCode: values.roleCode,
        enterpriseCode: values.enterpriseCode,
      });

      if (response && response.id) {
        message.success('Compte créé avec succès ! Connectez-vous.');
        setTimeout(() => {
          navigate('/login');
        }, 800);
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMsg = error?.response?.data?.detail || 
                       error?.response?.data?.username?.[0] ||
                       error?.response?.data?.email?.[0] ||
                       'Échec de la création du compte.';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a23 0%, #1a1a40 50%, #2d1b69 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '30%', right: '30%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(102,126,234,0.2) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      <Card style={{
        width: 480, borderRadius: 16, border: 'none',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        background: 'rgba(255,255,255,0.95)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 'bold', fontSize: 18,
          }}>SF</div>
          <Title level={2} style={{ margin: 0, color: '#1a1a40' }}>Inscription</Title>
          <p style={{ color: '#8c8c8c' }}>Créez votre compte Faso Finance</p>
        </div>

        <Form name="normal_register" onFinish={onFinish} size="large">
          <Form.Item name="username" rules={[{ required: true, message: 'Veuillez choisir un nom d\'utilisateur!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Nom d'utilisateur" style={{ borderRadius: 10 }} />
          </Form.Item>
          <Form.Item name="email" rules={[{ required: true, message: 'Veuillez entrer votre email!' }, { type: 'email', message: 'Email invalide!' }]}>
            <Input type="email" placeholder="Email" style={{ borderRadius: 10 }} />
          </Form.Item>
          <Form.Item name="telephone" rules={[{ message: 'Numéro de téléphone invalide!' }]}>
            <Input prefix={<PhoneOutlined />} placeholder="Téléphone (optionnel)" style={{ borderRadius: 10 }} />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Veuillez entrer un mot de passe!' }, { min: 8, message: 'Le mot de passe doit avoir au moins 8 caractères!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Mot de passe (min. 8 caractères)" style={{ borderRadius: 10 }} />
          </Form.Item>
          <Form.Item name="confirmPassword" rules={[
            { required: true, message: 'Veuillez confirmer votre mot de passe!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) return Promise.resolve();
                return Promise.reject(new Error('Les mots de passe ne correspondent pas!'));
              },
            }),
          ]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Confirmer le mot de passe" style={{ borderRadius: 10 }} />
          </Form.Item>

          {/* Role selection */}
          <Form.Item label={<span style={{ fontWeight: 600, color: '#1a1a40' }}>Rôle</span>}>
            <Select
              value={selectedRole}
              onChange={setSelectedRole}
              style={{ borderRadius: 10 }}
            >
              <Option value="user">👤 Utilisateur</Option>
              <Option value="manager">👔 Manager</Option>
              <Option value="admin">🛡️ Administrateur</Option>
            </Select>
          </Form.Item>

          <Alert
            message="Le rôle détermine vos droits sur le système et l'entreprise."
            type="info"
            showIcon
            style={{ marginBottom: 16, borderRadius: 10 }}
          />

          {selectedRole !== 'user' && (
            <Form.Item
              name="roleCode"
              rules={[{ required: true, message: 'Le code de vérification est requis!' }]}
            >
              <Input
                placeholder={`Code secret ${selectedRole === 'admin' ? 'Administrateur' : 'Manager'}`}
                style={{ borderRadius: 10 }}
              />
            </Form.Item>
          )}

          {selectedRole !== 'admin' && (
            <Form.Item
              name="enterpriseCode"
              rules={[{ required: true, message: "Le code d'entreprise est requis!" }]}
            >
              <Input
                placeholder="Code Entreprise (fourni par votre admin)"
                style={{ borderRadius: 10 }}
              />
            </Form.Item>
          )}

          <Form.Item>
            <Button
              type="primary" htmlType="submit" loading={loading}
              style={{
                width: '100%', height: 48, borderRadius: 10, fontSize: 16, fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none',
              }}
            >
              S'inscrire
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            <Text>Déjà un compte ? </Text>
            <Link to="/login" style={{ color: '#667eea', fontWeight: 600 }}>Connectez-vous</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
