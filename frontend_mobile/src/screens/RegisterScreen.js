import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import axiosClient from '../api/axiosClient';
import { useTheme } from '../context/ThemeContext';

const RegisterScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
    telephone: '',
    roleCode: '',
    enterpriseCode: '',
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!formData.username || !formData.email || !formData.password) {
      Alert.alert('Erreur', 'Veuillez remplir (Utilisateur, Email, Mot de passe).');
      return;
    }
    if (formData.role !== 'user' && !formData.roleCode) {
      Alert.alert('Erreur', 'Code secret requis pour le rôle Administrateur ou Manager.');
      return;
    }
    if (formData.role !== 'admin' && !formData.enterpriseCode) {
      Alert.alert('Erreur', 'Code Entreprise requis pour rejoindre une entreprise existante.');
      return;
    }

    setLoading(true);
    try {
      await axiosClient.post('auth/register/', formData);
      Alert.alert(
        'Succès',
        'Compte créé avec succès ! Connectez-vous.',
        [{ text: 'Se connecter', onPress: () => navigation.navigate('Login') }]
      );
    } catch (e) {
      console.log('Reg Error:', e.response?.data);
      const errorMsg = e.response?.data?.detail || 
                       e.response?.data?.username?.[0] || 
                       e.response?.data?.email?.[0] || 
                       e.response?.data?.roleCode?.[0] ||
                       'Échec de l\'inscription';
      Alert.alert('Erreur', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>Inscription</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Créez votre compte Admin et votre Espace Entreprise en quelques secondes.</Text>

          <View style={[styles.form, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]}>
            
            <Text style={[styles.label, { color: colors.text }]}>Sélectionnez votre rôle</Text>
            <View style={styles.roleContainer}>
              {['user', 'manager', 'admin'].map((r) => (
                <TouchableOpacity 
                  key={r}
                  style={[
                    styles.roleBox, 
                    { borderColor: formData.role === r ? colors.primary : colors.border },
                    formData.role === r && { backgroundColor: colors.primary + '11' }
                  ]}
                  onPress={() => setFormData({ ...formData, role: r })}
                >
                  <Text style={{ fontSize: 20 }}>{r === 'admin' ? '🛡️' : r === 'manager' ? '👔' : '👤'}</Text>
                  <Text style={[styles.roleText, { color: formData.role === r ? colors.primary : colors.textSecondary }]}>
                    {r === 'admin' ? 'Admin' : r === 'manager' ? 'Manager' : 'Employé'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { color: colors.text }]}>Nom d'utilisateur *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
              placeholder="jeandupont"
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="none"
              value={formData.username}
              onChangeText={(text) => setFormData({ ...formData, username: text })}
            />

            <Text style={[styles.label, { color: colors.text }]}>Adresse Email *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
              placeholder="jean@entreprise.com"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
            />

            <Text style={[styles.label, { color: colors.text }]}>Mot de passe *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
              placeholder="••••••••"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
            />

            {formData.role !== 'user' && (
              <>
                <Text style={[styles.label, { color: colors.text }]}>Code Secret ({formData.role}) *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  placeholder={`Code fourni pour les ${formData.role}s`}
                  placeholderTextColor={colors.textSecondary}
                  value={formData.roleCode}
                  onChangeText={(text) => setFormData({ ...formData, roleCode: text })}
                />
              </>
            )}

            {formData.role !== 'admin' && (
              <>
                <Text style={[styles.label, { color: colors.text }]}>Code Entreprise *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  placeholder="Ex: ENT-1234ABD"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.enterpriseCode}
                  onChangeText={(text) => setFormData({ ...formData, enterpriseCode: text })}
                />
              </>
            )}

            <TouchableOpacity onPress={handleRegister} disabled={loading}>
              <LinearGradient
                colors={[colors.primary, '#E91E63']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.button}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Créer mon entreprise</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.linkText, { color: colors.textSecondary }]}>Déjà un compte ? <Text style={{ color: '#E91E63', fontWeight: 'bold' }}>Se Connecter</Text></Text>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  scroll: {
    flexGrow: 1,
  },
  content: {
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#1a1a40',
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#636e72',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 8,
  },
  form: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleBox: {
    padding: 10,
    borderWidth: 1.5,
    borderRadius: 12,
    alignItems: 'center',
    width: '31%',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
    color: '#2d3436',
  },
  button: {
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 15,
    color: '#636e72',
  }
});

export default RegisterScreen;
