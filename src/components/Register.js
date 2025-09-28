import React, { useState } from 'react';
import { registerUser } from '../firebase/auth';
import './Auth.css';

<<<<<<< HEAD
const Register = ({ onRegisterSuccess }) => {
=======
const Register = ({ onRegisterSuccess, onSwitchToLogin }) => {
>>>>>>> f8111109a (encriptacion)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
<<<<<<< HEAD
    setError(''); 
=======
    setError(''); // limpia error al cambiar input
>>>>>>> f8111109a (encriptacion)
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
<<<<<<< HEAD
      setError('Las contraseñas no coinciden');
      return false;
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
=======
      setError('❌ Las contraseñas no coinciden');
      return false;
    }
    if (formData.password.length < 6) {
      setError('❌ La contraseña debe tener al menos 6 caracteres');
>>>>>>> f8111109a (encriptacion)
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

<<<<<<< HEAD
    const result = await registerUser(formData.email, formData.password);
    
    if (result.success) {
      onRegisterSuccess(result.user);
    } else {
      setError(result.error);
    }
    
=======
    try {
      const result = await registerUser(formData.email, formData.password);

      if (result.success) {
        onRegisterSuccess(result.user);
      } else {
        // Muestra el error exacto que viene del backend
        setError(`❌ Error: ${result.error}`);
      }
    } catch (err) {
      // Error inesperado de la petición
      console.error('Error en registro:', err);
      setError('❌ Error inesperado al registrar');
    }

>>>>>>> f8111109a (encriptacion)
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Registrarse</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tu@email.com"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Repite tu contraseña"
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
<<<<<<< HEAD
=======

        <div className="auth-footer">
          <p>¿Ya tienes cuenta?</p>
          <button type="button" onClick={onSwitchToLogin}>
            Iniciar Sesión
          </button>
        </div>
>>>>>>> f8111109a (encriptacion)
      </div>
    </div>
  );
};

export default Register;
<<<<<<< HEAD

=======
>>>>>>> f8111109a (encriptacion)
