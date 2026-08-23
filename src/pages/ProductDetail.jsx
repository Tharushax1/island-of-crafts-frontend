import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { craftVisualClass } from '../craftVisual';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="container section">Loading product...</p>;
  if (error) return <p className="container section">Failed to load product: {error}</p>;
  if (!product) return <p className="container section">Product not found.</p>;

  const outOfStock = product.stock <= 0;

  // NOTE: "Add to Cart" is a placeholder for now — Amali's Cart & Order
  // module will provide the real /api/cart endpoint to wire this up to.
  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section className="section container">
      <Link to="/" className="back-link">&larr; Back to products</Link>
      <div className="detail-grid">
        <div>
          {product.images?.[0] ? (
            <img src={product.images[activeImage]} alt={product.name} className="product-photo-large" />
          ) : (
            <div className={`craft-visual craft-visual-large ${craftVisualClass(product.category?.name)}`}>
              <span className="craft-visual-label">{product.category?.name}</span>
            </div>
          )}
          {product.images && product.images.length > 1 && (
            <div className="thumbnail-row">
              {product.images.map((img, i) => (
                <img
                  key={img + i}
                  src={img}
                  alt={`${product.name} ${i + 1}`}
                  className={`thumbnail ${i === activeImage ? 'active' : ''}`}
                  onClick={() => setActiveImage(i)}
                />
              ))}
            </div>
          )}
        </div>
        <div>
          <span className="category-badge">{product.category?.name || 'Handmade'}</span>
          <h1>{product.name}</h1>
          <p className="card-desc" style={{ fontSize: '15px' }}>{product.description}</p>
          <p className="price-tag" style={{ fontSize: '22px' }}>LKR {product.price}</p>

          <p className={`stock-note ${product.stock <= 3 && !outOfStock ? 'low' : ''}`}>
            {outOfStock ? 'Out of stock' : product.stock <= 3 ? `Only ${product.stock} left` : `${product.stock} in stock`}
          </p>

          {!outOfStock && (
            <div className="purchase-row">
              <div className="qty-stepper">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1}>−</button>
                <span>{qty}</span>
                <button type="button" onClick={() => setQty((q) => Math.min(product.stock, q + 1))} disabled={qty >= product.stock}>+</button>
              </div>
              <button type="button" className="btn btn-primary btn-add-cart" onClick={handleAddToCart}>
                {added ? 'Added ✓' : 'Add to Cart'}
              </button>
            </div>
          )}

          {product.attributes && Object.keys(product.attributes).length > 0 && (
            <div className="attributes-list">
              <h3>Details</h3>
              <ul>
                {Object.entries(product.attributes).map(([key, value]) => (
                  <li key={key}><strong>{key}:</strong> {value}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
