import { useNavigate } from 'react-router-dom';
import { Button, Typography, Row, Col } from 'antd';
import {
  DashboardOutlined,
  LineChartOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <DashboardOutlined style={{ fontSize: 40, color: '#fff' }} />,
      title: 'Tableau de bord intelligent',
      desc: 'Visualisez vos finances en temps réel avec des graphiques clairs et intuitifs.',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      icon: <LineChartOutlined style={{ fontSize: 40, color: '#fff' }} />,
      title: 'Rapports & Analyses',
      desc: 'Générez des rapports automatiques et exportez-les en PDF ou CSV.',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      icon: <SafetyCertificateOutlined style={{ fontSize: 40, color: '#fff' }} />,
      title: 'Sécurité maximale',
      desc: 'Authentification JWT, protection des données et gestion des rôles.',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      icon: <ThunderboltOutlined style={{ fontSize: 40, color: '#fff' }} />,
      title: 'Recommandations IA',
      desc: 'Des conseils personnalisés pour optimiser vos finances automatiquement.',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a23', overflow: 'hidden' }}>
      {/* Navbar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 60px', position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 100, backdropFilter: 'blur(10px)', background: 'rgba(10,10,35,0.8)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 'bold', fontSize: 14,
          }}>SF</div>
          <span style={{ color: '#fff', fontSize: 20, fontWeight: 700 }}>Faso Finance</span>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <Button type="text" style={{ color: '#b0b0d0' }} onClick={() => navigate('/login')}>Connexion</Button>
          <Button
            onClick={() => navigate('/register')}
            style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              border: 'none', color: '#fff', borderRadius: 8, fontWeight: 600,
            }}
          >S'inscrire</Button>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', paddingTop: 180, paddingBottom: 80, position: 'relative',
      }}>
        {/* Glow Background */}
        <div style={{
          position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(102,126,234,0.25) 0%, transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: 200, right: '15%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,87,108,0.2) 0%, transparent 70%)',
          filter: 'blur(50px)', pointerEvents: 'none',
        }} />

        <div style={{
          display: 'inline-block', padding: '4px 16px', borderRadius: 20,
          background: 'rgba(102,126,234,0.15)', border: '1px solid rgba(102,126,234,0.3)',
          color: '#667eea', fontSize: 14, fontWeight: 600, marginBottom: 24,
        }}>
          🚀 Plateforme de gestion financière nouvelle génération
        </div>

        <Title level={1} style={{
          color: '#fff', fontSize: 56, fontWeight: 800, lineHeight: 1.1,
          maxWidth: 800, margin: '0 auto 24px',
        }}>
          Gérez vos finances{' '}
          <span style={{
            background: 'linear-gradient(135deg, #667eea, #f5576c)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>simplement</span>{' '}
          et{' '}
          <span style={{
            background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>intelligemment</span>
        </Title>

        <Paragraph style={{
          color: '#8888aa', fontSize: 18, maxWidth: 600, margin: '0 auto 40px',
          lineHeight: 1.6,
        }}>
          Une solution complète pour les PME, TPE et entrepreneurs.
          Suivez vos revenus, dépenses et dettes en temps réel grâce à des outils visuels et des recommandations IA.
        </Paragraph>

        <div style={{ display: 'flex', gap: 16 }}>
          <Button
            type="primary"
            size="large"
            icon={<ArrowRightOutlined />}
            onClick={() => navigate('/login')}
            style={{
              height: 52, paddingInline: 36, fontSize: 17, fontWeight: 700, borderRadius: 12,
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              border: 'none', boxShadow: '0 8px 30px rgba(102,126,234,0.4)',
            }}
          >
            Commencer
          </Button>
          <Button
            size="large"
            onClick={() => navigate('/register')}
            style={{
              height: 52, paddingInline: 36, fontSize: 17, fontWeight: 600, borderRadius: 12,
              background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
            }}
          >
            Créer un compte
          </Button>
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: '60px 60px 100px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <Title level={2} style={{ color: '#fff', fontWeight: 700 }}>
            Tout ce dont vous avez besoin
          </Title>
          <Paragraph style={{ color: '#8888aa', fontSize: 16 }}>
            Des outils puissants, une interface simple.
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {features.map((f, i) => (
            <Col key={i} xs={24} sm={12} md={6}>
              <div style={{
                background: 'rgba(255,255,255,0.04)', borderRadius: 16,
                padding: 28, height: '100%',
                border: '1px solid rgba(255,255,255,0.06)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'default',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(102,126,234,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: 64, height: 64, borderRadius: 14,
                  background: f.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 20,
                }}>
                  {f.icon}
                </div>
                <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: '#8888aa', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '30px 60px', textAlign: 'center',
      }}>
        <p style={{ color: '#555577', fontSize: 14, margin: 0 }}>
          © {new Date().getFullYear()} Faso Finance — Gestion Financière Simplifiée & Intelligente
        </p>
      </div>
    </div>
  );
};

export default Landing;
