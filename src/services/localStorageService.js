// Local storage service for managing client-side data persistence

const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme_preference',
  LANGUAGE: 'language_preference',
  CONSULTATIONS: 'consultations_cache',
  MESSAGES: 'messages_cache',
  NOTIFICATIONS: 'notifications_cache',
  SETTINGS: 'user_settings',
  OFFLINE_QUEUE: 'offline_queue'
}

class LocalStorageService {
  // Generic methods
  setItem(key, value) {
    try {
      const serializedValue = JSON.stringify(value)
      localStorage.setItem(key, serializedValue)
      return true
    } catch (error) {
      console.error('Error saving to localStorage:', error)
      return false
    }
  }

  getItem(key) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return null
    }
  }

  removeItem(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Error removing from localStorage:', error)
      return false
    }
  }

  clear() {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  }

  // Authentication methods
  setToken(token) {
    return this.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
  }

  getToken() {
    return this.getItem(STORAGE_KEYS.AUTH_TOKEN)
  }

  removeToken() {
    return this.removeItem(STORAGE_KEYS.AUTH_TOKEN)
  }

  setUser(userData) {
    return this.setItem(STORAGE_KEYS.USER_DATA, userData)
  }

  getUser() {
    return this.getItem(STORAGE_KEYS.USER_DATA)
  }

  removeUser() {
    return this.removeItem(STORAGE_KEYS.USER_DATA)
  }

  // Theme methods
  setTheme(theme) {
    return this.setItem(STORAGE_KEYS.THEME, theme)
  }

  getTheme() {
    return this.getItem(STORAGE_KEYS.THEME)
  }

  // Language methods
  setLanguage(language) {
    return this.setItem(STORAGE_KEYS.LANGUAGE, language)
  }

  getLanguage() {
    return this.getItem(STORAGE_KEYS.LANGUAGE)
  }

  // Consultations cache
  setConsultations(consultations) {
    return this.setItem(STORAGE_KEYS.CONSULTATIONS, {
      data: consultations,
      timestamp: Date.now()
    })
  }

  getConsultations() {
    const cached = this.getItem(STORAGE_KEYS.CONSULTATIONS)
    if (!cached) return null
    
    // Check if cache is still valid (24 hours)
    const isValid = Date.now() - cached.timestamp < 24 * 60 * 60 * 1000
    return isValid ? cached.data : null
  }

  // Messages cache
  setMessages(messages) {
    return this.setItem(STORAGE_KEYS.MESSAGES, {
      data: messages,
      timestamp: Date.now()
    })
  }

  getMessages() {
    const cached = this.getItem(STORAGE_KEYS.MESSAGES)
    if (!cached) return null
    
    // Check if cache is still valid (1 hour)
    const isValid = Date.now() - cached.timestamp < 60 * 60 * 1000
    return isValid ? cached.data : null
  }

  // Notifications cache
  setNotifications(notifications) {
    return this.setItem(STORAGE_KEYS.NOTIFICATIONS, notifications)
  }

  getNotifications() {
    return this.getItem(STORAGE_KEYS.NOTIFICATIONS)
  }

  // User settings
  setSettings(settings) {
    return this.setItem(STORAGE_KEYS.SETTINGS, settings)
  }

  getSettings() {
    return this.getItem(STORAGE_KEYS.SETTINGS) || {}
  }

  updateSettings(newSettings) {
    const currentSettings = this.getSettings()
    const updatedSettings = { ...currentSettings, ...newSettings }
    return this.setSettings(updatedSettings)
  }

  // Offline queue for actions to sync when online
  addToOfflineQueue(action) {
    const queue = this.getOfflineQueue()
    queue.push({
      ...action,
      timestamp: Date.now(),
      id: Date.now() + Math.random()
    })
    return this.setItem(STORAGE_KEYS.OFFLINE_QUEUE, queue)
  }

  getOfflineQueue() {
    return this.getItem(STORAGE_KEYS.OFFLINE_QUEUE) || []
  }

  removeFromOfflineQueue(actionId) {
    const queue = this.getOfflineQueue()
    const updatedQueue = queue.filter(action => action.id !== actionId)
    return this.setItem(STORAGE_KEYS.OFFLINE_QUEUE, updatedQueue)
  }

  clearOfflineQueue() {
    return this.removeItem(STORAGE_KEYS.OFFLINE_QUEUE)
  }

  // Utility methods
  getStorageSize() {
    let total = 0
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length
      }
    }
    return total
  }

  isStorageAvailable() {
    try {
      const test = '__storage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch (error) {
      return false
    }
  }

  // Clear all app-related data (useful for logout)
  clearAppData() {
    Object.values(STORAGE_KEYS).forEach(key => {
      this.removeItem(key)
    })
  }
}

export const localStorageService = new LocalStorageService()
