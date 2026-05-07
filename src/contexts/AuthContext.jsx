import { createContext, useContext, useEffect, useState } from 'react';
import { bootAuth, clearAuth, getUser } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bootAuth().then(u => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  function logout() {
    clearAuth();
    setUser(null);
    location.href = '/login';
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
