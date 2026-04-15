import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Text, Title, Paragraph, Avatar, Button, Switch, List, TextInput, Divider } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useEnterprise } from '../context/EnterpriseContext';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme, colors } = useTheme();
  const { enterprise } = useEnterprise();
  const role = user?.role || 'user';

  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const getRoleBadge = (r) => {
    const config = {
      admin: { label: 'Administrateur', color: '#f5222d' },
      manager: { label: 'Manager', color: '#fa8c16' },
      user: { label: 'Employé', color: '#667eea' },
    };
    const rc = config[r] || config.user;
    return (
      <View style={[styles.roleBadge, { backgroundColor: rc.color + '22' }]}>
        <Text style={{ color: rc.color, fontWeight: 'bold', fontSize: 12 }}>{rc.label}</Text>
      </View>
    );
  };

  const handleProfileUpdate = () => {
    if (!profileForm.username || !profileForm.email) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
    setProfileLoading(true);
    setTimeout(() => {
      Alert.alert('Succès', 'Profil mis à jour avec succès !');
      setProfileLoading(false);
    }, 800);
  };

  const handlePasswordChange = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    setPasswordLoading(true);
    setTimeout(() => {
      Alert.alert('Succès', 'Mot de passe modifié avec succès !');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordLoading(false);
    }, 800);
  };

  // Menu items for navigation
  const menuItems = [
    { title: '⚙️ Paramètres', desc: 'Entreprise, codes, préférences', screen: 'Settings', icon: 'cog', show: true },
    { title: '📊 Historique', desc: 'Journal d\'activité', screen: 'History', icon: 'history', show: role === 'admin' || role === 'manager' },
    { title: '👥 Utilisateurs', desc: 'Gestion des comptes', screen: 'Users', icon: 'account-group', show: role === 'admin' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Title style={{ color: colors.text, fontSize: 24 }}>Mon Espace</Title>
        </View>

        {/* User Card */}
        <Card style={[styles.card, { backgroundColor: colors.surface, marginHorizontal: 16 }]}>
          <Card.Content style={styles.cardContent}>
            <Avatar.Text size={64} label={user?.username?.substring(0, 2).toUpperCase() || 'FF'} style={{ backgroundColor: colors.primary }} />
            <View style={styles.userInfo}>
              <Title style={{ color: colors.text }}>{user?.first_name ? `${user.first_name} ${user.last_name}` : user?.username}</Title>
              <Paragraph style={{ color: colors.textSecondary }}>{user?.email}</Paragraph>
              {getRoleBadge(user?.role)}
            </View>
          </Card.Content>
        </Card>

        {/* Enterprise */}
        {enterprise && (
          <Card style={[styles.card, { backgroundColor: colors.surface, marginHorizontal: 16, marginTop: 0 }]}>
            <Card.Content>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="domain" size={24} color={colors.primary} />
                <View style={{ marginLeft: 12 }}>
                  <Text style={{ color: colors.text, fontWeight: '600' }}>{enterprise.name}</Text>
                  <Paragraph style={{ color: colors.textSecondary, fontSize: 12 }}>Code: {enterprise.code}</Paragraph>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Quick Navigation Menu */}
        <Card style={[styles.card, { backgroundColor: colors.surface, marginHorizontal: 16, marginTop: 0 }]}>
          <Card.Content style={{ paddingVertical: 4 }}>
            {menuItems.filter(m => m.show).map((item, index) => (
              <React.Fragment key={item.screen}>
                <List.Item
                  title={item.title}
                  description={item.desc}
                  left={() => <List.Icon icon={item.icon} color={colors.primary} />}
                  right={() => <Icon name="chevron-right" size={20} color={colors.textSecondary} />}
                  onPress={() => navigation.navigate(item.screen)}
                  titleStyle={{ color: colors.text, fontWeight: '600' }}
                  descriptionStyle={{ color: colors.textSecondary }}
                />
                {index < menuItems.filter(m => m.show).length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Card.Content>
        </Card>

        {/* Tab Selector */}
        <View style={[styles.tabRow, { marginHorizontal: 16 }]}>
          {['profile', 'password'].map(tab => (
            <Button
              key={tab}
              mode={activeTab === tab ? 'contained' : 'outlined'}
              onPress={() => setActiveTab(tab)}
              buttonColor={activeTab === tab ? colors.primary : 'transparent'}
              textColor={activeTab === tab ? '#fff' : colors.textSecondary}
              style={{ flex: 1, marginHorizontal: 4, borderRadius: 10, borderColor: colors.border }}
              labelStyle={{ fontSize: 13 }}
            >
              {tab === 'profile' ? '✏️ Profil' : '🔒 Mot de passe'}
            </Button>
          ))}
        </View>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <Card style={[styles.formCard, { backgroundColor: colors.surface, marginHorizontal: 16 }]}>
            <Card.Content>
              <Title style={{ color: colors.text, fontSize: 16, marginBottom: 16 }}>Modifier mes informations</Title>
              <TextInput mode="outlined" label="Nom d'utilisateur" value={profileForm.username} onChangeText={t => setProfileForm({ ...profileForm, username: t })} style={styles.input} outlineColor={colors.border} activeOutlineColor={colors.primary} textColor={colors.text} left={<TextInput.Icon icon="account" />} />
              <TextInput mode="outlined" label="Adresse Email" value={profileForm.email} onChangeText={t => setProfileForm({ ...profileForm, email: t })} style={styles.input} outlineColor={colors.border} activeOutlineColor={colors.primary} textColor={colors.text} keyboardType="email-address" left={<TextInput.Icon icon="email-outline" />} />
              <Button mode="contained" onPress={handleProfileUpdate} loading={profileLoading} buttonColor={colors.primary} style={{ borderRadius: 10, marginTop: 8 }} icon="content-save">
                Enregistrer
              </Button>
            </Card.Content>
          </Card>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <Card style={[styles.formCard, { backgroundColor: colors.surface, marginHorizontal: 16 }]}>
            <Card.Content>
              <Title style={{ color: colors.text, fontSize: 16, marginBottom: 16 }}>Changer le mot de passe</Title>
              <TextInput mode="outlined" label="Mot de passe actuel" value={passwordForm.currentPassword} onChangeText={t => setPasswordForm({ ...passwordForm, currentPassword: t })} secureTextEntry style={styles.input} outlineColor={colors.border} activeOutlineColor={colors.primary} textColor={colors.text} left={<TextInput.Icon icon="lock" />} />
              <Divider style={{ marginVertical: 12 }} />
              <TextInput mode="outlined" label="Nouveau mot de passe" value={passwordForm.newPassword} onChangeText={t => setPasswordForm({ ...passwordForm, newPassword: t })} secureTextEntry style={styles.input} outlineColor={colors.border} activeOutlineColor={colors.primary} textColor={colors.text} left={<TextInput.Icon icon="lock-outline" />} />
              <TextInput mode="outlined" label="Confirmer" value={passwordForm.confirmPassword} onChangeText={t => setPasswordForm({ ...passwordForm, confirmPassword: t })} secureTextEntry style={styles.input} outlineColor={colors.border} activeOutlineColor={colors.primary} textColor={colors.text} left={<TextInput.Icon icon="lock-check" />} />
              <Button mode="contained" onPress={handlePasswordChange} loading={passwordLoading} buttonColor="#E91E63" style={{ borderRadius: 10, marginTop: 8 }} icon="key">
                Modifier le mot de passe
              </Button>
            </Card.Content>
          </Card>
        )}

        {/* Dark Mode Toggle */}
        <Card style={[styles.formCard, { backgroundColor: colors.surface, marginHorizontal: 16 }]}>
          <Card.Content>
            <List.Item
              title="Thème Sombre"
              left={() => <List.Icon icon="theme-light-dark" color={colors.text} />}
              right={() => <Switch value={isDark} onValueChange={toggleTheme} color={colors.primary} />}
              titleStyle={{ color: colors.text }}
            />
          </Card.Content>
        </Card>

        {/* Logout */}
        <Button
          mode="outlined"
          icon="logout"
          onPress={logout}
          style={[styles.logoutBtn, { marginHorizontal: 16 }]}
          textColor="#E91E63"
        >
          Se déconnecter
        </Button>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20 },
  card: { marginBottom: 12, borderRadius: 16, elevation: 2 },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  userInfo: { marginLeft: 16, flex: 1 },
  roleBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginTop: 4 },
  tabRow: { flexDirection: 'row', marginVertical: 12 },
  formCard: { marginBottom: 12, borderRadius: 16, elevation: 1 },
  input: { marginBottom: 12 },
  logoutBtn: { marginTop: 12, marginBottom: 20, borderColor: '#fce4ec', backgroundColor: '#fce4ec', borderRadius: 10 },
});

export default ProfileScreen;
