import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, UserRound } from 'lucide-react';

function Navbar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(query ? `/?search=${encodeURIComponent(query)}` : '/');
  };

  return (
    <header className="navbar">
      <div className="pattern-strip" />
      <div className="navbar-inner container">
        <Link to="/" className="navbar-logo">Island of Crafts</Link>
        <ul className="navbar-links">
          <li><Link to="/">Shop</Link></li>
          <li><Link to="/artisans">Artisans</Link></li>
          <li><Link to="/requests">Custom Requests</Link></li>
          <li><Link to="/about">About</Link></li>
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
          {/* Cart / account are placeholders — Amali's cart module and Hasandi's
              auth module will wire these up once merged in. */}
          <button className="icon-btn" aria-label="Account" type="button"><UserRound size={19} /></button>
          <button className="icon-btn" aria-label="Cart" type="button"><ShoppingBag size={19} /></button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
