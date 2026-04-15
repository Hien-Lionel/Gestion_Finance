import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Modal } from 'antd';
import { LockOutlined, UserOutlined, MailOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { setToken, setUserRole, setUserInfo } from '../utils/auth';
import { useEnterprise } from '../context/EnterpriseContext';
import axiosClient from '../api/axiosClient';

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setActiveEnterpriseId } = useEnterprise();
  const [isForgotModalVisible, setIsForgotModalVisible] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleForgotPassword = async (values) => {
    setForgotLoading(true);
    try {
      if (forgotStep === 1) {
        await axiosClient.post('auth/forgot-password/', { email: values.email });
        setForgotEmail(values.email);
        setForgotStep(2);
        message.success("Si l'email existe, un code vous a été envoyé !");
      } else {
        await axiosClient.post('auth/reset-password/', {
          email: forgotEmail,
          code: values.code,
          new_password: values.newPassword
        });
        message.success("Mot de passe réinitialisé avec succès !");
        setIsForgotModalVisible(false);
        setForgotStep(1);
      }
    } catch (error) {
       message.error(error?.response?.data?.error || "Une erreur est survenue.");
    } finally {
      setForgotLoading(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Call Django backend login endpoint
      const response = await axiosClient.post('auth/login/', {
        username: values.username,
        password: values.password,
      });

      if (response && response.access && response.user) {
        // Store tokens and user info
        setToken(response.access);
        if (response.refresh) {
          localStorage.setItem('refreshToken', response.refresh);
        }
        
        const userRole = response.user.role || 'user';
        setUserRole(userRole);
        setUserInfo({
          id: response.user.id,
          username: response.user.username,
          email: response.user.email,
          role: userRole,
          telephone: response.user.telephone,
        });

        message.success(`Bienvenue, ${response.user.username} !`);
        
        // Redirect based on role
        if (userRole === 'admin') {
          navigate('/admin');
        } else if (userRole === 'manager') {
          navigate('/manager-dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      let errorMsg = "Une erreur serveur est survenue.";
      
      if (error?.response?.status === 401 || error?.response?.data?.detail?.includes('No active account')) {
        errorMsg = "Compte inexistant ou identifiants incorrects. Veuillez vérifier vos accès.";
      } else if (error?.response?.data?.detail) {
        errorMsg = error.response.data.detail;
      }
      
      message.error(errorMsg);
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a23 0%, #1a1a40 50%, #2d1b69 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Glow effects */}
      <div style={{
        position: 'absolute', top: '20%', left: '30%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(102,126,234,0.2) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', right: '25%',
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,87,108,0.15) 0%, transparent 70%)',
        filter: 'blur(50px)', pointerEvents: 'none',
      }} />

      <Card style={{
        width: 420, borderRadius: 16, border: 'none',
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
          <Title level={2} style={{ margin: 0, color: '#1a1a40' }}>Connexion</Title>
          <p style={{ color: '#8c8c8c' }}>Accédez à votre espace Faso Finance</p>
        </div>

        <Form name="normal_login" initialValues={{ remember: true }} onFinish={onFinish} size="large">
          <Form.Item name="username" rules={[{ required: true, message: 'Veuillez entrer votre nom d\'utilisateur!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Nom d'utilisateur" style={{ borderRadius: 10 }} />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Veuillez entrer votre mot de passe!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Mot de passe" style={{ borderRadius: 10 }} />
          </Form.Item>

          <div style={{ textAlign: 'right', marginBottom: 16 }}>
             <Button type="link" onClick={() => setIsForgotModalVisible(true)} style={{ padding: 0, color: '#ff4d4f' }}>
               Mot de passe oublié ?
             </Button>
          </div>

          <Form.Item>
            <Button
              type="primary" htmlType="submit" loading={loading}
              style={{
                width: '100%', height: 48, borderRadius: 10, fontSize: 16, fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none',
              }}
            >
              Se connecter
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            <Text>Pas encore de compte ? </Text>
            <Link to="/register" style={{ color: '#667eea', fontWeight: 600 }}>S'inscrire ici</Link>
          </div>
        </Form>
      </Card>

      <Modal
        title="Réinitialiser le mot de passe"
        open={isForgotModalVisible}
        onCancel={() => { setIsForgotModalVisible(false); setForgotStep(1); }}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" onFinish={handleForgotPassword}>
          {forgotStep === 1 ? (
            <>
              <p>Entrez votre email pour recevoir un code de réinitialisation.</p>
              <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Veuillez entrer un email valide!' }]}>
                <Input prefix={<MailOutlined />} placeholder="Votre email" size="large" />
              </Form.Item>
              <Button type="primary" htmlType="submit" loading={forgotLoading} block size="large">
                Envoyer le code
              </Button>
            </>
          ) : (
            <>
              <p>Un code a été envoyé à <strong>{forgotEmail}</strong> (Vérifiez la console backend locale !)</p>
              <Form.Item name="code" rules={[{ required: true, message: 'Le code est requis!' }]}>
                <Input prefix={<SafetyCertificateOutlined />} placeholder="Code à 6 chiffres" size="large" />
              </Form.Item>
              <Form.Item name="newPassword" rules={[{ required: true, message: 'Veuillez entrer un nouveau mot de passe!' }, { min: 8, message: 'Minimum 8 caractères' }]}>
                <Input.Password prefix={<LockOutlined />} placeholder="Nouveau mot de passe" size="large" />
              </Form.Item>
              <Button type="primary" htmlType="submit" loading={forgotLoading} block size="large">
                Réinitialiser
              </Button>
            </>
          )}
        </Form>
      </Modal>

    </div>
  );
};

export default Login;

