// lib/api.ts
const API_BASE = '/api/proxy';

class API {
  private token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  private async request(endpoint: string, options: RequestInit = {}) {
    console.log('Making request to:', `${API_BASE}${endpoint}`);
    console.log('Request options:', options);
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    if (!response.ok) throw new Error(data.error);
    return data;
  }

  async register(email: string, password: string) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.token = data.token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.token);
    }
    return data;
  }

  async login(email: string, password: string) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.token = data.token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.token);
    }
    return data;
  }

  async chat(message: string, conversationId?: string) {
    return this.request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, conversationId }),
    });
  }

  logout() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  isAuthenticated() {
    return !!this.token;
  }
}

const api = new API();
export { api };