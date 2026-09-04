import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User as FirebaseUser,
  type Unsubscribe,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import { auth } from '../firebase/auth';
import { db } from '../firebase/firestore';
import type { User, UserRole } from '../types/user';

function normalizeRole(role: unknown): UserRole | null {
  if (role === 'ADMIN' || role === 'admin') return 'ADMIN';
  if (role === 'STUDENT' || role === 'student') return 'STUDENT';
  return null;
}

async function getProfile(firebaseUser: FirebaseUser): Promise<User | null> {
  const snapshot = await getDoc(doc(db, 'users', firebaseUser.uid));
  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  const role = normalizeRole(data.role);
  if (!role || data.active !== true) return null;

  return {
    id: firebaseUser.uid,
    email: firebaseUser.email ?? '',
    role,
    active: true,
  };
}

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const credential = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password,
    );
    const profile = await getProfile(credential.user);

    if (!profile) {
      await signOut(auth);
      throw new Error('Usuário sem perfil ativo no Campus Route.');
    }

    return profile;
  },

  logout(): Promise<void> {
    return signOut(auth);
  },

  getCurrentProfile(firebaseUser: FirebaseUser | null): Promise<User | null> {
    return firebaseUser ? getProfile(firebaseUser) : Promise.resolve(null);
  },

  subscribe(listener: (user: User | null) => void): Unsubscribe {
    return onAuthStateChanged(auth, (firebaseUser) => {
      void this.getCurrentProfile(firebaseUser).then(listener);
    });
  },
};
