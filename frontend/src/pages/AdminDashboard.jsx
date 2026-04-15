import { useState } from 'react';
import { Row, Col, Typography, Table, Tag, Badge, Select, Timeline, Button, Modal, Form, Input, message } from 'antd';
import {
  BankOutlined, GlobalOutlined, UserOutlined, DollarOutlined,
  WarningOutlined, CheckCircleOutlined, ClockCircleOutlined,
  ArrowUpOutlined, PlusOutlined, CopyOutlined,
} from '@ant-design/icons';
import {
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar,
  ComposedChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useCurrency } from '../context/CurrencyContext';
import { useEnterprise } from '../context/EnterpriseContext';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

/* ══════════════════════════════════════════════════
   ADMIN DASHBOARD — Reduction Style, Multi-Enterprise
   Theme: White cards, gray-50 bg, Rose/Indigo accents
   ══════════════════════════════════════════════════ */
const AdminDashboard = () => {
  const { formatMoney } = useCurrency();
  const { enterprises, activeEnterprise, setActiveEnterpriseId } = useEnterprise();
  const navigate = useNavigate();

  const systemHealth = [
    { label: 'Utilisateurs', value: '24', icon: <UserOutlined />, color: '#3F51B5', trend: '+3', progress: 68 },
    { label: 'Entreprises', value: String(enterprises.length), icon: <BankOutlined />, color: '#E91E63', trend: '+1', progress: 45 },
    { label: 'Revenus Globaux', value: formatMoney(279383040), icon: <DollarOutlined />, color: '#4CAF50', trend: '+18%', progress: 82 },
    { label: 'Transactions/jour', value: '142', icon: <GlobalOutlined />, color: '#FF9800', trend: '+12%', progress: 71 },
  ];

  const revenueData = [
    { name: 'Jan', revenus: 18040000, depenses: 12480000, benefice: 5560000 },
    { name: 'Fév', revenus: 21320000, depenses: 14760000, benefice: 6560000 },
    { name: 'Mar', revenus: 19680000, depenses: 16400000, benefice: 3280000 },
    { name: 'Avr', revenus: 25420000, depenses: 15088000, benefice: 10332000 },
    { name: 'Mai', revenus: 30340000, depenses: 18040000, benefice: 12300000 },
    { name: 'Juin', revenus: 34440000, depenses: 19680000, benefice: 14760000 },
  ];

  const enterpriseRevenue = [
    { name: 'Jan', ent1: 10200000, ent2: 7840000 },
    { name: 'Fév', ent1: 12400000, ent2: 8920000 },
    { name: 'Mar', ent1: 11200000, ent2: 8480000 },
    { name: 'Avr', ent1: 14800000, ent2: 10620000 },
    { name: 'Mai', ent1: 17600000, ent2: 12740000 },
    { name: 'Juin', ent1: 20200000, ent2: 14240000 },
  ];

  const roleDistribution = [
    { name: 'Utilisateurs', value: 18, color: '#3F51B5' },
    { name: 'Managers', value: 4, color: '#FF9800' },
    { name: 'Admins', value: 2, color: '#E91E63' },
  ];

  const systemAlerts = [
    { time: '14:30', text: 'Pic de transactions détecté (+45%)', type: 'warning' },
    { time: '13:15', text: 'Nouveau manager inscrit : Bob Martin', type: 'info' },
    { time: '11:00', text: 'Backup automatique terminé avec succès', type: 'success' },
    { time: '09:45', text: 'Facture FAC-2024-089 en retard de 10 jours', type: 'error' },
    { time: '08:30', text: 'Mise à jour devise : FCFA appliquée globalement', type: 'success' },
  ];

  const topUsers = [
    { name: 'Alice Dupont', role: 'admin', revenue: 45000000, transactions: 234 },
    { name: 'Bob Martin', role: 'manager', revenue: 32000000, transactions: 187 },
    { name: 'Emma Petit', role: 'user', revenue: 18500000, transactions: 156 },
    { name: 'Charlie Roux', role: 'user', revenue: 15200000, transactions: 134 },
    { name: 'Diana Lefèvre', role: 'user', revenue: 12800000, transactions: 98 },
  ];

  const userColumns = [
    {
      title: 'Utilisateur', dataIndex: 'name', key: 'name',
      render: (name) => <span style={{ fontWeight: 600, color: '#2d3436' }}>{name}</span>,
    },
    {
      title: 'Rôle', dataIndex: 'role', key: 'role',
      render: (role) => {
        const c = { admin: '#E91E63', manager: '#FF9800', user: '#3F51B5' };
        return (
          <Tag
            style={{
              background: `${c[role]}12`, color: c[role],
              border: `1px solid ${c[role]}30`, borderRadius: 20, fontWeight: 600,
            }}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Tag>
        );
      },
    },
    {
      title: 'Revenus', dataIndex: 'revenue', key: 'revenue',
      render: (v) => <span style={{ color: '#4CAF50', fontWeight: 600 }}>{formatMoney(v)}</span>,
    },
    {
      title: 'Transactions', dataIndex: 'transactions', key: 'transactions',
      render: (v) => <span style={{ color: '#2d3436' }}>{v}</span>,
    },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      {/* ── Header with Enterprise Selector ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#2d3436' }}>🛡️ Centre de Contrôle</Title>
          <Text style={{ fontSize: 15, color: '#636e72' }}>Vue globale du système — Administration</Text>
        </div>
      </div>

      {/* ── System Health KPIs ── */}
      <Row gutter={[16, 16]} style={{ marginBottom: 28 }}>
        {systemHealth.map((kpi, i) => (
          <Col xs={24} sm={12} md={6} key={i}>
            <div className="reduction-card" style={{ animation: `slideUp 0.4s ease-out ${i * 0.08}s both` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ margin: 0, color: '#636e72', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 500 }}>{kpi.label}</p>
                  <h2 style={{ margin: '8px 0 4px', fontSize: 26, fontWeight: 800, color: '#2d3436' }}>{kpi.value}</h2>
                  <span style={{ color: '#4CAF50', fontSize: 13, fontWeight: 600 }}>
                    <ArrowUpOutlined style={{ marginRight: 4 }} />{kpi.trend}
                  </span>
                </div>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: `${kpi.color}12`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: kpi.color, fontSize: 22,
                }}>
                  {kpi.icon}
                </div>
              </div>
              <div className="stat-progress">
                <div className="stat-progress-bar" style={{
                  width: `${kpi.progress}%`,
                  background: `linear-gradient(90deg, ${kpi.color}, ${kpi.color}aa)`,
                }} />
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* ── Main Chart + Role Distribution ── */}
      <Row gutter={[16, 16]} style={{ marginBottom: 28 }}>
        <Col xs={24} lg={16}>
          <div className="reduction-card" style={{ animation: 'slideUp 0.5s ease-out 0.3s both' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: '#2d3436' }}>📊 Performance Globale</h3>
            <p style={{ color: '#636e72', fontSize: 13, margin: '0 0 20px' }}>Revenus, Dépenses et Bénéfice</p>
            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={revenueData}>
                  <defs>
                    <linearGradient id="adminRevGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3F51B5" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3F51B5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f5" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#636e72' }} />
                  <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} tick={{ fontSize: 11, fill: '#636e72' }} />
                  <Tooltip formatter={(v) => formatMoney(v)} contentStyle={{ borderRadius: 12, border: '1px solid #e9ecef', boxShadow: '0 4px 14px rgba(0,0,0,0.08)' }} />
                  <Legend />
                  <Area type="monotone" dataKey="revenus" name="Revenus" fill="url(#adminRevGrad)" stroke="#3F51B5" strokeWidth={2} />
                  <Bar dataKey="depenses" name="Dépenses" fill="#E91E6325" stroke="#E91E63" strokeWidth={1} radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="benefice" name="Bénéfice" stroke="#4CAF50" strokeWidth={3} dot={{ r: 5, fill: '#4CAF50' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>
        <Col xs={24} lg={8}>
          <div className="reduction-card" style={{ height: '100%', animation: 'slideUp 0.5s ease-out 0.4s both' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#2d3436' }}>👥 Répartition des Rôles</h3>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={roleDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                    {roleDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e9ecef' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
              {roleDistribution.map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#2d3436' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: r.color, display: 'inline-block' }} />
                    {r.name}
                  </span>
                  <span style={{ fontWeight: 700, color: '#2d3436' }}>{r.value}</span>
                </div>
              ))}
            </div>

            {/* Enterprise cards */}
            {enterprises.length > 0 && (
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #f1f3f5' }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#2d3436', marginBottom: 10 }}>🏢 Mes Entreprises</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {enterprises.slice(0, 3).map((ent, i) => (
                    <div
                      key={i}
                      onClick={() => setActiveEnterpriseId(ent.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '8px 12px', borderRadius: 10, cursor: 'pointer',
                        background: activeEnterprise?.id === ent.id ? `${ent.color || '#3F51B5'}10` : '#f8f9fa',
                        border: activeEnterprise?.id === ent.id ? `1px solid ${ent.color || '#3F51B5'}30` : '1px solid transparent',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{
                        width: 28, height: 28, borderRadius: 7,
                        background: `linear-gradient(135deg, ${ent.color || '#3F51B5'}, ${ent.color || '#3F51B5'}cc)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: 10, fontWeight: 800,
                      }}>{ent.logo || 'E'}</div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#2d3436' }}>{ent.nom || ent.name}</span>
                        <span style={{ fontSize: 11, color: '#636e72', fontFamily: 'monospace' }}>
                          Code: {ent.code_entreprise || ent.code}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Col>
      </Row>

      {/* ── Multi-Enterprise Comparison Chart ── */}
      {enterprises.length > 1 && (
        <Row gutter={[16, 16]} style={{ marginBottom: 28 }}>
          <Col xs={24}>
            <div className="reduction-card" style={{ animation: 'slideUp 0.5s ease-out 0.45s both' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: '#2d3436' }}>🏢 Comparaison Entreprises</h3>
              <p style={{ color: '#636e72', fontSize: 13, margin: '0 0 20px' }}>Revenus mensuels par entreprise</p>
              <div style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={enterpriseRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f5" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#636e72' }} />
                    <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} tick={{ fontSize: 11, fill: '#636e72' }} />
                    <Tooltip formatter={(v) => formatMoney(v)} contentStyle={{ borderRadius: 10, border: '1px solid #e9ecef' }} />
                    <Legend />
                    <Bar dataKey="ent1" name={enterprises[0]?.name || 'Entreprise 1'} fill="#3F51B5" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="ent2" name={enterprises[1]?.name || 'Entreprise 2'} fill="#E91E63" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Col>
        </Row>
      )}

      {/* ── Bottom: Alerts + Top Users ── */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={10}>
          <div className="reduction-card" style={{ animation: 'slideUp 0.5s ease-out 0.5s both' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#2d3436' }}>🔔 Alertes Système</h3>
            <Timeline
              items={systemAlerts.map(a => {
                const colors = { warning: '#FF9800', info: '#3F51B5', success: '#4CAF50', error: '#E91E63' };
                const icons = {
                  warning: <WarningOutlined style={{ color: colors.warning }} />,
                  info: <ClockCircleOutlined style={{ color: colors.info }} />,
                  success: <CheckCircleOutlined style={{ color: colors.success }} />,
                  error: <WarningOutlined style={{ color: colors.error }} />,
                };
                return {
                  dot: icons[a.type],
                  children: (
                    <div>
                      <span style={{ color: '#636e72', fontSize: 12 }}>{a.time}</span>
                      <div style={{ color: '#2d3436', fontSize: 14 }}>{a.text}</div>
                    </div>
                  ),
                };
              })}
            />
          </div>
        </Col>
        <Col xs={24} lg={14}>
          <div className="reduction-card reduction-table" style={{ animation: 'slideUp 0.5s ease-out 0.6s both' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#2d3436' }}>🏆 Top Utilisateurs</h3>
            <Table columns={userColumns} dataSource={topUsers} rowKey="name" pagination={false} size="small" />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
