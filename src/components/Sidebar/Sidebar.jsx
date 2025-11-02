import { Link, useLocation } from 'react-router-dom';
import './Sidebar.scss';

const menuItems = [
  { label: 'Início', link: '/' },
  { label: 'Novo Utilizador', link: '/user' },
  { label: 'Lista de Utilizadores', link: '/users' }
];

export function Sidebar() {
  const location = useLocation();

  const isActiveLink = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname === path;
  };

  return (
    <aside className="sidebar" role="navigation" aria-label="Menu principal">
      <nav className="sidebar-nav">
        {menuItems.map((item, idx) => (
          <Link 
            key={idx} 
            to={item.link} 
            className={`nav-link ${isActiveLink(item.link) ? 'active' : ''}`}
            aria-current={isActiveLink(item.link) ? 'page' : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <footer className="sidebar-footer">
        <p>2025® Premium-minds.com</p>
      </footer>
    </aside>
  );
}
