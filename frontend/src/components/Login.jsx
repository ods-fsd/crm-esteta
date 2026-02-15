import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(username, password);
      // Якщо успішно - переходимо на головну
      navigate('/');
    } catch (err) {
      // Виводимо помилку від сервера або загальну
      setError(err.response?.data?.error || 'Помилка входу');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Вхід в CRM</h2>
        
        {error && <div className="error-msg">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Логін</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введіть логін"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введіть пароль"
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
            Увійти
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;