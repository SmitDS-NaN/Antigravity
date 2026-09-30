import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (configured && supabase) {
      // 1. Check existing session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      // 2. Subscribe to auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // Offline / Sandbox Development Mode: Check local storage for persistent mock session
      const savedMockUser = localStorage.getItem('agro_demo_user');
      if (savedMockUser) {
        try {
          const parsed = JSON.parse(savedMockUser);
          setUser(parsed);
          setSession({ access_token: 'sandbox-jwt-lead-agronomist', user: parsed });
        } catch (e) {
          localStorage.removeItem('agro_demo_user');
        }
      }
      setLoading(false);
    }
  }, [configured]);

  // Sign In
  const login = async (email, password) => {
    if (configured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } else {
      // Mock login for sandbox testing
      const mockUser = {
        id: '11111111-1111-4111-a111-111111111111',
        email: email || 'agronomist@farmdemo.org',
        user_metadata: { full_name: 'Lead Agronomist' }
      };
      localStorage.setItem('agro_demo_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setSession({ access_token: 'sandbox-jwt-lead-agronomist', user: mockUser });
      return { user: mockUser };
    }
  };

  // Sign Up
  const register = async (email, password, fullName) => {
    if (configured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });
      if (error) throw error;
      return data;
    } else {
      const mockUser = {
        id: '11111111-1111-4111-a111-111111111111',
        email,
        user_metadata: { full_name: fullName || 'Agronomist User' }
      };
      localStorage.setItem('agro_demo_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setSession({ access_token: 'sandbox-jwt-lead-agronomist', user: mockUser });
      return { user: mockUser };
    }
  };

  // Sign Out
  const logout = async () => {
    if (configured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('agro_demo_user');
    setUser(null);
    setSession(null);
  };

  // One-click demo login convenience
  const loginAsDemo = () => {
    const demoUser = {
      id: '11111111-1111-4111-a111-111111111111',
      email: 'lead.agronomist@fieldlab.io',
      user_metadata: { full_name: 'Dr. Evelyn Vance (Chief Agronomist)' }
    };
    localStorage.setItem('agro_demo_user', JSON.stringify(demoUser));
    setUser(demoUser);
    setSession({ access_token: 'sandbox-jwt-lead-agronomist', user: demoUser });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        token: session?.access_token || 'sandbox-jwt-lead-agronomist',
        loading,
        isConfigured: configured,
        login,
        register,
        logout,
        loginAsDemo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
