
import React, { createContext, useContext, useEffect, useState } from 'react'
import dataService from '../services/dataService'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children, setError }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session in localStorage
    const checkExistingSession = async () => {
      try {
        const sessionData = localStorage.getItem('neenu_auth_session');
        if (sessionData) {
          const session = JSON.parse(sessionData);
          const user = dataService.getUser(session.userId);
          if (user) {
            setUser(user);
            setUserProfile(user);
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkExistingSession();
  }, [])

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const user = dataService.authenticate(email, password);
      
      if (user) {
        setUser(user);
        setUserProfile(user);
        
        // Save session
        localStorage.setItem('neenu_auth_session', JSON.stringify({
          userId: user.id,
          timestamp: Date.now()
        }));
        
        return { user, error: null };
      } else {
        return { user: null, error: { message: 'Invalid credentials' } };
      }
    } catch (error) {
      return { user: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      setUserProfile(null);
      localStorage.removeItem('neenu_auth_session');
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const updateProfile = async (updates) => {
    try {
      if (!user) return { error: { message: 'No user logged in' } };
      
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      setUserProfile(updatedUser);
      
      // In a real app, you'd update the database here
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signOut,
    isAdmin,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
