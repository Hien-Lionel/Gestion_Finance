import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Text, Title, Paragraph, Switch, List, TextInput, Button, Divider, Portal, Modal, Chip } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useEnterprise } from '../context/EnterpriseContext';

const SettingsScreen = () => {
  const { isDark, toggleTheme, colors } = useTheme();
  const { user } = useAuth();
  const { enterprise } = useEnterprise();
  const role = user?.role || 'user';

  // General
  const [emailNotifs, setEmailNotifs] = useState(true);

  // Manager
  const [teamAlerts, setTeamAlerts] = useState(true);
  const [transactionNotifs, setTransactionNotifs] = useState(true);

  // Admin
  const [managerCode, setManagerCode] = useState('MANAGER2025');
  const [adminCode, setAdminCode] = useState('ADMIN2025');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [transactionLimit, setTransactionLimit] = useState('10000000');

  // Enterprise modal
  const [createModal, setCreateModal] = useState(false);
  const [newEntName, setNewEntName] = useState('');
  const [createdCode, setCreatedCode] = useState('');

  const handleCreateEnterprise = () => {
    if (!newEntName) {
      Alert.alert('Erreur', 'Veuillez saisir un nom.');
      return;
    }
    // Simulated - in production, call API
    const code = `ENT-${Date.now().toString().slice(-6).toUpperCase()}`;
    setCreatedCode(code);
    Alert.alert('Succès', `Entreprise "${newEntName}" créée !\nCode: ${code}`);
    setNewEntName('');
  };

  const handleSaveCodes = () => {
    Alert.alert('Succès', 'Codes de vérification mis à jour !');
  };

  const getRoleBadge = () => {
    const config = { admin: { label: 'Admin', color: '#f5222d' }, manager: { label: 'Manager', color: '#fa8c16' }, user: { label: 'Employé', color: '#667eea' } };
    const r = config[role] || config.user;
    return <Chip style={{ backgroundColor: r.color + '22' }} textStyle={{ color: r.color, fontWeight: 'bold', fontSize: 12 }}>{r.label}</Chip>;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Title style={{ color: colors.text, fontSize: 24, flex: 1 }}>⚙️ Paramètres</Title>
            {getRoleBadge()}
          </View>
        </View>

        {/* ── General Settings (All roles) ── */}
        <Card style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
          <Card.Content>
            <Title style={{ color: colors.text, fontSize: 16, marginBottom: 12 }}>🔧 Paramètres Généraux</Title>

            <List.Item
              title="Mode Sombre"
              description="Basculer entre thème clair et sombre"
              left={() => <List.Icon icon={isDark ? 'weather-night' : 'white-balance-sunny'} color="#faad14" />}
              right={() => <Switch value={isDark} onValueChange={toggleTheme} color={colors.primary} />}
              titleStyle={{ color: colors.text }}
              descriptionStyle={{ color: colors.textSecondary }}
            />
            <Divider />
            <List.Item
              title="Notifications Email"
              description="Alertes pour les factures en retard"
              left={() => <List.Icon icon="bell-outline" color="#667eea" />}
              right={() => <Switch value={emailNotifs} onValueChange={setEmailNotifs} color={colors.primary} />}
              titleStyle={{ color: colors.text }}
              descriptionStyle={{ color: colors.textSecondary }}
            />
            <Divider />
            <List.Item
              title="Langue"
              description="Langue de l'interface"
              left={() => <List.Icon icon="translate" color="#4CAF50" />}
              right={() => <Text style={{ color: colors.textSecondary }}>Français 🇫🇷</Text>}
              titleStyle={{ color: colors.text }}
              descriptionStyle={{ color: colors.textSecondary }}
            />
          </Card.Content>
        </Card>

        {/* ── Manager Settings ── */}
        {(role === 'manager' || role === 'admin') && (
          <Card style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
            <Card.Content>
              <Title style={{ color: colors.text, fontSize: 16, marginBottom: 12 }}>👔 Paramètres Manager</Title>

              <List.Item
                title="Alertes performance"
                description="Alerte quand un utilisateur dépasse les seuils"
                left={() => <List.Icon icon="alert" color="#fa8c16" />}
                right={() => <Switch value={teamAlerts} onValueChange={setTeamAlerts} color={colors.primary} />}
                titleStyle={{ color: colors.text }}
                descriptionStyle={{ color: colors.textSecondary }}
              />
              <Divider />
              <List.Item
                title="Notifications transactions"
                description="Être notifié des transactions de vos utilisateurs"
                left={() => <List.Icon icon="bell-ring" color="#13c2c2" />}
                right={() => <Switch value={transactionNotifs} onValueChange={setTransactionNotifs} color={colors.primary} />}
                titleStyle={{ color: colors.text }}
                descriptionStyle={{ color: colors.textSecondary }}
              />
            </Card.Content>
          </Card>
        )}

        {/* ── Admin Settings ── */}
        {role === 'admin' && (
          <>
            <Card style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
              <Card.Content>
                <Title style={{ color: colors.text, fontSize: 16, marginBottom: 12 }}>🛡️ Paramètres Administrateur</Title>

                {/* Enterprise Code */}
                <View style={styles.settingBlock}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Icon name="shield-check" size={20} color={colors.primary} />
                    <Text style={{ color: colors.text, fontWeight: '600', fontSize: 15, marginLeft: 8 }}>Code Entreprise Actuelle</Text>
                  </View>
                  <Paragraph style={{ color: colors.textSecondary, marginBottom: 8 }}>Partagez ce code avec vos collaborateurs pour qu'ils rejoignent votre espace.</Paragraph>
                  <View style={[styles.codeBox, { borderColor: colors.primary }]}>
                    <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 20, letterSpacing: 2, fontFamily: 'monospace' }}>
                      {enterprise?.code || 'Aucune entreprise'}
                    </Text>
                  </View>
                </View>

                <Divider style={{ marginVertical: 16 }} />

                {/* Create Enterprise */}
                <View style={styles.settingBlock}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Icon name="plus-circle" size={20} color="#E91E63" />
                      <Text style={{ color: colors.text, fontWeight: '600', fontSize: 15, marginLeft: 8 }}>Nouvelle entreprise</Text>
                    </View>
                    <Button mode="contained" compact onPress={() => { setCreatedCode(''); setCreateModal(true); }} buttonColor="#E91E63" textColor="#fff" style={{ borderRadius: 8 }} labelStyle={{ fontSize: 12 }}>
                      Ajouter
                    </Button>
                  </View>
                </View>

                <Divider style={{ marginVertical: 16 }} />

                {/* Registration Codes */}
                <View style={styles.settingBlock}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <Icon name="key-variant" size={20} color="#fa8c16" />
                    <Text style={{ color: colors.text, fontWeight: '600', fontSize: 15, marginLeft: 8 }}>Codes d'inscription</Text>
                  </View>
                  <TextInput mode="outlined" label="Code Manager" value={managerCode} onChangeText={setManagerCode} style={styles.input} outlineColor={colors.border} activeOutlineColor={colors.primary} textColor={colors.text} left={<TextInput.Icon icon="account-tie" />} />
                  <TextInput mode="outlined" label="Code Admin" value={adminCode} onChangeText={setAdminCode} style={styles.input} outlineColor={colors.border} activeOutlineColor={colors.primary} textColor={colors.text} left={<TextInput.Icon icon="shield-account" />} />
                  <Button mode="contained" onPress={handleSaveCodes} buttonColor={colors.primary} style={{ borderRadius: 10, marginTop: 4 }} icon="content-save">
                    Sauvegarder les codes
                  </Button>
                </View>

                <Divider style={{ marginVertical: 16 }} />

                {/* Transaction Limit */}
                <View style={styles.settingBlock}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Icon name="alert-octagon" size={20} color="#f5222d" />
                    <Text style={{ color: colors.text, fontWeight: '600', fontSize: 15, marginLeft: 8 }}>Seuil d'alerte</Text>
                  </View>
                  <TextInput mode="outlined" label="Montant max (FCFA)" value={transactionLimit} onChangeText={setTransactionLimit} keyboardType="numeric" style={styles.input} outlineColor={colors.border} activeOutlineColor={colors.primary} textColor={colors.text} />
                </View>

                <Divider style={{ marginVertical: 16 }} />

                {/* Maintenance Mode */}
                <List.Item
                  title="Mode Maintenance"
                  description="Bloque l'accès utilisateur"
                  left={() => <List.Icon icon="wrench" color="#ff4d4f" />}
                  right={() => <Switch value={maintenanceMode} onValueChange={setMaintenanceMode} color="#ff4d4f" />}
                  titleStyle={{ color: colors.text }}
                  descriptionStyle={{ color: colors.textSecondary }}
                />
              </Card.Content>
            </Card>
          </>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Create Enterprise Modal */}
      <Portal>
        <Modal visible={createModal} onDismiss={() => setCreateModal(false)} contentContainerStyle={[styles.modal, { backgroundColor: colors.surface }]}>
          {!createdCode ? (
            <>
              <Title style={{ color: colors.text, marginBottom: 16 }}>Créer une entreprise</Title>
              <TextInput mode="outlined" label="Nom de l'entreprise" value={newEntName} onChangeText={setNewEntName} style={styles.input} outlineColor={colors.border} activeOutlineColor={colors.primary} textColor={colors.text} left={<TextInput.Icon icon="domain" />} />
              <Button mode="contained" onPress={handleCreateEnterprise} buttonColor={colors.primary} style={{ borderRadius: 10, marginTop: 8 }} icon="plus">
                Créer l'entreprise
              </Button>
            </>
          ) : (
            <View style={{ alignItems: 'center' }}>
              <Icon name="check-circle" size={48} color="#4CAF50" />
              <Title style={{ color: colors.text, marginTop: 12 }}>Succès !</Title>
              <Paragraph style={{ color: colors.textSecondary, textAlign: 'center', marginVertical: 12 }}>
                Voici le code secret généré. Transmettez-le à vos collaborateurs.
              </Paragraph>
              <View style={[styles.codeBox, { borderColor: colors.primary, paddingVertical: 16, paddingHorizontal: 24 }]}>
                <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 24, letterSpacing: 3 }}>{createdCode}</Text>
              </View>
              <Button mode="contained" onPress={() => setCreateModal(false)} buttonColor={colors.primary} style={{ borderRadius: 10, marginTop: 20, width: '100%' }}>
                Terminer
              </Button>
            </View>
          )}
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 },
  sectionCard: { marginHorizontal: 16, marginBottom: 16, borderRadius: 16, elevation: 1 },
  settingBlock: { marginBottom: 4 },
  input: { marginBottom: 12 },
  codeBox: { borderWidth: 2, borderStyle: 'dashed', borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 4 },
  modal: { margin: 20, padding: 24, borderRadius: 16 },
});

export default SettingsScreen;
