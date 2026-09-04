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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}
    >
      <View style={styles.backgroundGlow} />
      <View style={styles.backgroundGlowSecondary} />
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>CAMPUS ROUTE</Text>
          <Text style={styles.title}>Entre para encontrar seu caminho.</Text>
          <Text style={styles.subtitle}>
            Acesse o fluxo de teste para consultar salas e rotas.
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
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#F8FAFC',
    flex: 1,
    position: 'relative',
  },
  backgroundGlow: {
    backgroundColor: '#DFF7F4',
    borderRadius: 180,
    height: 360,
    position: 'absolute',
    right: -90,
    top: -80,
    width: 360,
  },
  backgroundGlowSecondary: {
    backgroundColor: '#E0E7FF',
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
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 24,
    borderWidth: 1,
    elevation: 6,
    gap: 18,
    padding: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
  },
  eyebrow: {
    color: '#0F766E',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.6,
  },
  title: {
    color: '#0F172A',
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 38,
  },
  subtitle: {
    color: '#475569',
    fontSize: 16,
    lineHeight: 23,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
    borderRadius: 12,
    borderWidth: 1,
    color: '#0F172A',
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  error: {
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '600',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#0F766E',
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
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
