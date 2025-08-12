/**
 * API configuration file
 * Centralized management of all API-related configuration
 */

// API base URL configuration
export const API_BASE_URL = 'http://wisagent-api.dev.atominnolab.com'

// Alternative API URL (for development testing)
// export const API_BASE_URL = 'http://47.117.144.224:3000';

// API version prefix
export const HTTP_PREFIX = '/v1/api'
export const SSE_PREFIX = '/v1'

// Paths that don't require authentication
export const NO_AUTH_PATHS = ['/v1/api/user/auth/login', '/v1/api/user/new']
