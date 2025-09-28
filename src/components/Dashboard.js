import React from 'react';
import Weather from './Weather';
import { logoutUser } from '../firebase/auth';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      onLogout();
    } else {
      console.error('Error al cerrar sesión:', result.error);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="user-info">
          <h2>🌤️ Clima App</h2>
          <p>Usuario: {user?.email}</p>
        </div>
        <button onClick={handleLogout} className="logout-button">
          🚪 Cerrar Sesión
        </button>
      </header>
      
      <main className="dashboard-main">
        <Weather user={user} />
      </main>
    </div>
  );
};

export default Dashboard;

