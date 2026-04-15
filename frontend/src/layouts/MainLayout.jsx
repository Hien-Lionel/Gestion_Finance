import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Dropdown, Space, Switch, Badge, Input } from 'antd';
import {
  DashboardOutlined,
  TransactionOutlined,
  TagsOutlined,
  CreditCardOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  FileDoneOutlined,
  LineChartOutlined,
  SunOutlined,
  MoonOutlined,
  SettingOutlined,
  HistoryOutlined,
  TeamOutlined,
  CrownOutlined,
  SearchOutlined,
  BankOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { clearAuth, getUserRole, getUserInfo } from '../utils/auth';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { useEnterprise } from '../context/EnterpriseContext';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const role = getUserRole() || 'user';
  const userInfo = getUserInfo() || {};
  const displayName = userInfo.username || 'Utilisateur';
  const { isDark, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const { enterprises, activeEnterprise, setActiveEnterpriseId, hasEnterprises, isLoading } = useEnterprise();

  useEffect(() => {
    if (role === 'admin' && !isLoading && !hasEnterprises) {
      navigate('/enterprise-setup');
    }
  }, [role, isLoading, hasEnterprises, navigate]);

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: 'Mon Profil', onClick: () => navigate('/profile') },
    { key: 'settings', icon: <SettingOutlined />, label: 'Paramètres', onClick: () => navigate('/settings') },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Déconnexion', danger: true, onClick: handleLogout },
  ];

  // Enterprise selector dropdown for admin
  const enterpriseMenuItems = enterprises.map(e => ({
    key: e.id,
    label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7,
          background: `linear-gradient(135deg, ${e.color || '#3F51B5'}, ${e.color || '#3F51B5'}cc)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 10, fontWeight: 800,
        }}>{e.logo || 'E'}</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: activeEnterprise?.id === e.id ? 700 : 400 }}>{e.name}</span>
          <span style={{ fontSize: 11, color: '#636e72', fontFamily: 'monospace' }}>{e.code}</span>
        </div>
      </div>
    ),
    onClick: () => setActiveEnterpriseId(e.id),
  }));

  if (role === 'admin') {
    enterpriseMenuItems.push(
      { type: 'divider' },
      {
        key: 'add-enterprise',
        icon: <PlusOutlined />,
        label: <span style={{ color: '#3F51B5', fontWeight: 600 }}>Ajouter une entreprise</span>,
        onClick: () => navigate('/enterprise-setup'),
      }
    );
  }

  const getMenuItems = () => {
    const items = [];

    // Dashboard - role specific
    if (role === 'admin') {
      items.push({ key: '/admin', icon: <CrownOutlined />, label: 'Dashboard Admin' });
    } else if (role === 'manager') {
      items.push({ key: '/manager-dashboard', icon: <DashboardOutlined />, label: 'Dashboard Manager' });
    } else {
      items.push({ key: '/dashboard', icon: <DashboardOutlined />, label: 'Mon Dashboard' });
    }

    // Common items
    items.push(
      { key: '/transactions', icon: <TransactionOutlined />, label: 'Transactions' },
      { key: '/categories', icon: <TagsOutlined />, label: 'Catégories' },
      { key: '/debts', icon: <CreditCardOutlined />, label: 'Dettes' },
      { key: '/factures', icon: <FileDoneOutlined />, label: 'Factures' },
    );

    // Reports - manager and admin only
    if (role === 'manager' || role === 'admin') {
      items.push({ key: '/reports', icon: <LineChartOutlined />, label: 'Rapports' });
    }

    // History - role specific
    if (role === 'admin') {
      items.push({ key: '/admin-history', icon: <HistoryOutlined />, label: 'Historique' });
    } else if (role === 'manager') {
      items.push({ key: '/manager-history', icon: <HistoryOutlined />, label: 'Historique' });
    } else {
      items.push({ key: '/history', icon: <HistoryOutlined />, label: 'Historique' });
    }

    // Notifications
    items.push({
      key: '/notifications',
      icon: <BellOutlined />,
      label: (
        <span>
          Notifications
          {unreadCount > 0 && (
            <Badge
              count={unreadCount}
              size="small"
              style={{ marginLeft: 8 }}
            />
          )}
        </span>
      ),
    });

    // Users management - manager and admin
    if (role === 'manager' || role === 'admin') {
      items.push({ key: '/users', icon: <TeamOutlined />, label: 'Utilisateurs' });
    }

    return items;
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={260}
        collapsedWidth={80}
        style={{
          background: 'linear-gradient(180deg, #4a148c 0%, #d81b60 100%)',
          boxShadow: '4px 0 20px rgba(74,20,140,0.15)',
        }}
      >
        {/* Logo */}
        <div style={{
          height: 56, margin: '16px 12px',
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 'bold', fontSize: collapsed ? 12 : 16,
          color: '#fff', gap: 10, transition: 'all 0.3s',
          cursor: 'pointer',
        }} onClick={() => navigate(role === 'admin' ? '/admin' : role === 'manager' ? '/manager-dashboard' : '/dashboard')}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.1))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 800, flexShrink: 0,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}>SF</div>
          {!collapsed && <span style={{ whiteSpace: 'nowrap', letterSpacing: 0.5 }}>Faso Finance</span>}
        </div>

        {/* Enterprise indicator (all roles) */}
        {activeEnterprise && !collapsed && (
          <div style={{
            margin: '0 16px 12px', padding: '8px 12px',
            background: 'rgba(255,255,255,0.08)', borderRadius: 10,
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 12, color: 'rgba(255,255,255,0.7)',
          }}>
            <BankOutlined style={{ fontSize: 14 }} />
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>
                {activeEnterprise.name}
              </span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>Code: {activeEnterprise.code}</span>
            </div>
          </div>
        )}

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={getMenuItems()}
          onClick={({ key }) => navigate(key)}
          style={{
            background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)',
          }}
          theme="dark"
        />
      </Sider>
      <Layout>
        <Header style={{
          padding: '0 24px',
          background: isDark ? '#1f1f1f' : '#fff',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 1px 4px rgba(0,21,41,.06)',
          zIndex: 1,
          height: 64,
        }}>
          {/* Left side — Toggle + Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: 18, width: 42, height: 42, color: isDark ? '#fff' : '#2d3436' }}
            />
            <Input
              placeholder="Rechercher..."
              prefix={<SearchOutlined style={{ color: '#b2bec3' }} />}
              style={{
                width: 280, borderRadius: 10, background: isDark ? '#2d2d3f' : '#f8f9fa',
                border: 'none', height: 40,
              }}
            />
          </div>

          {/* Right side — Enterprise selector + Theme + Notifs + User */}
          <Space size="middle">
            {/* Enterprise indicator in header */}
            {activeEnterprise && (
              role === 'admin' && enterprises.length > 0 ? (
                <Dropdown menu={{ items: enterpriseMenuItems }} placement="bottomRight">
                  <Button
                    type="text"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      borderRadius: 10, height: 40, padding: '0 12px',
                      background: isDark ? '#2d2d3f' : '#f8f9fa',
                    }}
                  >
                    <BankOutlined style={{ color: '#3F51B5' }} />
                    <span style={{
                      maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      color: isDark ? '#fff' : '#2d3436', fontWeight: 500,
                    }}>
                      {activeEnterprise.name}
                    </span>
                  </Button>
                </Dropdown>
              ) : (
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    borderRadius: 10, height: 40, padding: '0 12px',
                    background: isDark ? '#2d2d3f' : '#f8f9fa',
                    border: '1px solid rgba(63, 81, 181, 0.2)',
                  }}
                >
                  <BankOutlined style={{ color: '#3F51B5' }} />
                  <span style={{
                    maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    color: isDark ? '#fff' : '#2d3436', fontWeight: 600,
                  }}>
                    {activeEnterprise.name}
                  </span>
                </div>
              )
            )}

            <Switch
              checkedChildren={<MoonOutlined />}
              unCheckedChildren={<SunOutlined />}
              checked={isDark}
              onChange={toggleTheme}
            />
            <Badge count={unreadCount} size="small">
              <Button
                type="text"
                icon={<BellOutlined style={{ fontSize: 18 }} />}
                onClick={() => navigate('/notifications')}
                style={{ width: 40, height: 40, borderRadius: 10 }}
              />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar
                  style={{
                    background: 'linear-gradient(135deg, #E91E63, #3F51B5)',
                    fontWeight: 600,
                  }}
                  icon={<UserOutlined />}
                />
                <div style={{ lineHeight: 1.2 }}>
                  <span style={{ color: isDark ? '#fff' : '#2d3436', fontWeight: 600, display: 'block', fontSize: 14 }}>{displayName}</span>
                  <span style={{ color: '#636e72', fontSize: 11, textTransform: 'capitalize' }}>{role}</span>
                </div>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content style={{
          margin: 0, padding: 24, minHeight: 280,
          background: isDark ? '#141422' : '#f8f9fa',
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
