import { supabase } from '../lib/supabase';

const API_BASE = import.meta.env.VITE_API_URL || '';

class ApiClient {
  async getAuthHeaders(): Promise<Record<string, string>> {
    if (!supabase) return { 'Content-Type': 'application/json', Authorization: 'Bearer dev-token' };
    const { data: { session } } = await supabase.auth.getSession();
    return {
      'Content-Type': 'application/json',
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${API_BASE}/api${endpoint}`;
    const headers = await this.getAuthHeaders();
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'API Error');
    }
    if (response.status === 204) return null;
    return response.json();
  }

  // Food entries
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getFoodEntries(limit = 100): Promise<any[]> {
    return this.request(`/food/?limit=${limit}`);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createFoodEntry(data: any): Promise<any> {
    return this.request('/food/', { method: 'POST', body: JSON.stringify(data) });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async deleteFoodEntry(id: string): Promise<any> {
    return this.request(`/food/${id}`, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
