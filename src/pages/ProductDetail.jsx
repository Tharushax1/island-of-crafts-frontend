import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import api from '../api';
import { addToCart } from '../services/cartApi';
import { useCart } from '../CartContext';
import { craftVisualClass } from '../craftVisual';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [cartError, setCartError] = useState(null);

  const [activeImage, setActiveImage] = useState(0);

  // Load product
  useEffect(() => {
    setLoading(true);
    setError(null);
    setProduct(null);

    setQty(1);
    setAdding(false);
    setCartError(null);
    setActiveImage(0);

    api.get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || err.message
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // Add product to cart
  const handleAddToCart = async () => {
  if (!product) return;

  setAdding(true);
  setCartError(null);

  try {
    await addItem(product._id, qty);

    // CartContext is now updated
    // Navbar receives the new cartQty automatically

    navigate('/cart');
  } catch (err) {
    setCartError(
      err.response?.data?.message ||
      err.message ||
      'Failed to add product'
    );
  } finally {
    setAdding(false);
  }
};
  // Loading
  if (loading) {
    return (
      <p className="container section">
        Loading product...
      </p>
    );
  }

  // Error
  if (error) {
    return (
      <p className="container section">
        Failed to load product: {error}
      </p>
    );
  }

  // Not found
  if (!product) {
    return (
      <p className="container section">
        Product not found.
      </p>
    );
  }

  const outOfStock = product.stock <= 0;

  const unitPrice = Number(product.price) || 0;
  const quantity = Number(qty) || 1;

  // Price changes immediately when quantity changes
  const totalPrice = unitPrice * quantity;

  return (
    <section className="section container">

      {/* Back */}
      <Link to="/" className="back-link">
        &larr; Back to products
      </Link>

      <div className="detail-grid">

        {/* =========================
            PRODUCT IMAGES
        ========================= */}
        <div>

          {product.images?.[0] ? (
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="product-photo-large"
            />
          ) : (
            <div
              className={`craft-visual craft-visual-large ${craftVisualClass(
                product.category?.name
              )}`}
            >
              <span className="craft-visual-label">
                {product.category?.name || 'Handmade'}
              </span>
            </div>
          )}

          {/* Thumbnails */}
          {product.images &&
            product.images.length > 1 && (
              <div className="thumbnail-row">
                {product.images.map((img, i) => (
                  <img
                    key={img + i}
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    className={`thumbnail ${
                      i === activeImage
                        ? 'active'
                        : ''
                    }`}
                    onClick={() =>
                      setActiveImage(i)
                    }
                  />
                ))}
              </div>
            )}

        </div>

        {/* =========================
            PRODUCT INFORMATION
        ========================= */}
        <div>

          {/* Category */}
          <span className="category-badge">
            {product.category?.name || 'Handmade'}
          </span>

          {/* Name */}
          <h1>{product.name}</h1>

          {/* Description */}
          <p
            className="card-desc"
            style={{ fontSize: '15px' }}
          >
            {product.description}
          </p>

          {/* =========================
              PRICE
          ========================= */}
          <div className="product-price-section">

            <p
              className="price-tag"
              style={{ fontSize: '22px' }}
            >
              LKR {totalPrice.toLocaleString()}
            </p>

            {quantity > 1 && (
              <p
                className="card-desc"
                style={{
                  fontSize: '13px',
                  marginTop: '-8px',
                }}
              >
                LKR {unitPrice.toLocaleString()} ×{' '}
                {quantity} items
              </p>
            )}

          </div>

          {/* Stock */}
          <p
            className={`stock-note ${
              product.stock <= 3 &&
              !outOfStock
                ? 'low'
                : ''
            }`}
          >
            {outOfStock
              ? 'Out of stock'
              : product.stock <= 3
                ? `Only ${product.stock} left`
                : `${product.stock} in stock`}
          </p>

          {/* =========================
              QUANTITY + CART
          ========================= */}
          {!outOfStock && (
            <>
              <div className="purchase-row">

                {/* Quantity */}
                <div className="qty-stepper">

                  <button
                    type="button"
                    onClick={() => {
                      setQty((q) =>
                        Math.max(1, q - 1)
                      );
                    }}
                    disabled={
                      qty <= 1 || adding
                    }
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>

                  <span>{qty}</span>

                  <button
                    type="button"
                    onClick={() => {
                      setQty((q) =>
                        Math.min(
                          product.stock,
                          q + 1
                        )
                      );
                    }}
                    disabled={
                      qty >= product.stock ||
                      adding
                    }
                    aria-label="Increase quantity"
                  >
                    +
                  </button>

                </div>

                {/* Add to Cart */}
                <button
                  type="button"
                  className="btn btn-primary btn-add-cart"
                  onClick={handleAddToCart}
                  disabled={adding}
                >
                  {adding
                    ? 'Adding...'
                    : 'Add to Cart'}
                </button>

              </div>

              {/* Cart error */}
              {cartError && (
                <p className="error-text">
                  {cartError}
                </p>
              )}
            </>
          )}

          {/* =========================
              ATTRIBUTES
          ========================= */}
          {product.attributes &&
            Object.keys(product.attributes)
              .length > 0 && (
              <div className="attributes-list">

                <h3>Details</h3>

                <ul>
                  {Object.entries(
                    product.attributes
                  ).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key}:</strong>{' '}
                      {value}
                    </li>
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