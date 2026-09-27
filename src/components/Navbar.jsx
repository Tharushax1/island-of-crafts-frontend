import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  UserRound,
} from 'lucide-react';

import { useCart } from '../CartContext';

function Navbar() {
  const [query, setQuery] = useState('');

  const navigate = useNavigate();

  const { cartQty } = useCart();

  const handleSearch = (e) => {
    e.preventDefault();

    navigate(
      query
        ? `/?search=${encodeURIComponent(query)}`
        : '/'
    );
  };

  return (
    <header className="navbar">
      <div className="pattern-strip" />

      <div className="navbar-inner container">

        {/* LOGO */}
        <Link
          to="/"
          className="navbar-logo"
        >
          Island of Crafts
        </Link>

        {/* NAVIGATION */}
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

        {/* ACTIONS */}
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

          {/* ACCOUNT */}
          <button
            className="icon-btn"
            aria-label="Account"
            type="button"
          >
            <UserRound size={19} />
          </button>

          {/* CART */}
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