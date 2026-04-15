import { useState } from 'react';
import { Row, Col, Typography, Badge, Avatar, Progress } from 'antd';
import {
  TeamOutlined, RiseOutlined, TrophyOutlined, CheckCircleOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons';
import {
  BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useCurrency } from '../context/CurrencyContext';

const { Title, Text } = Typography;

/* ══════════════════════════════════════════════════
   MANAGER DASHBOARD — Reduction Style, Team Focus
   Theme: White cards, gray-50 bg, Rose/Indigo accents
   ══════════════════════════════════════════════════ */
const ManagerDashboard = () => {
  const { formatMoney } = useCurrency();

  const teamMembers = [
    { id: 1, name: 'Charlie Roux', avatar: 'CR', revenue: 4920000, target: 5000000, status: 'online', tasks: 12, completed: 10 },
    { id: 2, name: 'Diana Lefèvre', avatar: 'DL', revenue: 3608000, target: 4000000, status: 'online', tasks: 8, completed: 7 },
    { id: 3, name: 'Emma Petit', avatar: 'EP', revenue: 5248000, target: 4500000, status: 'offline', tasks: 15, completed: 15 },
    { id: 4, name: 'François Moreau', avatar: 'FM', revenue: 2952000, target: 3500000, status: 'online', tasks: 10, completed: 6 },
  ];

  const weeklyPerf = [
    { day: 'Lun', transactions: 12, objectif: 10 },
    { day: 'Mar', transactions: 8, objectif: 10 },
    { day: 'Mer', transactions: 15, objectif: 10 },
    { day: 'Jeu', transactions: 11, objectif: 10 },
    { day: 'Ven', transactions: 18, objectif: 10 },
    { day: 'Sam', transactions: 5, objectif: 5 },
  ];

  const radarData = [
    { subject: 'Revenus', A: 85, fullMark: 100 },
    { subject: 'Ponctualité', A: 92, fullMark: 100 },
    { subject: 'Satisfaction', A: 78, fullMark: 100 },
    { subject: 'Productivité', A: 88, fullMark: 100 },
    { subject: 'Qualité', A: 95, fullMark: 100 },
    { subject: 'Collaboration', A: 82, fullMark: 100 },
  ];

  const monthlyTrend = [
    { name: 'Jan', equipe: 7872000, objectif: 8000000 },
    { name: 'Fév', equipe: 9840000, objectif: 9000000 },
    { name: 'Mar', equipe: 8528000, objectif: 9500000 },
    { name: 'Avr', equipe: 11808000, objectif: 10000000 },
    { name: 'Mai', equipe: 14432000, objectif: 11000000 },
    { name: 'Juin', equipe: 16728000, objectif: 12000000 },
  ];

  const totalRevenue = teamMembers.reduce((sum, m) => sum + m.revenue, 0);
  const totalTarget = teamMembers.reduce((sum, m) => sum + m.target, 0);
  const avgPerformance = Math.round((totalRevenue / totalTarget) * 100);
  const totalTasks = teamMembers.reduce((sum, m) => sum + m.tasks, 0);
  const completedTasks = teamMembers.reduce((sum, m) => sum + m.completed, 0);

  const kpis = [
    { icon: <TeamOutlined style={{ fontSize: 24, color: '#3F51B5' }} />, label: 'Membres Actifs', value: `${teamMembers.filter(m => m.status === 'online').length} / ${teamMembers.length}`, color: '#3F51B5', progress: 75 },
    { icon: <RiseOutlined style={{ fontSize: 24, color: '#E91E63' }} />, label: 'Revenus Équipe', value: formatMoney(totalRevenue), color: '#E91E63', progress: Math.round((totalRevenue / totalTarget) * 100) },
    { icon: <TrophyOutlined style={{ fontSize: 24, color: '#FF9800' }} />, label: 'Performance', value: `${avgPerformance}%`, color: '#FF9800', progress: avgPerformance },
    { icon: <CheckCircleOutlined style={{ fontSize: 24, color: '#4CAF50' }} />, label: 'Tâches', value: `${completedTasks} / ${totalTasks}`, color: '#4CAF50', progress: Math.round((completedTasks / totalTasks) * 100) },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <div style={{ marginBottom: 28 }}>
        <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#2d3436' }}>👔 Supervision d'Équipe</Title>
        <Text style={{ fontSize: 15, color: '#636e72' }}>Performance de votre équipe et suivi des objectifs</Text>
      </div>

      {/* ── KPI Cards with Progress Bars ── */}
      <Row gutter={[20, 20]} style={{ marginBottom: 28 }}>
        {kpis.map((kpi, i) => (
          <Col xs={24} sm={12} md={6} key={i}>
            <div className="reduction-card" style={{ animation: `slideUp 0.4s ease-out ${i * 0.08}s both` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ margin: 0, color: '#636e72', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 500 }}>{kpi.label}</p>
                  <h2 style={{ margin: '8px 0 4px', fontSize: 24, fontWeight: 800, color: '#2d3436' }}>{kpi.value}</h2>
                  <span style={{ color: '#4CAF50', fontSize: 13, fontWeight: 600 }}>
                    <ArrowUpOutlined style={{ marginRight: 4 }} />+8%
                  </span>
                </div>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: `${kpi.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center',
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

      {/* ── Charts Row — Area Chart + Radar ── */}
      <Row gutter={[20, 20]} style={{ marginBottom: 28 }}>
        <Col xs={24} lg={14}>
          <div className="reduction-card" style={{ animation: 'slideUp 0.5s ease-out 0.3s both' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: '#2d3436' }}>📈 Tendance Mensuelle vs Objectifs</h3>
            <p style={{ color: '#636e72', fontSize: 13, margin: '0 0 20px' }}>Revenus de l'équipe</p>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend}>
                  <defs>
                    <linearGradient id="mgrGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3F51B5" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3F51B5" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f5" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#636e72' }} />
                  <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} tick={{ fontSize: 11, fill: '#636e72' }} />
                  <Tooltip formatter={(v) => formatMoney(v)} contentStyle={{ borderRadius: 12, border: '1px solid #e9ecef' }} />
                  <Legend />
                  <Area type="monotone" dataKey="equipe" name="Revenus Équipe" stroke="#3F51B5" strokeWidth={2.5} fillOpacity={1} fill="url(#mgrGrad)" />
                  <Area type="monotone" dataKey="objectif" name="Objectif" stroke="#E91E63" strokeWidth={2} strokeDasharray="5 5" fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>
        <Col xs={24} lg={10}>
          <div className="reduction-card" style={{ height: '100%', animation: 'slideUp 0.5s ease-out 0.4s both' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#2d3436' }}>🎯 Score Équipe</h3>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e9ecef" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#636e72' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: '#b2bec3' }} />
                  <Radar name="Équipe" dataKey="A" stroke="#3F51B5" fill="#3F51B5" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>
      </Row>

      {/* ── Weekly Activity + Team Members ── */}
      <Row gutter={[20, 20]}>
        <Col xs={24} lg={10}>
          <div className="reduction-card" style={{ animation: 'slideUp 0.5s ease-out 0.5s both' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: '#2d3436' }}>📊 Activité Hebdomadaire</h3>
            <p style={{ color: '#636e72', fontSize: 13, margin: '0 0 20px' }}>Transactions cette semaine</p>
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyPerf}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f5" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#636e72' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#636e72' }} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e9ecef' }} />
                  <Legend />
                  <Bar dataKey="transactions" name="Transactions" fill="#3F51B5" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="objectif" name="Objectif" fill="#e9ecef" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>
        <Col xs={24} lg={14}>
          <div className="reduction-card" style={{ animation: 'slideUp 0.5s ease-out 0.6s both' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#2d3436' }}>
              👥 Performance Individuelle
            </h3>
            {teamMembers.map((m, i) => {
              const perf = Math.round((m.revenue / m.target) * 100);
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 0', borderBottom: i < teamMembers.length - 1 ? '1px solid #f1f3f5' : 'none',
                }}>
                  <Avatar style={{
                    background: perf >= 100
                      ? 'linear-gradient(135deg, #4CAF50, #66BB6A)'
                      : perf >= 80
                        ? 'linear-gradient(135deg, #3F51B5, #5C6BC0)'
                        : 'linear-gradient(135deg, #FF9800, #FFB74D)',
                    fontWeight: 700,
                  }}>{m.avatar}</Avatar>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, color: '#2d3436' }}>
                        {m.name}
                        <Badge
                          color={m.status === 'online' ? '#4CAF50' : '#e9ecef'}
                          style={{ marginLeft: 8 }}
                        />
                      </span>
                      <span style={{
                        fontWeight: 700,
                        color: perf >= 100 ? '#4CAF50' : '#2d3436',
                      }}>{perf}%</span>
                    </div>
                    <Progress
                      percent={perf}
                      size="small"
                      strokeColor={
                        perf >= 100 ? '#4CAF50' : perf >= 80 ? '#3F51B5' : '#FF9800'
                      }
                      showInfo={false}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                      <Text style={{ fontSize: 12, color: '#636e72' }}>{formatMoney(m.revenue)} / {formatMoney(m.target)}</Text>
                      <Text style={{ fontSize: 12, color: '#636e72' }}>{m.completed}/{m.tasks} tâches</Text>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ManagerDashboard;
