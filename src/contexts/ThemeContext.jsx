import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { localStorageService } from '../services/localStorageService'

const ThemeContext = createContext()

const initialState = {
  theme: 'light', // 'light', 'dark', 'auto'
  isDark: false
}

const themeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
        isDark: action.payload === 'dark' || 
                (action.payload === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
      }
    case 'TOGGLE_THEME':
      const newTheme = state.theme === 'light' ? 'dark' : 'light'
      return {
        ...state,
        theme: newTheme,
        isDark: newTheme === 'dark'
      }
    case 'SET_DARK_MODE':
      return {
        ...state,
        isDark: action.payload
      }
    default:
      return state
  }
}

export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState)

  useEffect(() => {
    // Load theme from localStorage or system preference
    const savedTheme = localStorageService.getTheme()
    if (savedTheme) {
      dispatch({ type: 'SET_THEME', payload: savedTheme })
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      dispatch({ type: 'SET_THEME', payload: prefersDark ? 'dark' : 'light' })
    }
  }, [])

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement
    if (state.isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [state.isDark])

  useEffect(() => {
    // Listen for system theme changes when in auto mode
    if (state.theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e) => {
        dispatch({ type: 'SET_DARK_MODE', payload: e.matches })
      }
      
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [state.theme])

  const setTheme = (theme) => {
    dispatch({ type: 'SET_THEME', payload: theme })
    localStorageService.setTheme(theme)
  }

  const toggleTheme = () => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  const value = {
    ...state,
    setTheme,
    toggleTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
