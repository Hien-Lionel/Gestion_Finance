import React from 'react';
import { Dimensions, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const LandingScreen = ({ navigation }) => {
  const { colors, toggleTheme, isDark } = useTheme();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.background, isDark ? '#151538' : '#e9ecef']}
        style={styles.background}
      />
      
      <View style={styles.content}>
        {/* Bouton de bascule du thème en haut à droite */}
        <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
          <Text style={{ fontSize: 24 }}>{isDark ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            <Text style={{ color: colors.primary }}>Faso</Text> Finance
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Gérez la trésorerie de votre entreprise avec une simplicité déconcertante. 
            Pensé pour les PME et startups africaines.
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <View style={[styles.featureBox, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]}>
            <Text style={styles.featureIcon}>📊</Text>
            <Text style={[styles.featureTitle, { color: colors.text }]}>Vue 360°</Text>
            <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>Revenus et dépenses centralisés</Text>
          </View>
          <View style={[styles.featureBox, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]}>
            <Text style={styles.featureIcon}>🛡️</Text>
            <Text style={[styles.featureTitle, { color: colors.text }]}>Sécurisé</Text>
            <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>Données protégées et rôles</Text>
          </View>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <LinearGradient
              colors={[colors.primary, '#E91E63']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Se Connecter</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.secondaryButton, { backgroundColor: colors.secondaryButton, borderColor: colors.border }]}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={[styles.secondaryButtonText, { color: colors.secondaryButtonText }]}>Créer un Compte</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  themeToggle: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-around',
  },
  headerContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#1a1a40',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#636e72',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  featureBox: {
    backgroundColor: '#fff',
    width: (width - 64) / 2,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 3,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: 6,
  },
  featureDesc: {
    fontSize: 12,
    color: '#636e72',
    textAlign: 'center',
  },
  actionContainer: {
    marginBottom: 20,
  },
  primaryButton: {
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dfe6e9',
  },
  secondaryButtonText: {
    color: '#2d3436',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default LandingScreen;
