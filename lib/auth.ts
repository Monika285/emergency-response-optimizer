import crypto from 'crypto';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'paramedic' | 'hospital_admin' | 'coordinator';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
}

// Hash password using a simple approach (for demo purposes)
export function hashPassword(password: string): string {
  return crypto
    .createHash('sha256')
    .update(password + 'salt')
    .digest('hex');
}

// Verify password
export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Get users from localStorage
export function getStoredUsers(): Record<string, User & { passwordHash: string }> {
  if (typeof window === 'undefined') return {};
  const stored = localStorage.getItem('golden10_users');
  return stored ? JSON.parse(stored) : {};
}

// Store user in localStorage
export function storeUser(
  user: User,
  passwordHash: string
): void {
  if (typeof window === 'undefined') return;
  const users = getStoredUsers();
  users[user.email] = { ...user, passwordHash };
  localStorage.setItem('golden10_users', JSON.stringify(users));
}

// Get current user from localStorage
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('golden10_currentUser');
  return stored ? JSON.parse(stored) : null;
}

// Set current user in localStorage
export function setCurrentUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem('golden10_currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('golden10_currentUser');
  }
}

// Sign up new user
export function signUp(
  email: string,
  password: string,
  name: string,
  role: 'paramedic' | 'hospital_admin' | 'coordinator'
): { success: boolean; user?: User; error?: string } {
  const users = getStoredUsers();

  if (users[email]) {
    return { success: false, error: 'Email already exists' };
  }

  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' };
  }

  const user: User = {
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
    email,
    name,
    role,
    createdAt: new Date().toISOString(),
  };

  storeUser(user, hashPassword(password));
  return { success: true, user };
}

// Sign in user
export function signIn(
  email: string,
  password: string
): { success: boolean; user?: User; error?: string } {
  const users = getStoredUsers();
  const user = users[email];

  if (!user) {
    return { success: false, error: 'Email or password is incorrect' };
  }

  if (!verifyPassword(password, user.passwordHash)) {
    return { success: false, error: 'Email or password is incorrect' };
  }

  const { passwordHash, ...userWithoutPassword } = user;
  setCurrentUser(userWithoutPassword);
  return { success: true, user: userWithoutPassword };
}

// Sign out user
export function signOut(): void {
  setCurrentUser(null);
}
