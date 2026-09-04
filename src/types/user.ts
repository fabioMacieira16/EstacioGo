export type UserRole = 'STUDENT' | 'ADMIN';

export type User = {
  id: string;
  email: string;
  role: UserRole;
  active: boolean;
};
