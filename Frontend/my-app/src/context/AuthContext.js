import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

const guestUser = {
  id: 0,
  name: 'Vendég',
  email: '',
  phone: '',
  roles: [],
  isGuest: true 
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(guestUser);
  const [token, setToken] = useState(localStorage.getItem('jegymester_token'));

  useEffect(() => {
    if (token) {
    try {
      const decoded = jwtDecode(token);
      
      const isExpired = decoded.exp * 1000 < Date.now();
      if (isExpired) {
        logout();
      } else {
        // Map the long XML Schema keys to clean property names
        setUser({
          id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
          name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
          email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
          phone: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone"],
          roles: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [],
          sid: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid"],
          isGuest: false
        });
      }
    } catch (error) {
      console.error("Invalid token:", error);
      logout();
    }
  }
}, [token]);

  const login = (jwtToken) => {
    localStorage.setItem('jegymester_token', jwtToken);
    setToken(jwtToken);
  };

  const logout = () => {
    localStorage.removeItem('jegymester_token');
    setToken(null);
    setUser(guestUser);
  };

  const refreshUser = async () => {
  if (!token || user.isGuest) return;

  try {
    // Note: URL is now just /Get (or /GetByToken depending on your routing)
    // because the backend pulls the ID from the Bearer token
    const response = await fetch(`http://localhost:5000/api/Users/Get`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const freshData = await response.json();
      // Keep your local state synced with fresh data from DB
      setUser(prev => ({ ...prev, ...freshData, isGuest: false }));
    }
  } catch (error) {
    console.error("Nem sikerült frissíteni:", error);
  }
};

  return (
    <AuthContext.Provider value={{ user, token, login, logout, refreshUser }}>
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