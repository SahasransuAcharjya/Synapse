/**
 * Simple API client for the frontend.
 * Currenly mocked for demonstration and development.
 */

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ApiClient {
  constructor() {
    // Uses NEXT_PUBLIC_API_URL or defaults to localhost
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }

  async request(endpoint, options = {}) {
    console.log(`[API] ${options.method || 'GET'} ${endpoint}`);
    
    // Simulate network latency
    await delay(600 + Math.random() * 400);

    // Mock responses based on the endpoint route
    if (endpoint.includes('/chat/send')) {
      return { reply: "I am a simulated AI response. How can I assist you with your mental well-being today?" };
    }

    if (endpoint.includes('/auth/login')) {
      return { token: 'mock-jwt-token-12345', user: { id: '1', name: 'User' } };
    }
    
    // Default mock response
    return { success: true };
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) });
  }

  async put(endpoint, body) {
    return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
export default api;
