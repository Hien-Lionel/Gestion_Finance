import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Text, Title, Paragraph, Avatar, ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';

const { width } = Dimensions.get('window');

const DashboardScreen = () => {
  const { user } = useAuth();
  const { formatMoney } = useCurrency();
  const { colors } = useTheme();

  const stats = [
    { title: 'Profit', value: formatMoney(6453440), change: '+12.5%', up: true, progress: 0.72, color: '#667eea', icon: 'cash-multiple' },
    { title: 'Dépenses', value: formatMoney(2150000), change: '+8.3%', up: true, progress: 0.65, color: '#E91E63', icon: 'trending-down' },
    { title: 'Clients', value: '48', change: '+22.1%', up: true, progress: 0.85, color: '#4CAF50', icon: 'account-group' },
    { title: 'Taux Rebond', value: '32.6%', change: '-4.2%', up: false, progress: 0.33, color: '#FF9800', icon: 'chart-line' },
  ];

  const recentTransactions = [
    { id: 1, desc: 'Prestation développement', amount: 1968000, type: 'income', date: "Aujourd'hui" },
    { id: 2, desc: 'Abonnement Cloud AWS', amount: -65600, type: 'expense', date: 'Hier' },
    { id: 3, desc: 'Paiement Client ABC', amount: 984000, type: 'income', date: '12 Oct' },
    { id: 4, desc: 'Achat fournitures', amount: -131200, type: 'expense', date: '10 Oct' },
    { id: 5, desc: 'Consultation stratégique', amount: 492000, type: 'income', date: '08 Oct' },
  ];

  const invoiceSummary = [
    { label: 'Payées', count: 12, color: '#4CAF50' },
    { label: 'En attente', count: 5, color: '#FF9800' },
    { label: 'En retard', count: 2, color: '#f44336' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: colors.textSecondary }]}>👋 Bonjour, {user?.first_name || user?.username}</Text>
        <Title style={[styles.title, { color: colors.text }]}>Tableau de bord</Title>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Statistics Grid (2x2) */}
        <View style={styles.statsGrid}>
          {stats.map((s, i) => (
            <Card key={i} style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Card.Content>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Avatar.Icon size={36} icon={s.icon} style={{ backgroundColor: s.color + '22' }} color={s.color} />
                  <Text style={{ color: s.up ? '#4CAF50' : '#E91E63', fontSize: 12, fontWeight: 'bold' }}>
                    {s.up ? '↑' : '↓'} {s.change}
                  </Text>
                </View>
                <Title style={{ color: colors.text, fontSize: 18, marginTop: 8 }}>{s.value}</Title>
                <Paragraph style={{ color: colors.textSecondary, fontSize: 12 }}>{s.title}</Paragraph>
                <ProgressBar progress={s.progress} color={s.color} style={{ height: 4, borderRadius: 2, marginTop: 8, backgroundColor: colors.border }} />
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* Invoice Summary */}
        <Card style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
          <Card.Content>
            <Title style={{ color: colors.text, fontSize: 16, marginBottom: 12 }}>📋 Résumé Factures</Title>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              {invoiceSummary.map((item, i) => (
                <View key={i} style={{ alignItems: 'center' }}>
                  <Text style={{ color: item.color, fontSize: 28, fontWeight: 'bold' }}>{item.count}</Text>
                  <Paragraph style={{ color: colors.textSecondary, fontSize: 12 }}>{item.label}</Paragraph>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Title style={{ color: colors.text, fontSize: 16, marginBottom: 12 }}>🔄 Dernières Transactions</Title>
          <Card style={{ backgroundColor: colors.surface, elevation: 1, borderRadius: 16 }}>
            <Card.Content style={{ padding: 0 }}>
              {recentTransactions.map((t, index) => (
                <View key={t.id} style={[styles.transactionItem, index === recentTransactions.length - 1 && { borderBottomWidth: 0 }, { borderBottomColor: colors.border }]}>
                  <View style={styles.transLeft}>
                    <Avatar.Icon size={36} icon={t.type === 'income' ? 'trending-up' : 'trending-down'} style={{ backgroundColor: t.type === 'income' ? '#e8f5e9' : '#fce4ec' }} color={t.type === 'income' ? '#4CAF50' : '#E91E63'} />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <Text style={{ color: colors.text, fontWeight: '600', fontSize: 14 }}>{t.desc}</Text>
                      <Paragraph style={{ color: colors.textSecondary, fontSize: 11 }}>{t.date}</Paragraph>
                    </View>
                  </View>
                  <Text style={{ color: t.type === 'income' ? '#4CAF50' : '#E91E63', fontWeight: 'bold', fontSize: 14 }}>
                    {t.type === 'income' ? '+' : ''}{formatMoney(t.amount)}
                  </Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 },
  greeting: { fontSize: 16, fontWeight: '500' },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 4 },
  scrollContent: { padding: 16, paddingTop: 8 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 16 },
  statCard: { width: (width - 48) / 2, borderRadius: 16, elevation: 1, marginBottom: 12 },
  sectionCard: { borderRadius: 16, elevation: 1, marginBottom: 16 },
  section: { marginBottom: 24 },
  transactionItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1 },
  transLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
});

export default DashboardScreen;
