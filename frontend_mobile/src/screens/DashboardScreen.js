import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';

const { width } = Dimensions.get('window');

const DashboardScreen = () => {
  const { user, logout } = useAuth();
  const { formatMoney } = useCurrency();
  const { colors, toggleTheme, isDark } = useTheme();

  const stats = [
    { title: 'Profit', value: formatMoney(6453440), color: colors.primary, icon: '💰' },
    { title: 'Dépenses', value: formatMoney(2150000), color: '#E91E63', icon: '📉' },
  ];

  const recentTransactions = [
    { id: 1, desc: 'Prestation dev', date: 'Aujourd\'hui', amount: 1968000, type: 'income' },
    { id: 2, desc: 'Abonnement Cloud', date: 'Hier', amount: -65600, type: 'expense' },
    { id: 3, desc: 'Achat fournitures', date: '10 Oct', amount: -131200, type: 'expense' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>👋 Bonjour,</Text>
          <Text style={[styles.username, { color: colors.text }]}>{user?.first_name ? `${user.first_name} ${user.last_name}` : user?.username}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={{ marginRight: 15 }} onPress={toggleTheme}>
            <Text style={{ fontSize: 20 }}>{isDark ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Text style={styles.logoutTxt}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.statsRow}>
          {stats.map((s, i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: colors.surface, shadowColor: colors.cardShadow, borderTopColor: s.color, borderTopWidth: 4 }]}>
              <Text style={styles.statIcon}>{s.icon}</Text>
              <Text style={[styles.statTitle, { color: colors.textSecondary }]}>{s.title}</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>{s.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🔄 Dernières Transactions</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]}>
            {recentTransactions.map((t, index) => (
              <View key={t.id} style={[styles.transactionItem, index === recentTransactions.length - 1 && { borderBottomWidth: 0 }, { borderBottomColor: colors.border }]}>
                <View style={styles.transLeft}>
                  <View style={[styles.iconCircle, { backgroundColor: t.type === 'income' ? '#e8f5e9' : '#fce4ec' }]}>
                    <Text>{t.type === 'income' ? '📈' : '📉'}</Text>
                  </View>
                  <View>
                    <Text style={[styles.transDesc, { color: colors.text }]}>{t.desc}</Text>
                    <Text style={[styles.transDate, { color: colors.textSecondary }]}>{t.date}</Text>
                  </View>
                </View>
                <Text style={[styles.transAmount, { color: t.type === 'income' ? '#4CAF50' : '#E91E63' }]}>
                  {t.type === 'income' ? '+' : ''}{formatMoney(t.amount)}
                </Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: { fontSize: 14, color: '#636e72', fontWeight: '500' },
  username: { fontSize: 24, fontWeight: '800', color: '#1a1a40' },
  logoutBtn: { backgroundColor: '#ffeaa7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  logoutTxt: { color: '#d63031', fontWeight: '600', fontSize: 12 },
  scrollContent: { padding: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  statCard: {
    backgroundColor: '#fff', padding: 16, borderRadius: 16, width: (width - 56) / 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, elevation: 3
  },
  statIcon: { fontSize: 20, marginBottom: 8 },
  statTitle: { fontSize: 12, color: '#636e72', textTransform: 'uppercase', fontWeight: '600', marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: '800', color: '#2d3436' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#2d3436', marginBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, elevation: 2 },
  transactionItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f3f5' },
  transLeft: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  transDesc: { fontSize: 15, fontWeight: '600', color: '#2d3436' },
  transDate: { fontSize: 12, color: '#636e72', marginTop: 2 },
  transAmount: { fontSize: 15, fontWeight: '700' },
});

export default DashboardScreen;
