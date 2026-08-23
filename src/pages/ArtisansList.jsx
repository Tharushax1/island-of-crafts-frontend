import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { craftVisualClass } from '../craftVisual';

function ArtisansList() {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/artisans')
      .then((res) => setArtisans(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section container">
      <span className="hero-eyebrow">Meet the makers</span>
      <h1>Our Artisans</h1>
      <p className="card-desc" style={{ maxWidth: '520px', fontSize: '15px' }}>
        Every storefront belongs to an independent craftsperson. Visit their page to read their story and see their work.
      </p>

      {loading && <p>Loading artisans...</p>}
      {error && <p>Failed to load artisans: {error}</p>}
      {!loading && !error && artisans.length === 0 && <p>No artisan storefronts yet.</p>}

      <div className="product-grid">
        {artisans.map((artisan) => (
          <Link key={artisan._id} to={`/store/${artisan.storeSlug}`} className="product-card">
            <div className={`craft-visual ${craftVisualClass(artisan.craftSpecialty)}`}>
              <span className="craft-visual-label">{artisan.craftSpecialty || 'Handmade'}</span>
            </div>
            <div className="card-body">
              <h3>{artisan.storeName}</h3>
              <p className="card-desc">{artisan.location}</p>
              {artisan.bio && <p className="card-desc">{artisan.bio}</p>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default ArtisansList;
