import { NavLink } from 'react-router-dom';
import './AdminNavbar.css';

export default function AdminNavbar() {
  return (
    <nav className="admin-nav">
      <div className="admin-brand">Biblioteca - Admin</div>
      <ul className="admin-links">
        <li><NavLink to="/usuarios" className={({isActive}) => isActive ? 'active' : ''}>Usuarios</NavLink></li>
        <li><NavLink to="/prestamos" className={({isActive}) => isActive ? 'active' : ''}>Préstamos</NavLink></li>
        <li><NavLink to="/libros" className={({isActive}) => isActive ? 'active' : ''}>Libros</NavLink></li>
        <li><NavLink to="/licencias" className={({isActive}) => isActive ? 'active' : ''}>Licencias</NavLink></li>
        
      </ul>
    </nav>
  );
}
