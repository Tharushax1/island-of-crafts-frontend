import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/products')
      .then((res) => setProducts(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Failed to load products: {error}</p>;
  if (products.length === 0) return <p>No approved products yet.</p>;

  return (
    <div style={{ padding: '24px' }}>
      <h1>Island of Crafts — Products</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
        {products.map((product) => (
          <Link
            key={product._id}
            to={`/products/${product._id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', cursor: 'pointer' }}>
              <h3>{product.name}</h3>
              <p style={{ color: '#666', fontSize: '14px' }}>{product.description}</p>
              <p><strong>LKR {product.price}</strong></p>
              <p style={{ fontSize: '12px', color: '#999' }}>{product.category?.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
