import { createContext, useEffect, useState, type ReactNode } from 'react';

import { authService } from '../services/authService';
import type { User } from '../types/user';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = authService.subscribe((nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const nextUser = await authService.login(email, password);
      setUser(nextUser);
    } catch (loginError) {
      setUser(null);
      setError(
        loginError instanceof Error
          ? loginError.message
          : 'Não foi possível entrar.',
      );
      throw loginError;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setError(null);
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
