// Export all models
export * from './models'

// Export all API modules
export * from './services'

// Export config and client
export { httpClient } from './client'
export { API_BASE_URL } from './config'

// Import all service modules
import { searchService } from './services/search'

// Aggregate all API services
export const api = {
  search: searchService,
}
