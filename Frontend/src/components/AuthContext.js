import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Invitado");
  const [userEmail, setUserEmail] = useState("");
  const [token, setToken] = useState(null); // AGREGAR ESTE ESTADO
  const [isLoading, setIsLoading] = useState(true);
  
  // Función para verificar el estado de autenticación
  const checkAuthStatus = () => {
    console.log('AuthContext: Verificando estado de autenticación...');
    
    const storedToken = localStorage.getItem('authToken');
    const storedUserName = localStorage.getItem('userName');
    const storedUserEmail = localStorage.getItem('userEmail');
    
    console.log('AuthContext: Token encontrado:', !!storedToken);
    console.log('AuthContext: UserName almacenado:', storedUserName);
    
    if (storedToken) {
      setIsLoggedIn(true);
      setUserName(storedUserName || "Usuario");
      setUserEmail(storedUserEmail || "");
      setToken(storedToken); // AGREGAR ESTA LÍNEA
      console.log('AuthContext: Usuario autenticado');
    } else {
      setIsLoggedIn(false);
      setUserName("Invitado");
      setUserEmail("");
      setToken(null); // AGREGAR ESTA LÍNEA
      console.log('AuthContext: Usuario no autenticado');
    }
    
    setIsLoading(false);
  };

  // Verificar al cargar el componente
  useEffect(() => {
    console.log('AuthContext: Inicializando...');
    checkAuthStatus();
  }, []);

  // Función para hacer login
  const login = (newToken, name, email) => {
    console.log('AuthContext: Haciendo login...', { token: !!newToken, name });
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    setIsLoggedIn(true);
    setUserName(name);
    setUserEmail(email);
    setToken(newToken); // AGREGAR ESTA LÍNEA
    setIsLoading(false);
  };

  // Función para hacer logout
  const logout = () => {
    console.log('AuthContext: Haciendo logout...');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    // Limpiar tokens antiguos también
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUserName("Invitado");
    setUserEmail("");
    setToken(null); // AGREGAR ESTA LÍNEA
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      userName,
      userEmail,
      token, // AGREGAR ESTA LÍNEA
      isLoading,
      login,
      logout,
      checkAuthStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};