import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Text, Title, Paragraph, Avatar, Chip, Searchbar } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';

const HistoryScreen = () => {
  const { colors } = useTheme();
  const { formatMoney } = useCurrency();
  const { user } = useAuth();
  const role = user?.role || 'user';

  const allHistory = [
    { id: 1, action: 'Création facture', detail: 'FAC-2024-001 — Client ABC', date: '2024-10-15 14:32', user: 'alice_traore', type: 'facture' },
    { id: 2, action: 'Paiement reçu', detail: '500 000 FCFA — Entreprise XYZ', date: '2024-10-14 09:15', user: 'jean_dupont', type: 'paiement' },
    { id: 3, action: 'Transaction ajoutée', detail: 'Achat logiciel — 98 400 FCFA', date: '2024-10-13 16:48', user: 'oumar_kone', type: 'transaction' },
    { id: 4, action: 'Utilisateur créé', detail: 'fatou_barry (Employé)', date: '2024-10-12 11:20', user: 'alice_traore', type: 'utilisateur' },
    { id: 5, action: 'Facture payée', detail: 'FAC-2024-003 — Startup Inc', date: '2024-10-11 08:45', user: 'jean_dupont', type: 'paiement' },
    { id: 6, action: 'Modification profil', detail: 'Email mis à jour', date: '2024-10-10 17:30', user: 'oumar_kone', type: 'profil' },
    { id: 7, action: 'Transaction supprimée', detail: 'Abonnement annulé', date: '2024-10-09 13:12', user: 'alice_traore', type: 'transaction' },
  ];

  // RBAC filter
  const getFilteredHistory = () => {
    if (role === 'admin') return allHistory;
    if (role === 'manager') return allHistory.filter(h => h.user !== 'alice_traore');
    return allHistory.filter(h => h.user === (user?.username || ''));
  };

  const [searchQuery, setSearchQuery] = useState('');
  const history = getFilteredHistory().filter(h =>
    h.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.detail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const TYPE_ICONS = {
    facture: { icon: 'receipt', color: '#667eea' },
    paiement: { icon: 'cash-check', color: '#4CAF50' },
    transaction: { icon: 'swap-horizontal', color: '#FF9800' },
    utilisateur: { icon: 'account-plus', color: '#E91E63' },
    profil: { icon: 'account-edit', color: '#9C27B0' },
  };

  const renderItem = ({ item }) => {
    const typeConfig = TYPE_ICONS[item.type] || TYPE_ICONS.transaction;
    return (
      <Card style={[styles.historyCard, { backgroundColor: colors.surface }]}>
        <Card.Content>
          <View style={styles.historyRow}>
            <Avatar.Icon size={40} icon={typeConfig.icon} style={{ backgroundColor: typeConfig.color + '18' }} color={typeConfig.color} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={{ color: colors.text, fontWeight: '600', fontSize: 14 }}>{item.action}</Text>
              <Paragraph style={{ color: colors.textSecondary, fontSize: 12, marginTop: 2 }}>{item.detail}</Paragraph>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                <Icon name="clock-outline" size={12} color={colors.textSecondary} />
                <Text style={{ color: colors.textSecondary, fontSize: 11, marginLeft: 4 }}>{item.date}</Text>
                <Text style={{ color: colors.textSecondary, fontSize: 11, marginLeft: 10 }}>par {item.user}</Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Title style={{ color: colors.text, fontSize: 24 }}>📊 Historique</Title>
        <Paragraph style={{ color: colors.textSecondary }}>Activité récente de votre entreprise</Paragraph>
      </View>

      <Searchbar
        placeholder="Rechercher..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={[styles.searchBar, { backgroundColor: colors.surface }]}
        inputStyle={{ color: colors.text }}
        iconColor={colors.textSecondary}
        placeholderTextColor={colors.textSecondary}
      />

      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: 40 }}>
            <Icon name="history" size={48} color={colors.textSecondary} />
            <Paragraph style={{ color: colors.textSecondary, marginTop: 12 }}>Aucun historique trouvé</Paragraph>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 },
  searchBar: { marginHorizontal: 16, marginBottom: 12, borderRadius: 12, elevation: 1 },
  historyCard: { marginBottom: 10, borderRadius: 14, elevation: 1 },
  historyRow: { flexDirection: 'row', alignItems: 'flex-start' },
});

export default HistoryScreen;
