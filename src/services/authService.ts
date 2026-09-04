import type { Unsubscribe } from 'firebase/auth';

import type { User } from '../types/user';

const MOCK_USERNAME = 'aluno';
const MOCK_PASSWORD = 'aluno';

const mockUser: User = {
  id: 'mock-aluno',
  email: 'aluno',
  role: 'STUDENT',
  active: true,
};

// V2: substituir este adaptador pela integração Firebase e pelas validações
// de API Key, credenciais e tokens definidas para a versão de segurança.
let currentUser: User | null = null;

export const authService = {
  async login(email: string, password: string): Promise<User> {
    if (email.trim().toLowerCase() !== MOCK_USERNAME || password !== MOCK_PASSWORD) {
      throw new Error('Use o usuário e senha de teste: aluno / aluno.');
    }

    currentUser = mockUser;
    return mockUser;
  },

  async logout(): Promise<void> {
    currentUser = null;
  },

  subscribe(listener: (user: User | null) => void): Unsubscribe {
    listener(currentUser);
    return () => undefined;
  },
};
