import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, Card, Title, Paragraph } from 'react-native-paper';
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
      // Build clean payload: only send fields relevant to the role
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        telephone: formData.telephone,
      };
      if (formData.role !== 'user') payload.roleCode = formData.roleCode;
      if (formData.role !== 'admin') payload.enterpriseCode = formData.enterpriseCode;

      await axiosClient.post('auth/register/', payload);
      Alert.alert(
        'Succès',
        'Compte créé avec succès ! Connectez-vous.',
        [{ text: 'Se connecter', onPress: () => navigation.navigate('Login') }]
      );
    } catch (e) {
      console.log('Reg Error response:', e.response?.data);
      console.log('Reg Error message:', e.message);
      console.log('Reg Error code:', e.code);
      let errorMsg = 'Échec de l\'inscription';
      if (e.response?.data) {
        errorMsg = e.response.data.detail || 
                   e.response.data.username?.[0] || 
                   e.response.data.email?.[0] || 
                   e.response.data.roleCode?.[0] ||
                   e.response.data.enterpriseCode?.[0] ||
                   JSON.stringify(e.response.data);
      } else if (e.message) {
        errorMsg = e.message.includes('Network') ? 'Impossible de joindre le serveur. Vérifiez votre connexion.' : e.message;
      }
      Alert.alert('Erreur', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Title style={[styles.title, { color: colors.text }]}>Créer un compte</Title>
          <Paragraph style={[styles.subtitle, { color: colors.textSecondary }]}>Rejoignez Faso Finance</Paragraph>
        </View>

        <Card style={[styles.form, { backgroundColor: colors.surface }]}>
          <Card.Content>
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

            <TextInput
              mode="outlined"
              label="Nom d'utilisateur *"
              style={[styles.input, { backgroundColor: colors.background }]}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              textColor={colors.text}
              autoCapitalize="none"
              value={formData.username}
              onChangeText={(text) => setFormData({ ...formData, username: text })}
              left={<TextInput.Icon icon="account" />}
            />

            <TextInput
              mode="outlined"
              label="Adresse Email *"
              style={[styles.input, { backgroundColor: colors.background }]}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              textColor={colors.text}
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              left={<TextInput.Icon icon="email-outline" />}
            />

            <TextInput
              mode="outlined"
              label="Mot de passe *"
              style={[styles.input, { backgroundColor: colors.background }]}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              textColor={colors.text}
              secureTextEntry
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              left={<TextInput.Icon icon="lock-outline" />}
            />

            {formData.role !== 'user' && (
              <TextInput
                mode="outlined"
                label={`Code Secret (${formData.role}) *`}
                style={[styles.input, { backgroundColor: colors.background }]}
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
                textColor={colors.text}
                value={formData.roleCode}
                onChangeText={(text) => setFormData({ ...formData, roleCode: text })}
                left={<TextInput.Icon icon="key-variant" />}
              />
            )}

            {formData.role !== 'admin' && (
              <TextInput
                mode="outlined"
                label="Code Entreprise *"
                style={[styles.input, { backgroundColor: colors.background }]}
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
                textColor={colors.text}
                value={formData.enterpriseCode}
                onChangeText={(text) => setFormData({ ...formData, enterpriseCode: text })}
                left={<TextInput.Icon icon="domain" />}
              />
            )}

            <TouchableOpacity onPress={handleRegister} disabled={loading} style={{ marginTop: 10 }}>
              <LinearGradient
                colors={colors.gradient}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.button}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>S'inscrire</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </Card.Content>
        </Card>

        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Login')}>
          <Text style={[styles.linkText, { color: colors.textSecondary }]}>Déjà un compte ? Se connecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
  },
  form: {
    marginHorizontal: 20,
    borderRadius: 16,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 8,
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
    fontSize: 14,
    marginBottom: 16,
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
