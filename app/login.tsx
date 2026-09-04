import { useState } from 'react';
import {
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAuth } from '../src/hooks/useAuth';

export default function LoginScreen() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      <View style={styles.container}>
        <Text style={styles.eyebrow}>CAMPUS ROUTE</Text>
        <Text style={styles.title}>Entre para encontrar seu caminho.</Text>
        <Text style={styles.subtitle}>
          Use sua conta institucional para consultar salas e rotas.
        </Text>
        <TextInput
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="E-mail institucional"
          style={styles.input}
          value={email}
        />
        <TextInput
          autoCapitalize="none"
          autoComplete="password"
          onChangeText={setPassword}
          placeholder="Senha"
          secureTextEntry
          style={styles.input}
          value={password}
        />
        {formError || error ? (
          <Text style={styles.error}>{formError ?? error}</Text>
        ) : null}
        <Button
          disabled={loading}
          onPress={() => void submit()}
          title="Entrar"
        />
        {loading ? <ActivityIndicator style={styles.loading} /> : null}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#F8FAFC', flex: 1 },
  container: { flex: 1, gap: 14, justifyContent: 'center', padding: 24 },
  eyebrow: { color: '#0F766E', fontSize: 12, fontWeight: '800' },
  title: { color: '#0F172A', fontSize: 30, fontWeight: '800' },
  subtitle: { color: '#475569', fontSize: 16, lineHeight: 23, marginBottom: 12 },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: 6,
    borderWidth: 1,
    padding: 14,
  },
  error: { color: '#B91C1C' },
  loading: { marginTop: 4 },
});
