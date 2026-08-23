import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Truck, ShieldCheck, Handshake, RotateCcw } from 'lucide-react';
import api from '../api';
import { craftVisualClass } from '../craftVisual';

// Drop your hero photos into ecom-frontend/public/hero/ using these exact
// names — 1.jpg, 2.jpg, 3.jpg — and they'll rotate automatically.
const HERO_IMAGES = ['/hero/1.jpg', '/hero/2.jpg', '/hero/3.jpg'];

function ProductList() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    api.get('/products', { params })
      .then((res) => setProducts(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((s) => (s + 1) % HERO_IMAGES.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* ─────────────────────────────────────────
          PROFESSIONAL FULL-WIDTH HERO
      ───────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-background">
          {HERO_IMAGES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              className={i === slide ? 'active' : ''}
            />
          ))}
        </div>

        <div className="hero-overlay" />

        <div className="container hero-content">
          <div className="hero-copy">
            <span className="hero-eyebrow">Handmade in Sri Lanka</span>

            <h1>Every piece carries a maker's story.</h1>

            <p>
              From batik dye vats in Kandy to wood-carving workshops by the
              coast — browse original pieces, or commission one made just for
              you.
            </p>

            <div className="hero-actions">
              <a href="#collection" className="btn btn-primary">
                Explore Handmade Pieces
              </a>

              <Link to="/artisans" className="btn btn-hero-secondary">
                Meet Our Artisans
              </Link>
            </div>
          </div>

          <div className="hero-dots" aria-label="Hero slideshow">
            {HERO_IMAGES.map((_, i) => (
              <span
                key={i}
                className={i === slide ? 'active' : ''}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          TRUST BADGES
      ───────────────────────────────────────── */}
      <div className="trust-row">
        <div className="container trust-row-inner">
          <div className="trust-item">
            <Truck size={22} />
            <div>
              <h4>Island-wide Delivery</h4>
              <p>On orders over LKR 5,000</p>
            </div>
          </div>

          <div className="trust-item">
            <ShieldCheck size={22} />
            <div>
              <h4>Verified Artisans</h4>
              <p>Every seller is vetted</p>
            </div>
          </div>

          <div className="trust-item">
            <Handshake size={22} />
            <div>
              <h4>Custom Orders</h4>
              <p>Commission a made-to-order piece</p>
            </div>
          </div>

          <div className="trust-item">
            <RotateCcw size={22} />
            <div>
              <h4>Easy Returns</h4>
              <p>7-day return window</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────
          PRODUCT COLLECTION
      ───────────────────────────────────────── */}
      <section className="section" id="collection">
        <div className="container">
          <h2>{search ? `Results for "${search}"` : 'The collection'}</h2>

          {loading && <p>Loading products...</p>}

          {error && <p>Failed to load products: {error}</p>}

          {!loading && !error && products.length === 0 && (
            <p>No approved products yet.</p>
          )}

          <div className="product-grid">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className="product-card"
              >
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="product-photo"
                  />
                ) : (
                  <div
                    className={`craft-visual ${craftVisualClass(
                      product.category?.name
                    )}`}
                  >
                    <span className="craft-visual-label">
                      {product.category?.name || 'Handmade'}
                    </span>
                  </div>
                )}

                <div className="card-body">
                  <h3>{product.name}</h3>
                  <p className="card-desc">{product.description}</p>
                  <span className="price-tag">LKR {product.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default ProductList;
