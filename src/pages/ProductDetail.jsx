import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p style={{ padding: '24px' }}>Loading product...</p>;
  if (error) return <p style={{ padding: '24px' }}>Failed to load product: {error}</p>;
  if (!product) return <p style={{ padding: '24px' }}>Product not found.</p>;

  return (
    <div style={{ padding: '24px', maxWidth: '600px' }}>
      <Link to="/">&larr; Back to products</Link>
      <h1>{product.name}</h1>
      <p style={{ color: '#666' }}>{product.description}</p>
      <p style={{ fontSize: '20px' }}><strong>LKR {product.price}</strong></p>
      <p>Stock: {product.stock}</p>
      <p>Category: {product.category?.name}</p>

      {product.attributes && Object.keys(product.attributes).length > 0 && (
        <div>
          <h3>Details</h3>
          <ul>
            {Object.entries(product.attributes).map(([key, value]) => (
              <li key={key}>{key}: {value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
