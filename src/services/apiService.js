// API service for handling HTTP requests
import { localStorageService } from './localStorageService'
import { indexedDBService } from './indexedDBService'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  // Get authorization header
  getAuthHeader() {
    const token = localStorageService.getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        ...this.defaultHeaders,
        ...this.getAuthHeader(),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      // Handle different response types
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      }
      
      return await response.text()
    } catch (error) {
      // Handle network errors
      if (!navigator.onLine) {
        throw new Error('لا يوجد اتصال بالإنترنت')
      }
      
      console.error('API request failed:', error)
      throw error
    }
  }

  // HTTP methods
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `${endpoint}?${queryString}` : endpoint
    return this.request(url, { method: 'GET' })
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  }

  // File upload
  async uploadFile(endpoint, file, additionalData = {}) {
    const formData = new FormData()
    formData.append('file', file)
    
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key])
    })

    return this.request(endpoint, {
      method: 'POST',
      headers: {
        ...this.getAuthHeader(),
        // Don't set Content-Type for FormData, let browser set it
      },
      body: formData,
    })
  }

  // Consultation endpoints
  async getConsultations(params = {}) {
    try {
      const data = await this.get('/consultations', params)
      // Cache the data locally
      await indexedDBService.setCache('consultations', data, 300000) // 5 minutes
      return data
    } catch (error) {
      // Try to get from cache if API fails
      const cached = await indexedDBService.getCache('consultations')
      if (cached) {
        console.warn('Using cached consultations data due to API error')
        return cached
      }
      throw error
    }
  }

  async getConsultation(id) {
    return this.get(`/consultations/${id}`)
  }

  async createConsultation(data) {
    const result = await this.post('/consultations', data)
    // Save to local storage for offline access
    await indexedDBService.saveConsultation(result)
    return result
  }

  async updateConsultation(id, data) {
    const result = await this.put(`/consultations/${id}`, data)
    await indexedDBService.update('consultations', result)
    return result
  }

  async deleteConsultation(id) {
    const result = await this.delete(`/consultations/${id}`)
    await indexedDBService.delete('consultations', id)
    return result
  }

  // Message endpoints
  async getMessages(conversationId) {
    try {
      const data = await this.get(`/messages/${conversationId}`)
      // Cache messages locally
      for (const message of data) {
        await indexedDBService.saveMessage(message)
      }
      return data
    } catch (error) {
      // Try to get from local storage
      const cached = await indexedDBService.getMessagesByConversation(conversationId)
      if (cached && cached.length > 0) {
        console.warn('Using cached messages due to API error')
        return cached
      }
      throw error
    }
  }

  async sendMessage(data) {
    const result = await this.post('/messages', data)
    await indexedDBService.saveMessage(result)
    return result
  }

  // User endpoints
  async getProfile() {
    return this.get('/users/profile')
  }

  async updateProfile(data) {
    return this.put('/users/profile', data)
  }

  async uploadAvatar(file) {
    return this.uploadFile('/users/avatar', file)
  }

  // Library endpoints
  async getArticles(params = {}) {
    try {
      const data = await this.get('/library/articles', params)
      // Cache articles locally
      await indexedDBService.setCache('articles', data, 3600000) // 1 hour
      return data
    } catch (error) {
      const cached = await indexedDBService.getCache('articles')
      if (cached) {
        console.warn('Using cached articles due to API error')
        return cached
      }
      throw error
    }
  }

  async getArticle(id) {
    return this.get(`/library/articles/${id}`)
  }

  async bookmarkArticle(id) {
    return this.post(`/library/articles/${id}/bookmark`)
  }

  async unbookmarkArticle(id) {
    return this.delete(`/library/articles/${id}/bookmark`)
  }

  // Analytics endpoints (for doctors)
  async getAnalytics(params = {}) {
    return this.get('/analytics', params)
  }

  async getConsultationStats(params = {}) {
    return this.get('/analytics/consultations', params)
  }

  async getRevenueStats(params = {}) {
    return this.get('/analytics/revenue', params)
  }

  // Notification endpoints
  async getNotifications() {
    try {
      const data = await this.get('/notifications')
      // Save notifications locally
      for (const notification of data) {
        await indexedDBService.add('notifications', notification)
      }
      return data
    } catch (error) {
      const cached = await indexedDBService.getAll('notifications')
      if (cached && cached.length > 0) {
        console.warn('Using cached notifications due to API error')
        return cached
      }
      throw error
    }
  }

  async markNotificationAsRead(id) {
    const result = await this.patch(`/notifications/${id}`, { read: true })
    await indexedDBService.update('notifications', result)
    return result
  }

  async markAllNotificationsAsRead() {
    return this.patch('/notifications/mark-all-read')
  }

  // Search endpoints
  async searchDoctors(query, filters = {}) {
    return this.get('/search/doctors', { q: query, ...filters })
  }

  async searchArticles(query, filters = {}) {
    return this.get('/search/articles', { q: query, ...filters })
  }

  // Health check
  async healthCheck() {
    try {
      return await this.get('/health')
    } catch (error) {
      return { status: 'error', message: error.message }
    }
  }

  // Offline queue management
  async processOfflineQueue() {
    const queue = localStorageService.getOfflineQueue()
    const results = []

    for (const action of queue) {
      try {
        let result
        switch (action.method) {
          case 'POST':
            result = await this.post(action.endpoint, action.data)
            break
          case 'PUT':
            result = await this.put(action.endpoint, action.data)
            break
          case 'PATCH':
            result = await this.patch(action.endpoint, action.data)
            break
          case 'DELETE':
            result = await this.delete(action.endpoint)
            break
          default:
            continue
        }
        
        results.push({ action, result, success: true })
        localStorageService.removeFromOfflineQueue(action.id)
      } catch (error) {
        results.push({ action, error: error.message, success: false })
      }
    }

    return results
  }

  // Add action to offline queue
  addToOfflineQueue(method, endpoint, data = null) {
    localStorageService.addToOfflineQueue({
      method,
      endpoint,
      data,
      timestamp: Date.now()
    })
  }
}

export const apiService = new ApiService()

// Auto-process offline queue when online
window.addEventListener('online', () => {
  console.log('Connection restored, processing offline queue...')
  apiService.processOfflineQueue()
    .then(results => {
      console.log('Offline queue processed:', results)
    })
    .catch(error => {
      console.error('Failed to process offline queue:', error)
    })
})
