import type { Unsubscribe } from 'firebase/auth';

import type { User } from '../types/user';

const mockStudent: User = {
  id: 'mock-aluno',
  email: 'aluno',
  role: 'STUDENT',
  active: true,
};

const mockAdmin: User = {
  id: 'mock-admin',
  email: 'admin',
  role: 'ADMIN',
  active: true,
};

// V2: substituir este adaptador pela integração Firebase e pelas validações
// de API Key, credenciais e tokens definidas para a versão de segurança.
let currentUser: User | null = null;

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const username = email.trim().toLowerCase();
    if (password !== username || !['aluno', 'admin'].includes(username)) {
      throw new Error('Use aluno/aluno ou admin/admin para entrar.');
    }

    currentUser = username === 'admin' ? mockAdmin : mockStudent;
    return currentUser;
  },

  async logout(): Promise<void> {
    currentUser = null;
  },

  subscribe(listener: (user: User | null) => void): Unsubscribe {
    listener(currentUser);
    return () => undefined;
  },
};
