// IndexedDB service for advanced local storage
class IndexedDBService {
  constructor() {
    this.dbName = 'MedicalConsultDB'
    this.version = 1
    this.db = null
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'))
      }

      request.onsuccess = (event) => {
        this.db = event.target.result
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result

        // Create object stores
        if (!db.objectStoreNames.contains('consultations')) {
          const consultationStore = db.createObjectStore('consultations', { keyPath: 'id' })
          consultationStore.createIndex('userId', 'userId', { unique: false })
          consultationStore.createIndex('status', 'status', { unique: false })
          consultationStore.createIndex('date', 'date', { unique: false })
        }

        if (!db.objectStoreNames.contains('messages')) {
          const messageStore = db.createObjectStore('messages', { keyPath: 'id' })
          messageStore.createIndex('conversationId', 'conversationId', { unique: false })
          messageStore.createIndex('timestamp', 'timestamp', { unique: false })
        }

        if (!db.objectStoreNames.contains('articles')) {
          const articleStore = db.createObjectStore('articles', { keyPath: 'id' })
          articleStore.createIndex('category', 'category', { unique: false })
          articleStore.createIndex('bookmarked', 'bookmarked', { unique: false })
        }

        if (!db.objectStoreNames.contains('notifications')) {
          const notificationStore = db.createObjectStore('notifications', { keyPath: 'id' })
          notificationStore.createIndex('read', 'read', { unique: false })
          notificationStore.createIndex('timestamp', 'timestamp', { unique: false })
        }

        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache', { keyPath: 'key' })
        }
      }
    })
  }

  async ensureDB() {
    if (!this.db) {
      await this.init()
    }
    return this.db
  }

  // Generic CRUD operations
  async add(storeName, data) {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.add(data)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async get(storeName, key) {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.get(key)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async getAll(storeName) {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async update(storeName, data) {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.put(data)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async delete(storeName, key) {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.delete(key)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async clear(storeName) {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.clear()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Specific methods for consultations
  async saveConsultation(consultation) {
    return this.add('consultations', {
      ...consultation,
      timestamp: Date.now()
    })
  }

  async getConsultationsByUser(userId) {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['consultations'], 'readonly')
      const store = transaction.objectStore(storeName)
      const index = store.index('userId')
      const request = index.getAll(userId)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Specific methods for messages
  async saveMessage(message) {
    return this.add('messages', {
      ...message,
      timestamp: Date.now()
    })
  }

  async getMessagesByConversation(conversationId) {
    const db = await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['messages'], 'readonly')
      const store = transaction.objectStore('messages')
      const index = store.index('conversationId')
      const request = index.getAll(conversationId)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Cache methods
  async setCache(key, data, ttl = 3600000) { // Default TTL: 1 hour
    return this.update('cache', {
      key,
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  async getCache(key) {
    const cached = await this.get('cache', key)
    if (!cached) return null

    // Check if cache is expired
    if (Date.now() - cached.timestamp > cached.ttl) {
      await this.delete('cache', key)
      return null
    }

    return cached.data
  }

  // Cleanup old data
  async cleanup() {
    try {
      // Clean old cache entries
      const cacheEntries = await this.getAll('cache')
      const now = Date.now()
      
      for (const entry of cacheEntries) {
        if (now - entry.timestamp > entry.ttl) {
          await this.delete('cache', entry.key)
        }
      }

      // Clean old notifications (older than 30 days)
      const notifications = await this.getAll('notifications')
      const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000)
      
      for (const notification of notifications) {
        if (notification.timestamp < thirtyDaysAgo) {
          await this.delete('notifications', notification.id)
        }
      }

      console.log('IndexedDB cleanup completed')
    } catch (error) {
      console.error('IndexedDB cleanup failed:', error)
    }
  }

  // Export data for backup
  async exportData() {
    const data = {}
    const storeNames = ['consultations', 'messages', 'articles', 'notifications']
    
    for (const storeName of storeNames) {
      data[storeName] = await this.getAll(storeName)
    }
    
    return data
  }

  // Import data from backup
  async importData(data) {
    for (const [storeName, items] of Object.entries(data)) {
      await this.clear(storeName)
      for (const item of items) {
        await this.add(storeName, item)
      }
    }
  }

  // Get storage usage
  async getStorageUsage() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      return await navigator.storage.estimate()
    }
    return null
  }
}

export const indexedDBService = new IndexedDBService()
