import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  Search,
  ShoppingBag,
  UserRound,
  LogOut,
} from 'lucide-react';

import { useCart } from '../CartContext';
import { useAuth } from '../context/AuthContext';


function Navbar() {
  const [query, setQuery] = useState('');

  const navigate = useNavigate();

  const { cartQty } = useCart();

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();


  // ===============================
  // SEARCH
  // ===============================

  const handleSearch = (e) => {
    e.preventDefault();

    navigate(
      query
        ? `/?search=${encodeURIComponent(query)}`
        : '/'
    );
  };


  // ===============================
  // LOGOUT
  // ===============================

  const handleLogout = () => {
    logout();

    navigate('/login');
  };


  return (
    <header className="navbar">

      <div className="pattern-strip" />

      <div className="navbar-inner container">

        {/* ==========================
            LOGO
        ========================== */}

        <Link
          to="/"
          className="navbar-logo"
        >
          Island of Crafts
        </Link>


        {/* ==========================
            NAVIGATION
        ========================== */}

        <ul className="navbar-links">

          <li>
            <Link to="/">
              Shop
            </Link>
          </li>

          <li>
            <Link to="/artisans">
              Artisans
            </Link>
          </li>

          <li>
            <Link to="/requests">
              Custom Requests
            </Link>
          </li>

          <li>
            <Link to="/about">
              About
            </Link>
          </li>

        </ul>


        {/* ==========================
            ACTIONS
        ========================== */}

        <div className="navbar-actions">


          {/* SEARCH */}

          <form
            className="navbar-search"
            onSubmit={handleSearch}
          >

            <Search
              size={15}
              className="navbar-search-icon"
            />

            <input
              type="text"
              placeholder="Search handmade pieces..."
              value={query}
              onChange={(e) =>
                setQuery(e.target.value)
              }
            />

          </form>


          {/* ==========================
              ADMIN BUTTON
              Only show for admin
          ========================== */}

          {isAuthenticated &&
            user?.role === 'admin' && (

              <button
                type="button"
                onClick={() =>
                  navigate('/admin')
                }
                style={{
                  background: '#d9a52e',
                  color: '#132d46',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: '7px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Admin
              </button>

            )}


          {/* ==========================
              ARTISAN BUTTON
              Only show for artisan
          ========================== */}

          {isAuthenticated &&
            user?.role === 'artisan' && (

              <button
                type="button"
                onClick={() =>
                  navigate('/artisan')
                }
                style={{
                  background: '#d9a52e',
                  color: '#132d46',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: '7px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Artisan
              </button>

            )}


          {/* ==========================
              ACCOUNT
          ========================== */}

         {isAuthenticated ? (
  <div className="navbar-profile">

    <div className="navbar-profile-avatar">
      {user?.name
        ? user.name.charAt(0).toUpperCase()
        : 'U'}
    </div>

    <div className="navbar-profile-info">
      <span className="navbar-profile-name">
        {user?.name || 'Account'}
      </span>

      <span className="navbar-profile-role">
        {user?.role || 'customer'}
      </span>
    </div>

    <button
      className="navbar-logout-btn"
      onClick={handleLogout}
      aria-label="Logout"
      type="button"
      title="Logout"
    >
      <LogOut size={17} />
    </button>

  </div>
) : (
            <button
              className="icon-btn"
              aria-label="Login"
              type="button"
              onClick={() =>
                navigate('/login')
              }
              title="Login"
            >
              <UserRound size={19} />
            </button>

          )}


          {/* ==========================
              CART
          ========================== */}

          <Link
            to="/cart"
            className="icon-btn cart-icon-wrapper"
            aria-label={`Cart (${cartQty} items)`}
          >

            <ShoppingBag size={19} />

            {cartQty > 0 && (

              <span className="cart-count">

                {cartQty > 99
                  ? '99+'
                  : cartQty}

              </span>

            )}

          </Link>

        </div>

      </div>

    </header>
  );
}


export default Navbar;