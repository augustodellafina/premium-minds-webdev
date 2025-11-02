import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './lib/context/UserContext';
import { Header } from './components/Header/Header';
import { Sidebar } from './components/Sidebar/Sidebar';
import { HomePage } from './pages/HomePage';
import { UserPage } from './pages/UserPage';
import { UsersListPage } from './pages/UsersListPage';
import './App.scss';

export function App() {
  return (
    <UserProvider>
      <Router>
        <div className="app-container">
          <Header />
          <div className="app-body">
            <Sidebar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/user" element={<UserPage />} />
                <Route path="/user/:id" element={<UserPage />} />
                <Route path="/users" element={<UsersListPage />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </UserProvider>
  );
}
