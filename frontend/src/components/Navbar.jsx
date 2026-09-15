import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Life <span className="brand-accent">Reset</span></div>
      <div className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
          Dashboard
        </NavLink>
        <NavLink to="/habits" className={({ isActive }) => isActive ? 'active' : ''}>
          Habits
        </NavLink>
        <NavLink to="/journal" className={({ isActive }) => isActive ? 'active' : ''}>
          Journal
        </NavLink>
        <NavLink to="/progress" className={({ isActive }) => isActive ? 'active' : ''}>
          Progress
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;