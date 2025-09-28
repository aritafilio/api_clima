import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './Auth.css';

const AuthPage = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
<<<<<<< HEAD
//xd
  return (
    <div>
      {isLogin ? (
        <Login onLoginSuccess={onAuthSuccess} />
      ) : (
        <Register onRegisterSuccess={onAuthSuccess} />
      )}
      
=======

  return (
    <div className="auth-page">
      {isLogin ? (
        <Login 
          onLoginSuccess={onAuthSuccess} 
          onSwitchToRegister={() => setIsLogin(false)} 
        />
      ) : (
        <Register 
          onRegisterSuccess={onAuthSuccess} 
          onSwitchToLogin={() => setIsLogin(true)} 
        />
      )}

      {/* Alternador extra por si quieres mantenerlo */}
>>>>>>> f8111109a (encriptacion)
      <div className="auth-toggle">
        <p>
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
<<<<<<< HEAD

=======
>>>>>>> f8111109a (encriptacion)
