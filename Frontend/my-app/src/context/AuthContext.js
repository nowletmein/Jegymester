import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

// This is your base "Guest" object
const guestUser = {
  id: 0,
  name: 'Vendég',
  email: '',
  phone: '',
  shopingCart: [],
  tickets: [],
  isGuest: true 
};

export const AuthProvider = ({ children }) => {
  // Initialize with guestUser instead of null
  const [user, setUser] = useState(guestUser);

  useEffect(() => {
    const savedUser = localStorage.getItem('jegymester_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData) => {
    // We add isGuest: false so we know they are authenticated
    const loggedInUser = { ...userData, isGuest: false };
    setUser(loggedInUser);
    localStorage.setItem('jegymester_user', JSON.stringify(loggedInUser));
  };

  const logout = () => {
    setUser(guestUser); // Revert back to guest instead of null
    localStorage.removeItem('jegymester_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);