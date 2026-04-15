import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Text, Title, Paragraph, Chip, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';

const STATUS_CONFIG = {
  en_cours: { label: 'En cours', color: '#FF9800', icon: 'clock-outline' },
  en_retard: { label: 'En retard', color: '#f44336', icon: 'alert-circle' },
  paye: { label: 'Payé', color: '#4CAF50', icon: 'check-circle' },
};

const DebtsScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { formatMoney } = useCurrency();

  const data = [
    { id: 1, creditor: 'Banque XYZ', amount: 3280000, dueDate: '2023-11-01', status: 'en_cours' },
    { id: 2, creditor: 'Fournisseur A', amount: 787200, dueDate: '2023-09-15', status: 'en_retard' },
    { id: 3, creditor: 'Fournisseur B', amount: 295200, dueDate: '2023-10-20', status: 'paye' },
  ];

  const totalDebt = data.filter(d => d.status !== 'paye').reduce((sum, d) => sum + d.amount, 0);
  const totalPaid = data.filter(d => d.status === 'paye').reduce((sum, d) => sum + d.amount, 0);

  const renderItem = ({ item }) => {
    const status = STATUS_CONFIG[item.status];
    return (
      <Card style={[styles.debtCard, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.navigate('Factures', { debt_id: item.id })}>
          <Card.Content>
            <View style={styles.debtRow}>
              <View style={styles.debtLeft}>
                <Avatar.Icon
                  size={44}
                  icon={item.status === 'paye' ? 'check-circle' : 'credit-card-clock'}
                  style={{ backgroundColor: status.color + '18' }}
                  color={status.color}
                />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={{ color: colors.text, fontWeight: '600', fontSize: 16 }}>{item.creditor}</Text>
                  <Paragraph style={{ color: colors.textSecondary, fontSize: 12, marginTop: 2 }}>
                    Échéance: {item.dueDate}
                  </Paragraph>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: item.status === 'paye' ? '#4CAF50' : colors.text, fontWeight: 'bold', fontSize: 16 }}>
                  {formatMoney(item.amount)}
                </Text>
                <Chip
                  icon={() => <Icon name={status.icon} size={12} color={status.color} />}
                  style={{ backgroundColor: status.color + '18', marginTop: 6, height: 26 }}
                  textStyle={{ color: status.color, fontSize: 10, fontWeight: '600' }}
                >
                  {status.label}
                </Chip>
              </View>
            </View>
          </Card.Content>
        </TouchableOpacity>
      </Card>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Title style={{ color: colors.text, fontSize: 24 }}>💳 Dettes</Title>
        <Paragraph style={{ color: colors.textSecondary }}>Suivi de vos créances et paiements</Paragraph>
      </View>

      {/* Summary */}
      <View style={styles.summaryRow}>
        <Card style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
          <Card.Content style={{ alignItems: 'center' }}>
            <Icon name="cash-remove" size={28} color="#f44336" />
            <Paragraph style={{ color: colors.textSecondary, fontSize: 11, marginTop: 6 }}>RESTANT</Paragraph>
            <Title style={{ color: '#f44336', fontSize: 16 }}>{formatMoney(totalDebt)}</Title>
          </Card.Content>
        </Card>
        <Card style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
          <Card.Content style={{ alignItems: 'center' }}>
            <Icon name="cash-check" size={28} color="#4CAF50" />
            <Paragraph style={{ color: colors.textSecondary, fontSize: 11, marginTop: 6 }}>REMBOURSÉ</Paragraph>
            <Title style={{ color: '#4CAF50', fontSize: 16 }}>{formatMoney(totalPaid)}</Title>
          </Card.Content>
        </Card>
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: 40 }}>
            <Icon name="check-all" size={48} color={colors.textSecondary} />
            <Paragraph style={{ color: colors.textSecondary, marginTop: 12 }}>Aucune dette !</Paragraph>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 },
  summaryRow: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 12 },
  summaryCard: { flex: 1, marginHorizontal: 4, borderRadius: 12, elevation: 1 },
  debtCard: { marginBottom: 10, borderRadius: 14, elevation: 1 },
  debtRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  debtLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
});

export default DebtsScreen;
