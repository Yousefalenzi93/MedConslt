// Mock authentication service
// In a real application, this would connect to your backend API

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Mock users database (in real app, this would be in your backend)
const mockUsers = [
  {
    id: 1,
    email: 'doctor@example.com',
    password: 'password123',
    firstName: 'أحمد',
    lastName: 'محمد',
    userType: 'doctor',
    specialty: 'طب عام',
    experience: 10,
    license: 'DOC123456',
    phone: '+966501234567',
    avatar: '/avatars/doctor1.jpg'
  },
  {
    id: 2,
    email: 'patient@example.com',
    password: 'password123',
    firstName: 'فاطمة',
    lastName: 'أحمد',
    userType: 'patient',
    dateOfBirth: '1990-01-01',
    gender: 'female',
    phone: '+966507654321',
    avatar: '/avatars/patient1.jpg'
  }
]

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const authService = {
  async login(credentials) {
    await delay(1000) // Simulate network delay
    
    const { email, password } = credentials
    const user = mockUsers.find(u => u.email === email && u.password === password)
    
    if (!user) {
      throw new Error('Invalid email or password')
    }
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user
    
    // Generate mock JWT token
    const token = `mock-jwt-token-${user.id}-${Date.now()}`
    
    return {
      user: userWithoutPassword,
      token
    }
  },

  async register(userData) {
    await delay(1000) // Simulate network delay
    
    const { email, password, firstName, lastName, userType, ...otherData } = userData
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email)
    if (existingUser) {
      throw new Error('User with this email already exists')
    }
    
    // Create new user
    const newUser = {
      id: mockUsers.length + 1,
      email,
      password,
      firstName,
      lastName,
      userType,
      ...otherData,
      avatar: `/avatars/default-${userType}.jpg`
    }
    
    mockUsers.push(newUser)
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser
    
    // Generate mock JWT token
    const token = `mock-jwt-token-${newUser.id}-${Date.now()}`
    
    return {
      user: userWithoutPassword,
      token
    }
  },

  async logout() {
    await delay(500) // Simulate network delay
    // In a real app, you might invalidate the token on the server
    return { success: true }
  },

  async getCurrentUser() {
    await delay(500) // Simulate network delay
    
    // In a real app, you would validate the token and return user data
    const token = localStorage.getItem('auth_token')
    if (!token) {
      throw new Error('No token found')
    }
    
    // Extract user ID from mock token
    const userId = parseInt(token.split('-')[3])
    const user = mockUsers.find(u => u.id === userId)
    
    if (!user) {
      throw new Error('User not found')
    }
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  },

  async updateProfile(userId, updates) {
    await delay(1000) // Simulate network delay
    
    const userIndex = mockUsers.findIndex(u => u.id === userId)
    if (userIndex === -1) {
      throw new Error('User not found')
    }
    
    // Update user data
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates }
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = mockUsers[userIndex]
    return userWithoutPassword
  },

  async changePassword(userId, currentPassword, newPassword) {
    await delay(1000) // Simulate network delay
    
    const user = mockUsers.find(u => u.id === userId)
    if (!user) {
      throw new Error('User not found')
    }
    
    if (user.password !== currentPassword) {
      throw new Error('Current password is incorrect')
    }
    
    user.password = newPassword
    return { success: true }
  },

  async forgotPassword(email) {
    await delay(1000) // Simulate network delay
    
    const user = mockUsers.find(u => u.email === email)
    if (!user) {
      throw new Error('User with this email does not exist')
    }
    
    // In a real app, you would send a password reset email
    return { 
      success: true, 
      message: 'Password reset instructions sent to your email' 
    }
  }
}
