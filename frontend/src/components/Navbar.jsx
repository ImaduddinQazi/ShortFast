import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img src="/src/assets/logoF.png" alt="EdgeURL Logo" className="h-20 w-20" />
            <span className="text-xl font-semibold text-white group-hover:text-blue-400 transition">
              EdgeURL
            </span>
          </Link>
          
          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            <NavLink to="/shorten" active={isActive('/shorten')}>
              Shorten
            </NavLink>
            <NavLink to="/analytics" active={isActive('/analytics')}>
              Analytics
            </NavLink>
            <NavLink to="/status" active={isActive('/status')}>
              Status
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? 'bg-gray-800 text-white'
          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
}

export default Navbar;