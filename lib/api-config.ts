/**
 * API Configuration for connecting Next.js frontend to Spring Boot backend
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  VERIFY_EMAIL: '/auth/verify-email',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  
  // Accounts
  ACCOUNTS: '/accounts',
  ACCOUNT_BY_ID: (id: string) => `/accounts/${id}`,
  
  // Investments
  INVESTMENTS: '/investments',
  INVESTMENT_BY_ID: (id: string) => `/investments/${id}`,
  
  // Health
  HEALTH: '/health',
  HEALTH_DB: '/health/db',
  
  // Profile
  PROFILE: '/profile',
  PROFILE_AVATAR: '/profile/avatar',
  
  // Settings
  SETTINGS: '/settings',
  
  // Security
  SECURITY_2FA: '/security/2fa',
  SECURITY_PASSWORD: '/security/password',
};

/**
 * Make an authenticated API request
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API request failed: ${response.statusText}`);
  }
  
  return response.json();
}
