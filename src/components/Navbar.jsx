import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { api } from '../api.js';

export default function Navbar() {
  const { user, logout } = useAuth();
  const isAdmin = user && ['admin', 'owner'].includes(user.role);

  const roleMap = {
    owner: { label: '擁有者', cls: 'badge-waitlisted' },
    admin: { label: '管理者', cls: 'badge-confirmed' },
    user:  { label: '會員',   cls: 'badge-open' },
  };
  const role = roleMap[user?.role] || roleMap.user;

  async function handleLogout() {
    try { await api('/api/auth/logout', { method: 'POST' }); } catch {}
    logout();
  }

  return (
    <nav className="navbar">
      <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="flex items-center gap-8">
          <NavLink to="/" className="brand-mark">
            <span className="brand-dot"><img src="/logo.png" alt="logo" /></span>
            CHINUP Performance
          </NavLink>
          <div className="flex items-center gap-6 hide-mobile">
            <NavLink to="/"        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>帶狀課程</NavLink>
            <NavLink to="/coaches" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>一對一教練</NavLink>
            <NavLink to="/my"      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>我的課程</NavLink>
            {isAdmin && <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>管理後台</NavLink>}
          </div>
        </div>
        {user && (
          <div className="flex items-center gap-3">
            <span className={`badge ${role.cls}`} style={{ fontSize: 10 }}>{role.label}</span>
            <span style={{ fontSize: 14, fontWeight: 500 }}>{user.name}</span>
            <button onClick={handleLogout} className="btn btn-ghost btn-sm">登出</button>
          </div>
        )}
      </div>
    </nav>
  );
}
