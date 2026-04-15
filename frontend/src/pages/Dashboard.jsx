import { useState } from 'react';
import { Row, Col, Typography, Progress, Avatar, List } from 'antd';
import {
  ArrowUpOutlined, ArrowDownOutlined, WalletOutlined,
  ShoppingCartOutlined, UserOutlined, ThunderboltOutlined,
} from '@ant-design/icons';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useCurrency } from '../context/CurrencyContext';
import { getUserInfo } from '../utils/auth';

const { Title, Text } = Typography;


/* ── Mock Data ── */
const monthlyData = [
  { name: 'Jan', revenus: 2624000, depenses: 1574400 },
  { name: 'Fév', revenus: 1968000, depenses: 917148 },
  { name: 'Mar', revenus: 3280000, depenses: 2492800 },
  { name: 'Avr', revenus: 3135680, depenses: 2563648 },
  { name: 'Mai', revenus: 3863840, depenses: 3148800 },
  { name: 'Juin', revenus: 4191840, depenses: 2492800 },
  { name: 'Jul', revenus: 4913440, depenses: 2820800 },
  { name: 'Aoû', revenus: 4132800, depenses: 2689600 },
  { name: 'Sep', revenus: 4657600, depenses: 2427200 },
  { name: 'Oct', revenus: 5379200, depenses: 3411200 },
  { name: 'Nov', revenus: 4920000, depenses: 3148800 },
  { name: 'Déc', revenus: 6035200, depenses: 3345600 },
];

const expenseCategories = [
  { name: 'Jan', logiciels: 420000, marketing: 380000, bureau: 310000, salaires: 464400 },
  { name: 'Fév', logiciels: 250000, marketing: 220000, bureau: 200000, salaires: 247148 },
  { name: 'Mar', logiciels: 680000, marketing: 520000, bureau: 450000, salaires: 842800 },
  { name: 'Avr', logiciels: 600000, marketing: 580000, bureau: 480000, salaires: 903648 },
  { name: 'Mai', logiciels: 750000, marketing: 700000, bureau: 520000, salaires: 1178800 },
  { name: 'Juin', logiciels: 580000, marketing: 450000, bureau: 380000, salaires: 1082800 },
];

const expenseBreakdown = [
  { name: 'Logiciels', value: 35, color: '#3F51B5' },
  { name: 'Marketing', value: 25, color: '#E91E63' },
  { name: 'Bureau', value: 20, color: '#4CAF50' },
  { name: 'Autres', value: 20, color: '#FF9800' },
];

const recentTransactions = [
  { id: 1, desc: 'Prestation développement', amount: 1968000, type: 'income', date: "Aujourd'hui" },
  { id: 2, desc: 'Abonnement Cloud AWS', amount: -65600, type: 'expense', date: 'Hier' },
  { id: 3, desc: 'Paiement Client ABC', amount: 984000, type: 'income', date: '12 Oct' },
  { id: 4, desc: 'Achat fournitures', amount: -131200, type: 'expense', date: '10 Oct' },
  { id: 5, desc: 'Consultation stratégique', amount: 492000, type: 'income', date: '08 Oct' },
];

/* ══════════════════════════════════════════════════
   USER DASHBOARD — Reduction Style
   Theme: White cards, gray-50 bg, Rose/Indigo accents, progress bars
   ══════════════════════════════════════════════════ */
const Dashboard = () => {
  const { formatMoney } = useCurrency();
  const userInfo = getUserInfo();
  const currentUsername = userInfo?.username || 'Utilisateur';

  const stats = [
    {
      title: 'Profit',
      value: formatMoney(6453440),
      change: '+12.5%',
      up: true,
      progress: 72,
      color: '#3F51B5',
    },
    {
      title: 'Visiteurs',
      value: '1,245',
      change: '+8.3%',
      up: true,
      progress: 65,
      color: '#E91E63',
    },
    {
      title: 'Nouveaux Clients',
      value: '48',
      change: '+22.1%',
      up: true,
      progress: 85,
      color: '#4CAF50',
    },
    {
      title: 'Taux de Rebond',
      value: '32.6%',
      change: '-4.2%',
      up: false,
      progress: 33,
      color: '#FF9800',
    },
  ];

  const goals = [
    { label: 'Objectif épargne', current: 3200000, target: 5000000, color: '#3F51B5' },
    { label: 'Budget marketing', current: 820000, target: 1000000, color: '#E91E63' },
    { label: 'Remboursement dette', current: 1800000, target: 3280000, color: '#4CAF50' },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      {/* Page Header */}
      <div style={{ marginBottom: 28 }}>
        <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#2d3436' }}>
          👋 Bonjour, {currentUsername}
        </Title>
        <Text style={{ fontSize: 15, color: '#636e72' }}>
          Vue d'ensemble de vos finances personnelles
        </Text>
      </div>

      {/* ── Stats Grid — 4 cards with progress bars ── */}
      <Row gutter={[20, 20]} style={{ marginBottom: 28 }}>
        {stats.map((s, i) => (
          <Col xs={24} sm={12} md={6} key={i}>
            <div className="reduction-card" style={{
              animation: `slideUp 0.4s ease-out ${i * 0.08}s both`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{
                    margin: 0, fontSize: 12, color: '#636e72',
                    textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 500,
                  }}>{s.title}</p>
                  <h2 style={{ margin: '8px 0 4px', fontSize: 26, fontWeight: 800, color: '#2d3436' }}>
                    {s.value}
                  </h2>
                  <span style={{
                    fontSize: 13, fontWeight: 600,
                    color: s.up ? '#4CAF50' : '#E91E63',
                  }}>
                    {s.up ? <ArrowUpOutlined style={{ marginRight: 4 }} /> : <ArrowDownOutlined style={{ marginRight: 4 }} />}
                    {s.change}
                  </span>
                </div>
              </div>
              {/* Progress bar under the numbers */}
              <div className="stat-progress">
                <div className="stat-progress-bar" style={{
                  width: `${s.progress}%`,
                  background: `linear-gradient(90deg, ${s.color}, ${s.color}aa)`,
                }} />
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* ── Main Area Chart — Two filled curves ── */}
      <Row gutter={[20, 20]} style={{ marginBottom: 28 }}>
        <Col xs={24} lg={16}>
          <div className="reduction-card" style={{ animation: 'slideUp 0.5s ease-out 0.3s both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#2d3436' }}>
                  📈 Revenus vs Dépenses
                </h3>
                <p style={{ color: '#636e72', fontSize: 13, margin: '4px 0 0' }}>
                  Évolution sur les 12 derniers mois
                </p>
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#3F51B5', display: 'inline-block' }} />
                  Revenus
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#E91E63', display: 'inline-block' }} />
                  Dépenses
                </span>
              </div>
            </div>
            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradIndigo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3F51B5" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#3F51B5" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="gradRose" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E91E63" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#E91E63" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f5" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#636e72' }} axisLine={{ stroke: '#e9ecef' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#636e72' }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} axisLine={{ stroke: '#e9ecef' }} />
                  <Tooltip
                    formatter={(v) => formatMoney(v)}
                    contentStyle={{
                      borderRadius: 12, border: '1px solid #e9ecef',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.08)', background: '#fff',
                    }}
                  />
                  <Area type="monotone" dataKey="revenus" name="Revenus" stroke="#3F51B5" strokeWidth={2.5} fillOpacity={1} fill="url(#gradIndigo)" />
                  <Area type="monotone" dataKey="depenses" name="Dépenses" stroke="#E91E63" strokeWidth={2.5} fillOpacity={1} fill="url(#gradRose)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>

        {/* ── Expense Breakdown Pie ── */}
        <Col xs={24} lg={8}>
          <div className="reduction-card" style={{ height: '100%', animation: 'slideUp 0.5s ease-out 0.4s both' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px', color: '#2d3436' }}>
              💸 Répartition Dépenses
            </h3>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={expenseBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                    {expenseBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 10, border: '1px solid #e9ecef',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
              {expenseBreakdown.map((e, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#2d3436' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: e.color, display: 'inline-block' }} />
                    {e.name}
                  </span>
                  <span style={{ fontWeight: 700, color: '#2d3436' }}>{e.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>

      {/* ── Stacked Bar Chart + Goals + Transactions ── */}
      <Row gutter={[20, 20]} style={{ marginBottom: 28 }}>
        <Col xs={24} lg={14}>
          <div className="reduction-card" style={{ animation: 'slideUp 0.5s ease-out 0.5s both' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px', color: '#2d3436' }}>
              📊 Dépenses par Catégorie
            </h3>
            <p style={{ color: '#636e72', fontSize: 13, margin: '0 0 20px' }}>Ventilation mensuelle empilée</p>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expenseCategories}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f5" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#636e72' }} />
                  <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} tick={{ fontSize: 11, fill: '#636e72' }} />
                  <Tooltip formatter={(v) => formatMoney(v)} contentStyle={{ borderRadius: 10, border: '1px solid #e9ecef' }} />
                  <Legend />
                  <Bar dataKey="salaires" name="Salaires" stackId="a" fill="#3F51B5" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="logiciels" name="Logiciels" stackId="a" fill="#E91E63" />
                  <Bar dataKey="marketing" name="Marketing" stackId="a" fill="#FF9800" />
                  <Bar dataKey="bureau" name="Bureau" stackId="a" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>

        <Col xs={24} lg={10}>
          {/* Goals */}
          <div className="reduction-card" style={{ marginBottom: 20, animation: 'slideUp 0.5s ease-out 0.55s both' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: '#2d3436' }}>🎯 Mes Objectifs</h3>
            {goals.map((g, i) => (
              <div key={i} style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: '#2d3436' }}>{g.label}</span>
                  <span style={{ color: '#636e72', fontSize: 13 }}>{formatMoney(g.current)} / {formatMoney(g.target)}</span>
                </div>
                <Progress
                  percent={Math.round((g.current / g.target) * 100)}
                  strokeColor={g.color}
                  showInfo
                  size="small"
                  format={(p) => `${p}%`}
                />
              </div>
            ))}
          </div>

          {/* Recent Transactions */}
          <div className="reduction-card" style={{ animation: 'slideUp 0.5s ease-out 0.6s both' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#2d3436' }}>🔄 Dernières Transactions</h3>
            <List
              dataSource={recentTransactions}
              renderItem={item => (
                <List.Item style={{ padding: '10px 0', borderBottom: '1px solid #f1f3f5' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Avatar
                        size={36}
                        style={{
                          background: item.type === 'income'
                            ? 'linear-gradient(135deg, #4CAF50, #66BB6A)'
                            : 'linear-gradient(135deg, #E91E63, #F06292)',
                        }}
                        icon={item.type === 'income' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: '#2d3436' }}>{item.desc}</div>
                        <div style={{ color: '#636e72', fontSize: 12 }}>{item.date}</div>
                      </div>
                    </div>
                    <span style={{
                      fontWeight: 700, fontSize: 15,
                      color: item.type === 'income' ? '#4CAF50' : '#E91E63',
                    }}>
                      {item.type === 'income' ? '+' : ''}{formatMoney(item.amount)}
                    </span>
                  </div>
                </List.Item>
              )}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
