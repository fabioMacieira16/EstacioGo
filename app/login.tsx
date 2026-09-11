import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { navigationTheme } from '../src/constants/navigationTheme';
import { useAuth } from '../src/hooks/useAuth';

export default function LoginScreen() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('aluno');
  const [password, setPassword] = useState('aluno');
  const [formError, setFormError] = useState<string | null>(null);

  const submit = async () => {
    if (!email.trim() || !password) {
      setFormError('Informe e-mail e senha.');
      return;
    }
    setFormError(null);
    try {
      await login(email, password);
    } catch {
      // A mensagem de autenticação é exposta pelo contexto.
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoider}
      >
        <View style={styles.backgroundGlow} />
        <View style={styles.backgroundGlowSecondary} />
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.brandPin}>📍</Text>
            <Text style={styles.eyebrow}>
              Campus <Text style={styles.eyebrowAccent}>Route</Text>
            </Text>
            <Text style={styles.title}>Entre para encontrar seu caminho.</Text>
            <Text style={styles.subtitle}>
              Acesse o fluxo de teste para consultar salas e rotas.
            </Text>
            <Text style={styles.testCredentials}>
              Teste: aluno/aluno ou admin/admin.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Usuário</Text>
              <TextInput
                autoCapitalize="none"
                autoComplete="username"
                onChangeText={setEmail}
                placeholder="Usuário"
                placeholderTextColor="#94A3B8"
                style={styles.input}
                value={email}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Senha</Text>
              <TextInput
                autoCapitalize="none"
                autoComplete="password"
                onChangeText={setPassword}
                placeholder="Senha"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                style={styles.input}
                value={password}
              />
            </View>

            {formError || error ? (
              <Text style={styles.error}>{formError ?? error}</Text>
            ) : null}

            <Pressable
              accessibilityRole="button"
              disabled={loading}
              onPress={() => void submit()}
              style={({ pressed }) => [
                styles.primaryButton,
                loading && styles.primaryButtonDisabled,
                pressed && styles.primaryButtonPressed,
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>Entrar</Text>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: navigationTheme.sidebarBackground,
    flex: 1,
    position: 'relative',
  },
  keyboardAvoider: {
    flex: 1,
  },
  backgroundGlow: {
    backgroundColor: navigationTheme.accentSoft,
    borderRadius: 180,
    height: 360,
    position: 'absolute',
    right: -90,
    top: -80,
    width: 360,
  },
  backgroundGlowSecondary: {
    backgroundColor: navigationTheme.accentSoft,
    borderRadius: 180,
    bottom: -90,
    height: 260,
    left: -70,
    position: 'absolute',
    width: 260,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    zIndex: 1,
  },
  card: {
    backgroundColor: navigationTheme.panelBackground,
    borderColor: navigationTheme.panelBorder,
    borderRadius: 24,
    borderWidth: 1,
    elevation: 6,
    gap: 18,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
  },
  brandPin: { fontSize: 26 },
  eyebrow: {
    color: navigationTheme.textPrimary,
    fontSize: 20,
    fontWeight: '800',
  },
  eyebrowAccent: { color: navigationTheme.accent },
  title: {
    color: navigationTheme.textPrimary,
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 34,
  },
  subtitle: {
    color: navigationTheme.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  testCredentials: {
    color: navigationTheme.accent,
    fontSize: 13,
    fontWeight: '700',
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    color: navigationTheme.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: navigationTheme.panelBorder,
    borderRadius: 12,
    borderWidth: 1,
    color: '#0F172A',
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  error: {
    color: '#F87171',
    fontSize: 13,
    fontWeight: '600',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: navigationTheme.accent,
    borderRadius: 12,
    paddingVertical: 14,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonPressed: {
    opacity: 0.9,
  },
  primaryButtonText: {
    color: navigationTheme.textOnAccent,
    fontSize: 16,
    fontWeight: '700',
  },
});
