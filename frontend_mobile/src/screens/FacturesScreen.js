import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Text, Title, Paragraph, FAB, Portal, Modal, TextInput, Button, Chip, IconButton, ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';

const STATUS_CONFIG = {
  paye: { label: 'Payé', color: '#4CAF50', icon: 'check-circle' },
  en_attente: { label: 'En attente', color: '#FF9800', icon: 'clock-outline' },
  en_retard: { label: 'En retard', color: '#f44336', icon: 'alert-circle' },
};

const FacturesScreen = () => {
  const { colors } = useTheme();
  const { formatMoney } = useCurrency();
  const { user } = useAuth();
  const role = user?.role || 'user';
  const canEdit = role === 'admin' || role === 'manager';

  const [data, setData] = useState([
    { id: 1, reference: 'FAC-2024-001', client: 'Client ABC', amount: 984000, paid: 0, dueDate: '2024-11-01', status: 'en_retard' },
    { id: 2, reference: 'FAC-2024-002', client: 'Entreprise XYZ', amount: 2099200, paid: 500000, dueDate: '2024-12-15', status: 'en_attente' },
    { id: 3, reference: 'FAC-2024-003', client: 'Startup Inc', amount: 557600, paid: 557600, dueDate: '2024-10-20', status: 'paye' },
    { id: 4, reference: 'FAC-2024-004', client: 'Tech Solutions', amount: 1475000, paid: 0, dueDate: '2025-01-30', status: 'en_attente' },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [payModalVisible, setPayModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [form, setForm] = useState({ reference: '', client: '', amount: '', dueDate: '' });
  const [payAmount, setPayAmount] = useState('');

  const totalAmount = data.reduce((sum, d) => sum + d.amount, 0);
  const totalPaid = data.reduce((sum, d) => sum + d.paid, 0);
  const totalDue = totalAmount - totalPaid;

  const handleAdd = () => {
    setForm({ reference: `FAC-${Date.now().toString().slice(-6)}`, client: '', amount: '', dueDate: '' });
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!form.client || !form.amount) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
    setData([...data, {
      id: Date.now(),
      reference: form.reference,
      client: form.client,
      amount: Number(form.amount),
      paid: 0,
      dueDate: form.dueDate || new Date().toISOString().split('T')[0],
      status: 'en_attente',
    }]);
    setModalVisible(false);
  };

  const openPayModal = (invoice) => {
    setSelectedInvoice(invoice);
    setPayAmount(String(invoice.amount - invoice.paid));
    setPayModalVisible(true);
  };

  const handlePayment = () => {
    const amount = Number(payAmount);
    const remaining = selectedInvoice.amount - selectedInvoice.paid;
    if (amount <= 0 || amount > remaining) {
      Alert.alert('Erreur', 'Montant invalide.');
      return;
    }
    setData(prev => prev.map(inv => {
      if (inv.id === selectedInvoice.id) {
        const newPaid = inv.paid + amount;
        return { ...inv, paid: newPaid, status: newPaid >= inv.amount ? 'paye' : 'en_attente' };
      }
      return inv;
    }));
    setPayModalVisible(false);
    Alert.alert('Succès', `Paiement de ${formatMoney(amount)} enregistré !`);
  };

  const handleDelete = (id) => {
    Alert.alert('Supprimer', 'Supprimer cette facture ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => setData(data.filter(i => i.id !== id)) },
    ]);
  };

  const renderItem = ({ item }) => {
    const status = STATUS_CONFIG[item.status];
    const progress = item.amount > 0 ? item.paid / item.amount : 0;
    const remaining = item.amount - item.paid;

    return (
      <Card style={[styles.invoiceCard, { backgroundColor: colors.surface }]}>
        <Card.Content>
          <View style={styles.invoiceHeader}>
            <View>
              <Text style={{ fontWeight: 'bold', color: colors.text, fontSize: 16 }}>{item.reference}</Text>
              <Paragraph style={{ color: colors.textSecondary }}>{item.client}</Paragraph>
            </View>
            <Chip
              icon={() => <Icon name={status.icon} size={14} color={status.color} />}
              style={{ backgroundColor: status.color + '18' }}
              textStyle={{ color: status.color, fontSize: 11, fontWeight: '600' }}
            >
              {status.label}
            </Chip>
          </View>

          <View style={styles.amountRow}>
            <View>
              <Paragraph style={{ color: colors.textSecondary, fontSize: 11 }}>MONTANT TOTAL</Paragraph>
              <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 18 }}>{formatMoney(item.amount)}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Paragraph style={{ color: colors.textSecondary, fontSize: 11 }}>RESTANT</Paragraph>
              <Text style={{ color: remaining > 0 ? '#E91E63' : '#4CAF50', fontWeight: 'bold', fontSize: 18 }}>{formatMoney(remaining)}</Text>
            </View>
          </View>

          <ProgressBar progress={progress} color={item.status === 'paye' ? '#4CAF50' : colors.primary} style={{ height: 6, borderRadius: 3, marginVertical: 10, backgroundColor: colors.border }} />

          <View style={styles.invoiceActions}>
            <Paragraph style={{ color: colors.textSecondary, fontSize: 12 }}>Échéance: {item.dueDate}</Paragraph>
            <View style={{ flexDirection: 'row' }}>
              {item.status !== 'paye' && canEdit && (
                <Button mode="contained" compact onPress={() => openPayModal(item)} buttonColor={colors.primary} textColor="#fff" style={{ borderRadius: 8, marginRight: 6 }} labelStyle={{ fontSize: 12 }}>
                  Payer
                </Button>
              )}
              {canEdit && (
                <IconButton icon="delete" size={20} iconColor="#E91E63" onPress={() => handleDelete(item.id)} />
              )}
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Title style={{ color: colors.text, fontSize: 24 }}>🧾 Factures</Title>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryRow}>
        <Card style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
          <Card.Content>
            <Paragraph style={{ color: colors.textSecondary, fontSize: 11 }}>TOTAL</Paragraph>
            <Title style={{ color: colors.text, fontSize: 16 }}>{formatMoney(totalAmount)}</Title>
          </Card.Content>
        </Card>
        <Card style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
          <Card.Content>
            <Paragraph style={{ color: colors.textSecondary, fontSize: 11 }}>PAYÉ</Paragraph>
            <Title style={{ color: '#4CAF50', fontSize: 16 }}>{formatMoney(totalPaid)}</Title>
          </Card.Content>
        </Card>
        <Card style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
          <Card.Content>
            <Paragraph style={{ color: colors.textSecondary, fontSize: 11 }}>DÛ</Paragraph>
            <Title style={{ color: '#E91E63', fontSize: 16 }}>{formatMoney(totalDue)}</Title>
          </Card.Content>
        </Card>
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      />

      {canEdit && (
        <FAB icon="plus" style={[styles.fab, { backgroundColor: colors.primary }]} onPress={handleAdd} color="#fff" label="Facture" />
      )}

      {/* Create Invoice Modal */}
      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={[styles.modal, { backgroundColor: colors.surface }]}>
          <Title style={{ color: colors.text, marginBottom: 16 }}>Nouvelle Facture</Title>
          <TextInput mode="outlined" label="Référence" value={form.reference} onChangeText={t => setForm({ ...form, reference: t })} style={styles.modalInput} outlineColor={colors.border} activeOutlineColor={colors.primary} textColor={colors.text} />
          <TextInput mode="outlined" label="Client" value={form.client} onChangeText={t => setForm({ ...form, client: t })} style={styles.modalInput} outlineColor={colors.border} activeOutlineColor={colors.primary} textColor={colors.text} />
          <TextInput mode="outlined" label="Montant (FCFA)" value={form.amount} onChangeText={t => setForm({ ...form, amount: t })} keyboardType="numeric" style={styles.modalInput} outlineColor={colors.border} activeOutlineColor={colors.primary} textColor={colors.text} />
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
            <Button mode="text" onPress={() => setModalVisible(false)} textColor={colors.textSecondary}>Annuler</Button>
            <Button mode="contained" onPress={handleSave} buttonColor={colors.primary} style={{ marginLeft: 10 }}>Créer</Button>
          </View>
        </Modal>
      </Portal>

      {/* Payment Modal */}
      <Portal>
        <Modal visible={payModalVisible} onDismiss={() => setPayModalVisible(false)} contentContainerStyle={[styles.modal, { backgroundColor: colors.surface }]}>
          <Title style={{ color: colors.text, marginBottom: 8 }}>Enregistrer un paiement</Title>
          {selectedInvoice && (
            <Paragraph style={{ color: colors.textSecondary, marginBottom: 16 }}>
              {selectedInvoice.reference} — Restant: {formatMoney(selectedInvoice.amount - selectedInvoice.paid)}
            </Paragraph>
          )}

          <View style={styles.paymentMethods}>
            {[
              { key: 'card', label: '💳 Carte', color: colors.primary },
              { key: 'mobile', label: '📱 Mobile', color: '#E91E63' },
              { key: 'bank', label: '🏦 Virement', color: '#4CAF50' },
              { key: 'cash', label: '💵 Espèces', color: '#FF9800' },
            ].map(m => (
              <TouchableOpacity key={m.key} style={[styles.payMethodBtn, { borderColor: colors.border }]}>
                <Text style={{ fontSize: 12, color: colors.text, textAlign: 'center' }}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput mode="outlined" label="Montant à payer" value={payAmount} onChangeText={setPayAmount} keyboardType="numeric" style={styles.modalInput} outlineColor={colors.border} activeOutlineColor={colors.primary} textColor={colors.text} />
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
            <Button mode="text" onPress={() => setPayModalVisible(false)} textColor={colors.textSecondary}>Annuler</Button>
            <Button mode="contained" onPress={handlePayment} buttonColor="#4CAF50" style={{ marginLeft: 10 }}>Payer</Button>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 },
  summaryRow: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 12 },
  summaryCard: { flex: 1, marginHorizontal: 4, borderRadius: 12, elevation: 1 },
  invoiceCard: { marginBottom: 12, borderRadius: 16, elevation: 1 },
  invoiceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  amountRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  invoiceActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  fab: { position: 'absolute', right: 20, bottom: 20, borderRadius: 16 },
  modal: { margin: 20, padding: 24, borderRadius: 16 },
  modalInput: { marginBottom: 12 },
  paymentMethods: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  payMethodBtn: { flex: 1, padding: 10, borderWidth: 1, borderRadius: 10, alignItems: 'center', marginHorizontal: 3 },
});

export default FacturesScreen;
