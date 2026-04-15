import { useState } from 'react';
import { Typography, Card, Switch, List, Select, Divider, Button, Input, message, InputNumber, Row, Col, Tag, Modal, Form } from 'antd';
import { SunOutlined, MoonOutlined, BellOutlined, GlobalOutlined, DollarOutlined, SafetyCertificateOutlined, ToolOutlined, DatabaseOutlined, AlertOutlined, BankOutlined, PlusOutlined } from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { useEnterprise } from '../context/EnterpriseContext';
import { getUserRole } from '../utils/auth';

const { Title, Text } = Typography;
const { Option } = Select;

const Settings = () => {
  const { isDark, toggleTheme } = useTheme();
  const { currency, setCurrency, availableCurrencies, CURRENCIES } = useCurrency();
  const { activeEnterprise } = useEnterprise();
  const role = getUserRole() || 'user';

  // Manager settings state
  const [teamAlerts, setTeamAlerts] = useState(true);
  const [reportFrequency, setReportFrequency] = useState('weekly');
  const [transactionNotifs, setTransactionNotifs] = useState(true);

  // Admin settings state
  const [managerCode, setManagerCode] = useState('MANAGER2025');
  const [adminCode, setAdminCode] = useState('ADMIN2025');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [transactionLimit, setTransactionLimit] = useState(10000000);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createdCode, setCreatedCode] = useState('');
  const [form] = Form.useForm();
  const { enterprises, setActiveEnterpriseId, addEnterprise } = useEnterprise();

  const handleCreateEnterprise = async (values) => {
    try {
      const newEnt = await addEnterprise({ nom: values.name });
      setCreatedCode(newEnt.code_entreprise);
      form.resetFields();
      message.success('Entreprise créée avec succès !');
    } catch (e) {
      message.error("Erreur lors de la création de l'entreprise");
    }
  };

  // ── User Settings ──
  const userSettings = [
    {
      title: 'Mode Sombre',
      description: 'Basculer entre le thème clair et sombre',
      icon: isDark ? <MoonOutlined style={{ fontSize: 24, color: '#faad14' }} /> : <SunOutlined style={{ fontSize: 24, color: '#faad14' }} />,
      action: <Switch checked={isDark} onChange={toggleTheme} checkedChildren={<MoonOutlined />} unCheckedChildren={<SunOutlined />} />,
    },
    {
      title: 'Notifications Email',
      description: 'Recevoir des alertes par email pour les factures en retard',
      icon: <BellOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
      action: <Switch defaultChecked />,
    },
    {
      title: 'Langue',
      description: "Langue de l'interface",
      icon: <GlobalOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
      action: <span style={{ color: '#8c8c8c' }}>Français 🇫🇷</span>,
    },
  ];

  // ── Manager-only Settings ──
  const managerSettings = [
    {
      title: 'Alertes performance équipe',
      description: "Recevoir une alerte quand un utilisateur dépasse les seuils",
      icon: <AlertOutlined style={{ fontSize: 24, color: '#fa8c16' }} />,
      action: <Switch checked={teamAlerts} onChange={setTeamAlerts} />,
    },
    {
      title: 'Fréquence des rapports',
      description: 'Intervalle de génération automatique des rapports',
      icon: <ToolOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
      action: (
        <Select value={reportFrequency} onChange={setReportFrequency} style={{ width: 160 }}>
          <Option value="daily">Quotidien</Option>
          <Option value="weekly">Hebdomadaire</Option>
          <Option value="monthly">Mensuel</Option>
        </Select>
      ),
    },
    {
      title: 'Notifications transactions',
      description: "Être notifié des nouvelles transactions de mes utilisateurs",
      icon: <BellOutlined style={{ fontSize: 24, color: '#13c2c2' }} />,
      action: <Switch checked={transactionNotifs} onChange={setTransactionNotifs} />,
    },
  ];

  const handleSaveCodes = () => {
    message.success('Codes de vérification mis à jour !');
  };

  const handleExportDB = () => {
    import('../utils/exportUtils').then(({ exportDatabase }) => {
      exportDatabase();
      message.success('Sauvegarde téléchargée avec succès !');
    });
  };

  const getRoleLabel = () => {
    const labels = { admin: 'Administrateur', manager: 'Manager', user: 'Utilisateur' };
    const colors = { admin: 'red', manager: 'gold', user: 'blue' };
    return <Tag color={colors[role]} style={{ fontSize: 14, padding: '2px 12px' }}>{labels[role]}</Tag>;
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Row align="middle" style={{ marginBottom: 24, gap: 12 }}>
        <Title level={2} style={{ margin: 0 }}>⚙️ Paramètres</Title>
        {getRoleLabel()}
      </Row>

      {/* ── User Settings (all roles) ── */}
      <Card bordered={false} title="🔧 Paramètres Généraux" style={{ borderRadius: 12, marginBottom: 24 }}>
        <List
          itemLayout="horizontal"
          dataSource={userSettings}
          renderItem={item => (
            <List.Item extra={item.action}>
              <List.Item.Meta
                avatar={item.icon}
                title={<span style={{ fontWeight: 600, fontSize: 16 }}>{item.title}</span>}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Card>

      {/* ── Manager Settings ── */}
      {(role === 'manager' || role === 'admin') && (
        <Card bordered={false} title="👔 Paramètres Manager" style={{ borderRadius: 12, marginBottom: 24 }}>
          <List
            itemLayout="horizontal"
            dataSource={managerSettings}
            renderItem={item => (
              <List.Item extra={item.action}>
                <List.Item.Meta
                  avatar={item.icon}
                  title={<span style={{ fontWeight: 600, fontSize: 16 }}>{item.title}</span>}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </Card>
      )}

      {/* ── Admin Settings ── */}
      {role === 'admin' && (
        <>
          <Card bordered={false} title="🛡️ Paramètres Administrateur" style={{ borderRadius: 12, marginBottom: 24 }}>
            {/* Currency Setting */}
            <div style={{ marginBottom: 24 }}>
              <Row align="middle" style={{ marginBottom: 8 }}>
                <DollarOutlined style={{ fontSize: 20, color: '#667eea', marginRight: 10 }} />
                <div>
                  <Text strong style={{ fontSize: 16 }}>Devise globale</Text>
                  <br />
                  <Text type="secondary">Change la devise affichée dans toute l'application</Text>
                </div>
              </Row>
              <Select
                value={currency}
                onChange={(val) => {
                  setCurrency(val);
                  message.success(`Devise changée vers ${val}`);
                }}
                style={{ width: 250, marginTop: 8 }}
                size="large"
              >
                {availableCurrencies.map(c => (
                  <Option key={c} value={c}>
                    {c} ({CURRENCIES[c]?.symbol})
                  </Option>
                ))}
              </Select>
            </div>

            <Divider />

            {/* Enterprise Selector */}
            <div style={{ marginBottom: 24 }}>
              <Row align="middle" style={{ marginBottom: 12 }}>
                <BankOutlined style={{ fontSize: 20, color: '#2d3436', marginRight: 10 }} />
                <div>
                  <Text strong style={{ fontSize: 16 }}>Changer d'entreprise active</Text>
                  <br />
                  <Text type="secondary">Sélectionnez l'entreprise que vous souhaitez consulter</Text>
                </div>
              </Row>
              <Select
                value={activeEnterprise?.id}
                onChange={setActiveEnterpriseId}
                style={{ width: 250 }}
                size="large"
              >
                {enterprises.map(e => (
                  <Option key={e.id} value={e.id}>
                    {e.name || e.nom}
                  </Option>
                ))}
              </Select>
            </div>

            <Divider />

            {/* Add Enterprise Button */}
            <div style={{ marginBottom: 24 }}>
              <Row align="middle" justify="space-between">
                <Col>
                  <Row align="middle">
                    <PlusOutlined style={{ fontSize: 20, color: '#E91E63', marginRight: 10 }} />
                    <div>
                      <Text strong style={{ fontSize: 16 }}>Nouvelle entreprise</Text>
                      <br />
                      <Text type="secondary">Créer une nouvelle entité rattachée à votre compte admin</Text>
                    </div>
                  </Row>
                </Col>
                <Col>
                  <Button type="primary" onClick={() => { setCreatedCode(''); setIsModalOpen(true); }} style={{ background: '#E91E63', border: 'none', fontWeight: 600 }}>
                    Ajouter
                  </Button>
                </Col>
              </Row>
            </div>

            <Divider />

            {/* Enterprise Code Display */}
            <div style={{ marginBottom: 24 }}>
              <Row align="middle" style={{ marginBottom: 12 }}>
                <SafetyCertificateOutlined style={{ fontSize: 20, color: '#3F51B5', marginRight: 10 }} />
                <div>
                  <Text strong style={{ fontSize: 16 }}>Code Entreprise Actuelle</Text>
                  <br />
                  <Text type="secondary">Partagez ce code avec vos collaborateurs (Managers/Utilisateurs) pour qu'ils puissent se connecter à cet espace.</Text>
                </div>
              </Row>
              <div style={{ 
                background: '#f8f9fa', padding: '12px 20px', borderRadius: 8, 
                border: '1px dashed #3F51B5', display: 'inline-block' 
              }}>
                <Text strong style={{ fontSize: 20, letterSpacing: 2, color: '#3F51B5', fontFamily: 'monospace' }}>
                  {activeEnterprise?.code || 'Aucune entreprise active'}
                </Text>
              </div>
            </div>

            <Divider />

            {/* Registration Codes */}
            <div style={{ marginBottom: 24 }}>
              <Row align="middle" style={{ marginBottom: 12 }}>
                <SafetyCertificateOutlined style={{ fontSize: 20, color: '#fa8c16', marginRight: 10 }} />
                <div>
                  <Text strong style={{ fontSize: 16 }}>Codes d'inscription</Text>
                  <br />
                  <Text type="secondary">Codes de vérification pour l'inscription Manager et Admin</Text>
                </div>
              </Row>
              <Row gutter={16} style={{ marginBottom: 12 }}>
                <Col span={12}>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Code Manager</label>
                  <Input value={managerCode} onChange={e => setManagerCode(e.target.value)} />
                </Col>
                <Col span={12}>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Code Admin</label>
                  <Input value={adminCode} onChange={e => setAdminCode(e.target.value)} />
                </Col>
              </Row>
              <Button type="primary" onClick={handleSaveCodes}>Sauvegarder les codes</Button>
            </div>

            <Divider />

            {/* Transaction Limit */}
            <div style={{ marginBottom: 24 }}>
              <Row align="middle" style={{ marginBottom: 12 }}>
                <AlertOutlined style={{ fontSize: 20, color: '#f5222d', marginRight: 10 }} />
                <div>
                  <Text strong style={{ fontSize: 16 }}>Seuil d'alerte transactions</Text>
                  <br />
                  <Text type="secondary">Alerte automatique si une transaction dépasse ce montant</Text>
                </div>
              </Row>
              <InputNumber
                value={transactionLimit}
                onChange={setTransactionLimit}
                style={{ width: 250 }}
                size="large"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                parser={value => value.replace(/\s/g, '')}
              />
            </div>

            <Divider />

            {/* Maintenance Mode */}
            <div style={{ marginBottom: 24 }}>
              <Row align="middle" justify="space-between">
                <Col>
                  <Row align="middle">
                    <ToolOutlined style={{ fontSize: 20, color: '#ff4d4f', marginRight: 10 }} />
                    <div>
                      <Text strong style={{ fontSize: 16 }}>Mode Maintenance</Text>
                      <br />
                      <Text type="secondary">Activer le mode maintenance (bloque l'accès utilisateur)</Text>
                    </div>
                  </Row>
                </Col>
                <Col>
                  <Switch checked={maintenanceMode} onChange={setMaintenanceMode} />
                </Col>
              </Row>
            </div>

            <Divider />

            {/* Export Database */}
            <div>
              <Row align="middle" style={{ marginBottom: 12 }}>
                <DatabaseOutlined style={{ fontSize: 20, color: '#52c41a', marginRight: 10 }} />
                <div>
                  <Text strong style={{ fontSize: 16 }}>Export base de données</Text>
                  <br />
                  <Text type="secondary">Télécharger un backup complet de la base de données</Text>
                </div>
              </Row>
              <Button onClick={handleExportDB} icon={<DatabaseOutlined />}>Lancer l'export</Button>
            </div>
          </Card>
        </>
      )}

      {/* ── Add Enterprise Modal (Admin Only) ── */}
      {role === 'admin' && (
        <Modal
          title="Créer une nouvelle entreprise"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          destroyOnClose
        >
          {!createdCode ? (
            <Form form={form} layout="vertical" onFinish={handleCreateEnterprise}>
              <Form.Item name="name" label="Nom de l'entreprise" rules={[{ required: true, message: 'Requis' }]}>
                <Input placeholder="Tech Solutions Africa" size="large" />
              </Form.Item>
              <Button type="primary" htmlType="submit" size="large" block style={{ background: '#3F51B5' }}>
                Créer l'entreprise
              </Button>
            </Form>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <h3 style={{ color: '#4CAF50', fontWeight: 800, marginBottom: 8 }}>✅ Succès !</h3>
              <p>Voici le code secret généré. Transmettez-le à vos Managers et Utilisateurs pour qu'ils s'y rattachent.</p>
              <div style={{ 
                background: '#f8f9fa', padding: 16, borderRadius: 12, margin: '20px 0', 
                fontSize: 24, fontWeight: 800, letterSpacing: 2, color: '#2d3436', 
                border: '2px dashed #3F51B5' 
              }}>
                {createdCode}
              </div>
              <Button type="primary" size="large" block onClick={() => setIsModalOpen(false)}>
                Terminer
              </Button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default Settings;
