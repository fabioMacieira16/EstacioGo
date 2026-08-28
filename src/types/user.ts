export type UserRole = 'student' | 'admin';

export type User = {
  id: string;
  email: string;
  role: UserRole;
  active: boolean;
};
