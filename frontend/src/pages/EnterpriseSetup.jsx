import { useState } from 'react';
import { Card, Form, Input, Button, Typography, message, DatePicker, Select } from 'antd';
import { BankOutlined, GlobalOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useEnterprise } from '../context/EnterpriseContext';
import { setSetupComplete } from '../utils/auth';

const { Title, Text } = Typography;
const { Option } = Select;

const EnterpriseSetup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addEnterprise } = useEnterprise();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        nom: values.nom,
        domaine: values.domaine,
        date_creation: values.date_creation ? values.date_creation.format('YYYY-MM-DD') : null,
      };

      await addEnterprise(payload);
      setSetupComplete();
      message.success("Entreprise créée avec succès !");
      
      setTimeout(() => {
        navigate('/admin');
      }, 1000);
      
    } catch (error) {
      console.error(error);
      message.error("Erreur lors de la création de l'entreprise.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a23 0%, #1a1a40 50%, #2d1b69 100%)',
      padding: 20,
    }}>
      <Card style={{
        width: 500, borderRadius: 16, border: 'none',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        background: 'rgba(255,255,255,0.95)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 24,
          }}>
            <BankOutlined />
          </div>
          <Title level={3} style={{ margin: 0, color: '#1a1a40' }}>Configurez votre Entreprise</Title>
          <Text style={{ color: '#8c8c8c' }}>Avant de commencer, configurez votre première entité.</Text>
        </div>

        <Form layout="vertical" onFinish={onFinish} size="large">
          <Form.Item
            label={<span style={{ fontWeight: 600 }}>Nom de l'entreprise</span>}
            name="nom"
            rules={[{ required: true, message: 'Le nom est requis !' }]}
          >
            <Input prefix={<BankOutlined />} placeholder="Ex: Faso Finance SA" style={{ borderRadius: 8 }} />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: 600 }}>Secteur / Domaine</span>}
            name="domaine"
            rules={[{ required: true, message: 'Veuillez sélectionner un domaine !' }]}
          >
            <Select placeholder="Sélectionnez un domaine d'activité" style={{ borderRadius: 8 }}>
              <Option value="Finance">Finance & Banque</Option>
              <Option value="Tech">Technologie & Logiciel</Option>
              <Option value="Sante">Santé & Médecine</Option>
              <Option value="Commerce">Commerce & Distribution</Option>
              <Option value="Autre">Autre</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: 600 }}>Date de création (Optionnelle)</span>}
            name="date_creation"
          >
            <DatePicker style={{ width: '100%', borderRadius: 8 }} format="DD/MM/YYYY" placeholder="Sélectionner une date" />
          </Form.Item>

          <Form.Item style={{ marginTop: 32, marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                width: '100%', height: 48, borderRadius: 10, fontSize: 16, fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none',
              }}
            >
              Créer mon espace
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EnterpriseSetup;
