/**
 * Routes Constants - Constantes de rotas da aplicação
 * Centraliza todas as rotas em um único lugar
 */

export const ROUTES = {
  // Autenticação
  LOGIN: '/login',
  
  // Dashboard
  DASHBOARD: '/dashboard',
  
  // Clientes
  CLIENTS: '/clients',
  CLIENTS_SELECTED: '/clients/selected',
  
  // Fallback
  ROOT: '/',
  NOT_FOUND: '*',
} as const;

/**
 * Tipos inferidos das rotas
 */
export type RouteKey = keyof typeof ROUTES;
export type RouteValue = typeof ROUTES[RouteKey];
