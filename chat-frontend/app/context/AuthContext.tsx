'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  username: string;       // required string
  email?: string;         // optional string
  isAdmin?: boolean;      // optional boolean
}

interface AuthContextType {
  user: User | null;
  login: (user: Partial<User>) => void; // Accept partial, fix undefined
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: Partial<User>) => {
    // Ensure username is always a string
    const username = userData.username ?? userData.email?.split('@')[0] ?? 'Guest';
    
    const userToStore: User = { 
      ...userData,
      username,
      email: userData.email
    };

    console.log('🔐 User logged in:', userToStore);
    setUser(userToStore);
  };
  
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProviders');
  return context;
};


  

