import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, Card, Title, Paragraph } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const LoginScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    
    setLoading(true);
    try {
      await login({ username: email, password });
    } catch (e) {
      Alert.alert('Erreur de connexion', e.response?.data?.detail || 'Identifiants invalides');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.logoLogo}>
          <Text style={styles.logoText}>SF</Text>
        </View>
        <Title style={[styles.title, { color: colors.text }]}>Bon retour</Title>
        <Paragraph style={[styles.subtitle, { color: colors.textSecondary }]}>Connectez-vous pour continuer</Paragraph>
      </View>

      <Card style={[styles.form, { backgroundColor: colors.surface }]}>
        <Card.Content>
          <TextInput
            mode="outlined"
            label="Adresse Email"
            style={[styles.input, { backgroundColor: colors.background }]}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            textColor={colors.text}
            placeholderTextColor={colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            left={<TextInput.Icon icon="email-outline" />}
          />

          <TextInput
            mode="outlined"
            label="Mot de passe"
            style={[styles.input, { backgroundColor: colors.background, marginTop: 16 }]}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            textColor={colors.text}
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            left={<TextInput.Icon icon="lock-outline" />}
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={{ color: colors.primary, fontWeight: '600' }}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogin} disabled={loading} style={{ marginTop: 10 }}>
            <LinearGradient
              colors={colors.gradient}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.loginBtn}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginTxt}>Se Connecter</Text>}
            </LinearGradient>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Landing')}>
        <Text style={[styles.linkText, { color: colors.textSecondary }]}>← Retour à l'accueil</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
    alignItems: 'center',
  },
  logoLogo: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    borderRadius: 16,
    elevation: 3,
  },
  input: {
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 30,
    marginTop: 8,
  },
  loginBtn: {
    width: '100%',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  loginTxt: {
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

export default LoginScreen;
