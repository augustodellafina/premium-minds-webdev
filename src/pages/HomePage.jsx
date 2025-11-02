import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useUserContext } from '../lib/context/UserContext';
import { USER_TYPES } from '../lib/constants/userTypes';
import { formatDate } from '../lib/utils';
import './HomePage.scss';

export function HomePage() {
  const { users } = useUserContext();
  
  const stats = useMemo(() => {
    const baseStats = {
      totalUsers: users.length,
    };
    
    // Calculate stats for each user type and filter only those with users
    const userTypesWithUsers = USER_TYPES
      .map(type => ({
        ...type,
        count: users.filter(u => u.userTypes?.includes(type.value)).length
      }))
      .filter(type => type.count > 0) // Only types with users
      .slice(0, 2); // Limit to 2 types
    
    baseStats.activeUserTypes = userTypesWithUsers;
    
    return baseStats;
  }, [users]);

  const recentUsers = useMemo(() => {
    return users
      .slice(-3)
      .reverse()
      .map(user => ({
        ...user,
        createdAt: user.createdAt || Date.now()
      }));
  }, [users]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Bem-vindo ao Premium Minds</h1>
        <p className="subtitle">Sistema de Gestão de Utilizadores - Premium Minds</p>
      </div>

      <div className="page-content">
        {/* Quick Stats */}
        {users.length > 0 && (
          <div className="stats-summary">
            <div className="stat-item">
              <span className="stat-number">{stats.totalUsers}</span>
              <span className="stat-label">Total de Utilizadores</span>
            </div>
            {stats.activeUserTypes.map(type => {
              const pluralLabel = type.count > 1 
                ? `${type.label}s` 
                : type.label;
              
              return (
                <div key={type.value} className="stat-item">
                  <span className="stat-number">{type.count}</span>
                  <span className="stat-label">{pluralLabel}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Navigation Cards */}
        <nav className="home-nav">
          <Link to="/user" className="nav-card">
            <h3>Novo Utilizador</h3>
            <p>Criar um novo utilizador no sistema</p>
          </Link>
          
          <Link to="/users" className="nav-card">
            <h3>Lista de Utilizadores</h3>
            <p>Ver e gerir utilizadores existentes ({users.length})</p>
          </Link>
        </nav>

        {/* Recent Activity */}
        {recentUsers.length > 0 && (
          <div className="recent-activity">
            <h3>Atividade Recente</h3>
            <div className="activity-list">
              {recentUsers.map(user => (
                <div key={user.id} className="activity-item">
                  <div className="activity-info">
                    <strong>{user.name}</strong> foi adicionado como {user.userTypes?.join(', ') || 'Utilizador'}
                  </div>
                  <div className="activity-time">
                    {formatDate(user.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
