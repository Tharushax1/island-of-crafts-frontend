import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { craftVisualClass } from '../craftVisual';

function ArtisanStorefront() {
  const { storeSlug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/storefront/${storeSlug}`)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [storeSlug]);

  if (loading) return <p className="container section">Loading storefront...</p>;
  if (error) return <p className="container section">Failed to load storefront: {error}</p>;
  if (!data) return null;

  const { profile, products } = data;
  const visualClass = craftVisualClass(profile.craftSpecialty);

  return (
    <>
      <section className={`store-cover craft-visual ${visualClass}`}>
        <div className="container">
          <span className="hero-eyebrow">{profile.craftSpecialty}</span>
          <h1 style={{ color: '#fff' }}>{profile.storeName}</h1>
          <p>{profile.location}</p>
        </div>
      </section>

      <section className="section container">
        <Link to="/" className="back-link">&larr; Back to products</Link>

        {profile.bio && <p className="lead-text">{profile.bio}</p>}
        {profile.story && <p className="card-desc" style={{ maxWidth: '640px', fontSize: '14px' }}>{profile.story}</p>}

        <Link to={`/request/${profile.user}`} className="btn btn-primary" style={{ marginTop: '16px' }}>
          Request a custom piece
        </Link>

        <h2 style={{ marginTop: '48px' }}>Products from this store</h2>
        {products.length === 0 ? (
          <p>No approved products from this artisan yet.</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <Link key={product._id} to={`/products/${product._id}`} className="product-card">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} className="product-photo" />
                ) : (
                  <div className={`craft-visual ${craftVisualClass(product.category?.name)}`}>
                    <span className="craft-visual-label">{product.category?.name || 'Handmade'}</span>
                  </div>
                )}
                <div className="card-body">
                  <h3>{product.name}</h3>
                  <span className="price-tag">LKR {product.price}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default ArtisanStorefront;
