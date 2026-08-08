import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

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

  if (loading) return <p style={{ padding: '24px' }}>Loading storefront...</p>;
  if (error) return <p style={{ padding: '24px' }}>Failed to load storefront: {error}</p>;
  if (!data) return null;

  const { profile, products } = data;

  return (
    <div style={{ padding: '24px', maxWidth: '800px' }}>
      <Link to="/">&larr; Back to products</Link>

      {/* ── Artisan bio / storytelling section ── */}
      <div style={{ marginTop: '16px', marginBottom: '32px' }}>
        <h1>{profile.storeName}</h1>
        {profile.craftSpecialty && <p style={{ color: '#999' }}>{profile.craftSpecialty} · {profile.location}</p>}
        {profile.bio && <p><strong>{profile.bio}</strong></p>}
        {profile.story && <p style={{ color: '#666', lineHeight: '1.6' }}>{profile.story}</p>}
        <Link to={`/request/${profile.user}`}>
          <button style={{ marginTop: '12px', padding: '10px 16px', cursor: 'pointer' }}>
            Request a custom piece from this artisan
          </button>
        </Link>
      </div>

      {/* ── This artisan's products ── */}
      <h2>Products from this store</h2>
      {products.length === 0 ? (
        <p>No approved products from this artisan yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/products/${product._id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px' }}>
                <h3>{product.name}</h3>
                <p><strong>LKR {product.price}</strong></p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default ArtisanStorefront;
