import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Text, Title, Paragraph, Avatar, Button, Chip, IconButton, Searchbar, Portal, Modal, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const UsersScreen = () => {
  const { colors } = useTheme();

  const [data, setData] = useState([
    { id: 1, username: 'alice_traore', email: 'alice@faso.com', role: 'admin', is_active: true },
    { id: 2, username: 'jean_dupont', email: 'jean@faso.com', role: 'manager', is_active: true },
    { id: 3, username: 'oumar_kone', email: 'oumar@faso.com', role: 'user', is_active: true },
    { id: 4, username: 'fatou_barry', email: 'fatou@faso.com', role: 'user', is_active: false },
    { id: 5, username: 'ibra_sow', email: 'ibra@faso.com', role: 'manager', is_active: true },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [editModal, setEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editRole, setEditRole] = useState('user');

  const ROLE_CONFIG = {
    admin: { label: 'Admin', color: '#f5222d', icon: 'shield-account' },
    manager: { label: 'Manager', color: '#fa8c16', icon: 'account-tie' },
    user: { label: 'Employé', color: '#667eea', icon: 'account' },
  };

  const filteredData = data.filter(u =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleActive = (id) => {
    setData(prev => prev.map(u =>
      u.id === id ? { ...u, is_active: !u.is_active } : u
    ));
  };

  const handleDelete = (id) => {
    Alert.alert('Supprimer', 'Supprimer cet utilisateur ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => setData(data.filter(u => u.id !== id)) },
    ]);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditRole(user.role);
    setEditModal(true);
  };

  const handleSaveRole = () => {
    setData(prev => prev.map(u =>
      u.id === selectedUser.id ? { ...u, role: editRole } : u
    ));
    setEditModal(false);
    Alert.alert('Succès', `Rôle modifié en ${ROLE_CONFIG[editRole].label}`);
  };

  const renderItem = ({ item }) => {
    const roleConfig = ROLE_CONFIG[item.role];
    return (
      <Card style={[styles.userCard, { backgroundColor: colors.surface, opacity: item.is_active ? 1 : 0.6 }]}>
        <Card.Content>
          <View style={styles.userRow}>
            <View style={styles.userLeft}>
              <Avatar.Text
                size={44}
                label={item.username.substring(0, 2).toUpperCase()}
                style={{ backgroundColor: roleConfig.color + '22' }}
                labelStyle={{ color: roleConfig.color }}
              />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ color: colors.text, fontWeight: '600', fontSize: 15 }}>{item.username}</Text>
                <Paragraph style={{ color: colors.textSecondary, fontSize: 12 }}>{item.email}</Paragraph>
                <View style={{ flexDirection: 'row', marginTop: 4, alignItems: 'center' }}>
                  <Chip
                    icon={() => <Icon name={roleConfig.icon} size={12} color={roleConfig.color} />}
                    style={{ backgroundColor: roleConfig.color + '18', height: 26 }}
                    textStyle={{ color: roleConfig.color, fontSize: 10, fontWeight: '600' }}
                  >
                    {roleConfig.label}
                  </Chip>
                  {!item.is_active && (
                    <Chip style={{ backgroundColor: '#fce4ec', marginLeft: 6, height: 26 }} textStyle={{ color: '#E91E63', fontSize: 10 }}>
                      Inactif
                    </Chip>
                  )}
                </View>
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <IconButton icon="pencil" size={18} iconColor={colors.primary} onPress={() => openEditModal(item)} />
              <IconButton icon={item.is_active ? 'account-off' : 'account-check'} size={18} iconColor="#FF9800" onPress={() => handleToggleActive(item.id)} />
              <IconButton icon="delete" size={18} iconColor="#E91E63" onPress={() => handleDelete(item.id)} />
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Title style={{ color: colors.text, fontSize: 24 }}>👥 Utilisateurs</Title>
        <Paragraph style={{ color: colors.textSecondary }}>Gérez les comptes de votre entreprise</Paragraph>
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
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />

      <Portal>
        <Modal visible={editModal} onDismiss={() => setEditModal(false)} contentContainerStyle={[styles.modal, { backgroundColor: colors.surface }]}>
          <Title style={{ color: colors.text, marginBottom: 16 }}>Modifier le rôle</Title>
          {selectedUser && (
            <Paragraph style={{ color: colors.textSecondary, marginBottom: 16 }}>
              Utilisateur: {selectedUser.username}
            </Paragraph>
          )}
          <View style={styles.roleSelector}>
            {Object.entries(ROLE_CONFIG).map(([key, config]) => (
              <Button
                key={key}
                mode={editRole === key ? 'contained' : 'outlined'}
                onPress={() => setEditRole(key)}
                buttonColor={editRole === key ? config.color : 'transparent'}
                textColor={editRole === key ? '#fff' : config.color}
                style={{ flex: 1, marginHorizontal: 4, borderRadius: 10, borderColor: config.color }}
                labelStyle={{ fontSize: 12 }}
                icon={config.icon}
              >
                {config.label}
              </Button>
            ))}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 }}>
            <Button mode="text" onPress={() => setEditModal(false)} textColor={colors.textSecondary}>Annuler</Button>
            <Button mode="contained" onPress={handleSaveRole} buttonColor={colors.primary} style={{ marginLeft: 10 }}>Enregistrer</Button>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 },
  searchBar: { marginHorizontal: 16, marginBottom: 12, borderRadius: 12, elevation: 1 },
  userCard: { marginBottom: 10, borderRadius: 14, elevation: 1 },
  userRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  userLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  modal: { margin: 20, padding: 24, borderRadius: 16 },
  roleSelector: { flexDirection: 'row' },
});

export default UsersScreen;
