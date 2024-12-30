import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { useAuthStore } from './store/authStore';

// Komponent chroniony - wymaga autoryzacji
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore(state => state.token);
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          {/* Strony publiczne */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Strony chronione */}
          <Route path="/" element={
            <ProtectedRoute>
              {/* Tu będzie twoja główna aplikacja */}
              <div>Strona główna</div>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;