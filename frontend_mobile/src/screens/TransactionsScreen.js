import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Text, Title, Paragraph, FAB, Portal, Modal, TextInput, Button, Chip, IconButton, Divider } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';

const TransactionsScreen = () => {
  const { colors } = useTheme();
  const { formatMoney } = useCurrency();
  const { user } = useAuth();
  const role = user?.role || 'user';

  const [data, setData] = useState([
    { id: 1, date: '2023-10-01', description: 'Achat logiciel', amount: -98400, type: 'expense', category: 'Outils' },
    { id: 2, date: '2023-10-05', description: 'Prestation développement', amount: 1968000, type: 'income', category: 'Ventes' },
    { id: 3, date: '2023-10-10', description: 'Abonnement cloud', amount: -65600, type: 'expense', category: 'Logiciels' },
    { id: 4, date: '2023-10-15', description: 'Consultation stratégique', amount: 984000, type: 'income', category: 'Services' },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form, setForm] = useState({ description: '', amount: '', type: 'income', category: '', date: '' });

  const handleAdd = () => {
    setEditingRecord(null);
    setForm({ description: '', amount: '', type: 'income', category: '', date: new Date().toISOString().split('T')[0] });
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setForm({
      description: record.description,
      amount: String(Math.abs(record.amount)),
      type: record.type,
      category: record.category,
      date: record.date,
    });
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    Alert.alert('Supprimer', 'Êtes-vous sûr de vouloir supprimer cette transaction ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer', style: 'destructive',
        onPress: () => setData(data.filter(item => item.id !== id)),
      },
    ]);
  };

  const handleSave = () => {
    if (!form.description || !form.amount || !form.category) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
    const amount = form.type === 'expense' ? -Math.abs(Number(form.amount)) : Math.abs(Number(form.amount));
    if (editingRecord) {
      setData(data.map(item => item.id === editingRecord.id ? { ...item, ...form, amount } : item));
    } else {
      setData([...data, { ...form, amount, id: Date.now() }]);
    }
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <Card style={[styles.transCard, { backgroundColor: colors.surface }]} key={item.id}>
      <View style={styles.transRow}>
        <View style={styles.transLeft}>
          <View style={[styles.iconCircle, { backgroundColor: item.type === 'income' ? '#e8f5e9' : '#fce4ec' }]}>
            <Icon name={item.type === 'income' ? 'trending-up' : 'trending-down'} size={20} color={item.type === 'income' ? '#4CAF50' : '#E91E63'} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, fontWeight: '600', fontSize: 15 }}>{item.description}</Text>
            <Paragraph style={{ color: colors.textSecondary, fontSize: 12 }}>{item.date} • {item.category}</Paragraph>
          </View>
        </View>
        <View style={styles.transRight}>
          <Text style={{ color: item.type === 'income' ? '#4CAF50' : '#E91E63', fontWeight: 'bold', fontSize: 14 }}>
            {item.type === 'income' ? '+' : ''}{formatMoney(item.amount)}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <IconButton icon="pencil" size={18} iconColor={colors.primary} onPress={() => handleEdit(item)} />
            {(role === 'admin' || role === 'manager') && (
              <IconButton icon="delete" size={18} iconColor="#E91E63" onPress={() => handleDelete(item.id)} />
            )}
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Title style={{ color: colors.text, fontSize: 24 }}>💸 Transactions</Title>
        <Paragraph style={{ color: colors.textSecondary }}>Gérez vos revenus et dépenses</Paragraph>
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={handleAdd}
        color="#fff"
        label="Ajouter"
      />

      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={[styles.modal, { backgroundColor: colors.surface }]}>
          <Title style={{ color: colors.text, marginBottom: 16 }}>{editingRecord ? 'Modifier' : 'Nouvelle Transaction'}</Title>
          
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[styles.typeBtn, form.type === 'income' && { backgroundColor: '#e8f5e9', borderColor: '#4CAF50' }]}
              onPress={() => setForm({ ...form, type: 'income' })}
            >
              <Text style={{ color: form.type === 'income' ? '#4CAF50' : colors.textSecondary, fontWeight: '600' }}>📈 Revenu</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeBtn, form.type === 'expense' && { backgroundColor: '#fce4ec', borderColor: '#E91E63' }]}
              onPress={() => setForm({ ...form, type: 'expense' })}
            >
              <Text style={{ color: form.type === 'expense' ? '#E91E63' : colors.textSecondary, fontWeight: '600' }}>📉 Dépense</Text>
            </TouchableOpacity>
          </View>

          <TextInput mode="outlined" label="Description" value={form.description} onChangeText={t => setForm({ ...form, description: t })} style={styles.modalInput} outlineColor={colors.border} activeOutlineColor={colors.primary} textColor={colors.text} />
          <TextInput mode="outlined" label="Montant (FCFA)" value={form.amount} onChangeText={t => setForm({ ...form, amount: t })} keyboardType="numeric" style={styles.modalInput} outlineColor={colors.border} activeOutlineColor={colors.primary} textColor={colors.text} />
          <TextInput mode="outlined" label="Catégorie" value={form.category} onChangeText={t => setForm({ ...form, category: t })} style={styles.modalInput} outlineColor={colors.border} activeOutlineColor={colors.primary} textColor={colors.text} />

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
            <Button mode="text" onPress={() => setModalVisible(false)} textColor={colors.textSecondary}>Annuler</Button>
            <Button mode="contained" onPress={handleSave} buttonColor={colors.primary} style={{ marginLeft: 10 }}>Sauvegarder</Button>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 },
  transCard: { marginBottom: 10, borderRadius: 14, elevation: 1 },
  transRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 },
  transLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  transRight: { alignItems: 'flex-end' },
  iconCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  fab: { position: 'absolute', right: 20, bottom: 20, borderRadius: 16 },
  modal: { margin: 20, padding: 24, borderRadius: 16 },
  typeSelector: { flexDirection: 'row', marginBottom: 16 },
  typeBtn: { flex: 1, padding: 12, borderWidth: 1.5, borderColor: '#ddd', borderRadius: 10, alignItems: 'center', marginHorizontal: 4 },
  modalInput: { marginBottom: 12 },
});

export default TransactionsScreen;
