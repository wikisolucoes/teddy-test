export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    VALIDATE: '/auth/me',
  },
  
  // Clients
  CLIENTS: {
    BASE: '/clients',
    BY_ID: (id: string) => `/clients/${id}`,
  },
  
  // Dashboard
  DASHBOARD: {
    STATS: '/dashboard/stats',
    LATEST: '/dashboard/latest',
    CHART: '/dashboard/chart',
  },
} as const;

