import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, UserRound, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(query ? `/?search=${encodeURIComponent(query)}` : '/');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="pattern-strip" />

      <div className="navbar-inner container">

        <Link to="/" className="navbar-logo">
          Island of Crafts
        </Link>

        <ul className="navbar-links">
          <li>
            <Link to="/">Shop</Link>
          </li>

          <li>
            <Link to="/artisans">Artisans</Link>
          </li>

          <li>
            <Link to="/requests">Custom Requests</Link>
          </li>

          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>

        <div className="navbar-actions">

          <form className="navbar-search" onSubmit={handleSearch}>
            <Search size={15} className="navbar-search-icon" />

            <input
              type="text"
              placeholder="Search handmade pieces..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>

          {/* Account */}

          {isAuthenticated ? (
            <div className="navbar-account">

              <UserRound size={19} />

              <span>{user?.name}</span>

              <button
                className="icon-btn"
                onClick={handleLogout}
                aria-label="Logout"
                type="button"
                title="Logout"
              >
                <LogOut size={18} />
              </button>

            </div>
          ) : (
            <button
              className="icon-btn"
              aria-label="Login"
              type="button"
              onClick={() => navigate('/login')}
              title="Login"
            >
              <UserRound size={19} />
            </button>
          )}

          {/* Cart */}

          <button
            className="icon-btn"
            aria-label="Cart"
            type="button"
          >
            <ShoppingBag size={19} />
          </button>

        </div>
      </div>
    </header>
  );
}

export default Navbar;