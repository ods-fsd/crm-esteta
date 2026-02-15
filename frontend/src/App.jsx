import React from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import ClientList from './components/ClientList/ClientList';
import './App.css';
import Appointments from './components/Appointments';
import Dashboard from './components/Dashboard/Dashboard';


// --- Компонент захищеного маршруту ---
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Завантаження...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

// --- Компонент Навігації ---
const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null; // Не показуємо меню на сторінці логіна

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="main-nav">
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>ESTETA CRM</div>
      <div className="nav-links">
        <Link to="/" className={isActive('/')}>Календар</Link>
        <Link to="/appointments" className={isActive('/appointments')}>Записи</Link>
        <Link to="/clients" className={isActive('/clients')}>Клієнти</Link>
        
        <span style={{ marginLeft: '20px', color: '#7f8c8d' }}>
           👤 {user.username} ({user.role})
        </span>
        <button onClick={logout}>Вихід</button>
      </div>
    </nav>
  );
};

function App() {
  return (
    <div className="app-wrapper">
      <Navigation />
      
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Захищені маршрути */}
        <Route path="/" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/clients" element={
          <ProtectedRoute><ClientList /></ProtectedRoute>
        } />
        <Route path="/appointments" element={
          <ProtectedRoute><Appointments /></ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;