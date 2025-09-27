import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Mock database functions for development
const mockUsers = new Map();
const mockSignals = new Map();
const mockAlerts = new Map();
const mockOHLCV = new Map();

export class Database {
  // User operations
  static async createUser(email: string, passwordHash: string) {
    const id = `user_${Date.now()}`;
    const user = {
      id,
      email,
      passwordHash,
      subscriptionStatus: 'free',
      subscriptionExpiry: null,
      createdAt: new Date(),
    };
    mockUsers.set(id, user);
    return user;
  }

  static async findUserByEmail(email: string) {
    for (const [id, user] of mockUsers.entries()) {
      if (user.email === email) {
        return { id, ...user };
      }
    }
    return null;
  }

  static async findUserById(id: string) {
    return mockUsers.get(id) || null;
  }

  static async updateUserSubscription(userId: string, status: string, expiry?: Date) {
    const user = mockUsers.get(userId);
    if (user) {
      user.subscriptionStatus = status;
      user.subscriptionExpiry = expiry;
      mockUsers.set(userId, user);
      return user;
    }
    return null;
  }

  // Signal operations
  static async createSignal(signal: any) {
    const id = `signal_${Date.now()}_${Math.random()}`;
    const newSignal = {
      id,
      ...signal,
      createdAt: new Date(),
    };
    mockSignals.set(id, newSignal);
    return newSignal;
  }

  static async getSignals(symbol: string, timeframe: string, limit: number = 100) {
    const signals = Array.from(mockSignals.values())
      .filter(s => s.symbol === symbol && s.timeframe === timeframe)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
    return signals;
  }

  // Alert operations
  static async createAlert(alert: any) {
    const id = `alert_${Date.now()}`;
    const newAlert = {
      id,
      ...alert,
      createdAt: new Date(),
    };
    mockAlerts.set(id, newAlert);
    return newAlert;
  }

  static async getUserAlerts(userId: string) {
    return Array.from(mockAlerts.values())
      .filter(a => a.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  static async deleteAlert(id: string, userId: string) {
    const alert = mockAlerts.get(id);
    if (alert && alert.userId === userId) {
      mockAlerts.delete(id);
      return true;
    }
    return false;
  }

  // OHLCV operations
  static async saveOHLCV(symbol: string, timeframe: string, data: any[]) {
    const key = `${symbol}_${timeframe}`;
    mockOHLCV.set(key, data);
    return data.length;
  }

  static async getOHLCV(symbol: string, timeframe: string, limit: number = 1000) {
    const key = `${symbol}_${timeframe}`;
    return mockOHLCV.get(key) || [];
  }
}

// Initialize with some sample data
Database.createUser('demo@example.com', '$2a$12$hash_placeholder');