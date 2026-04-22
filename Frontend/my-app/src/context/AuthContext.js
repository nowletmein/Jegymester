import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Create the Context
const AuthContext = createContext(null);

// 2. Define the initial Guest state
const guestUser = {
  id: 0,
  name: 'Vendég',
  email: '',
  phone: '',
  shopingCart: [],
  tickets: [],
  isGuest: true 
};

// 3. The Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(guestUser);

  // Load user from localStorage on startup
  useEffect(() => {
    const savedUser = localStorage.getItem('jegymester_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData) => {
    const loggedInUser = { ...userData, isGuest: false };
    setUser(loggedInUser);
    localStorage.setItem('jegymester_user', JSON.stringify(loggedInUser));
  };

  const logout = () => {
    setUser(guestUser);
    localStorage.removeItem('jegymester_user');
  };

  // 4. Refresh function to pull latest data (tickets, etc.) from API
  const refreshUser = async () => {
  if (!user || user.isGuest || !user.id) return;

  try {
    const response = await fetch(`http://localhost:5000/api/Users/Get/${user.id}`);
    if (response.ok) {
      const freshData = await response.json();
      
      // --- LOGGING START ---
      console.log("🔄 API REFRESH TRIGGERED");
      console.log("Previous State was Guest?", user.isGuest);
      console.log("Incoming shopingCart:", freshData.shopingCart);
      console.log("Incoming tickets count:", freshData.tickets?.length || 0);
      // --- LOGGING END ---

      const updatedUser = { ...freshData, isGuest: false };
      
      setUser(updatedUser);
      localStorage.setItem('jegymester_user', JSON.stringify(updatedUser));
    }
  } catch (error) {
    console.error("Nem sikerült frissíteni a felhasználót:", error);
  }
};

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// 5. THE MISSING HOOK: Export useAuth so other components can find it
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};