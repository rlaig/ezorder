import pb, { COLLECTIONS } from './pocketbase';
import type { User, LoginCredentials, RegisterData } from '../types';

export class AuthService {
  /**
   * Login user with email and password
   */
  static async login(credentials: LoginCredentials): Promise<User> {
    try {
      const authData = await pb.collection(COLLECTIONS.USERS).authWithPassword(
        credentials.email,
        credentials.password
      );
      
      return {
        id: authData.record.id,
        email: authData.record.email,
        name: authData.record.name,
        role: authData.record.role,
        avatar: authData.record.avatar,
        created: authData.record.created,
        updated: authData.record.updated,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid credentials');
    }
  }

  /**
   * Register new user
   */
  static async register(data: RegisterData): Promise<User> {
    try {
      const record = await pb.collection(COLLECTIONS.USERS).create(data);
      
      return {
        id: record.id,
        email: record.email,
        name: record.name,
        role: record.role,
        avatar: record.avatar,
        created: record.created,
        updated: record.updated,
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration failed');
    }
  }

  /**
   * Logout current user
   */
  static async logout(): Promise<void> {
    pb.authStore.clear();
  }

  /**
   * Get current authenticated user
   */
  static getCurrentUser(): User | null {
    if (!pb.authStore.isValid) return null;
    
    const record = pb.authStore.record;
    if (!record) return null;

    return {
      id: record.id,
      email: record.email,
      name: record.name,
      role: record.role,
      avatar: record.avatar,
      created: record.created,
      updated: record.updated,
    };
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return pb.authStore.isValid;
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(email: string): Promise<void> {
    try {
      await pb.collection(COLLECTIONS.USERS).requestPasswordReset(email);
    } catch (error) {
      console.error('Password reset request error:', error);
      throw new Error('Failed to request password reset');
    }
  }

  /**
   * Refresh authentication token
   */
  static async refreshAuth(): Promise<User | null> {
    try {
      if (!pb.authStore.isValid) return null;
      
      const authData = await pb.collection(COLLECTIONS.USERS).authRefresh();
      
      return {
        id: authData.record.id,
        email: authData.record.email,
        name: authData.record.name,
        role: authData.record.role,
        avatar: authData.record.avatar,
        created: authData.record.created,
        updated: authData.record.updated,
      };
    } catch (error) {
      console.error('Auth refresh error:', error);
      pb.authStore.clear();
      return null;
    }
  }
}
