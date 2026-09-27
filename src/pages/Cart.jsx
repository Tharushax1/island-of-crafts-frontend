import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../services/cartApi';

import { useCart } from '../CartContext';

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [busyProduct, setBusyProduct] = useState(null);
  const [clearing, setClearing] = useState(false);

  // Get shared CartContext
  const { refreshCart } = useCart();

  // ============================
  // GET CART
  // ============================
  const fetchCart = async () => {
    try {
      setError(null);

      const data = await getCart();

      setCart(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to load cart'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ============================
  // UPDATE QUANTITY
  // ============================
  const handleQuantityChange = async (
    productId,
    newQuantity
  ) => {
    if (newQuantity < 1) return;

    try {
      setBusyProduct(productId);
      setError(null);

      await updateCartItem(
        productId,
        newQuantity
      );

      await fetchCart();

      // Refresh navbar cart badge
      await refreshCart();

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to update quantity'
      );
    } finally {
      setBusyProduct(null);
    }
  };

  // ============================
  // REMOVE PRODUCT
  // ============================
  const handleRemove = async (productId) => {
    try {
      setBusyProduct(productId);
      setError(null);

      await removeFromCart(productId);

      await fetchCart();

      // Refresh navbar cart badge
      await refreshCart();

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to remove product'
      );
    } finally {
      setBusyProduct(null);
    }
  };

  // ============================
  // CLEAR CART
  // ============================
  const handleClearCart = async () => {
    try {
      setClearing(true);
      setError(null);

      await clearCart();

      await fetchCart();

      // Refresh navbar cart badge
      await refreshCart();

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to clear cart'
      );
    } finally {
      setClearing(false);
    }
  };

  // ============================
  // PROCEED TO CHECKOUT
  // ============================
  const handleCheckout = () => {
    navigate('/checkout');
  };

  // ============================
  // LOADING
  // ============================
  if (loading) {
    return (
      <section className="section container cart-page">
        <h1>Your Cart</h1>

        <p>Loading your cart...</p>
      </section>
    );
  }

  // ============================
  // ERROR
  // ============================
  if (error && !cart) {
    return (
      <section className="section container cart-page">
        <h1>Your Cart</h1>

        <p className="error-text">
          {error}
        </p>

        <button
          type="button"
          className="btn btn-primary"
          onClick={fetchCart}
        >
          Try Again
        </button>
      </section>
    );
  }

  const items = cart?.items || [];

  // ============================
  // TOTAL QUANTITY
  // ============================
  const totalQty = items.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  // ============================
  // SUBTOTAL
  // ============================
  const subtotal = items.reduce(
    (total, item) => {
      const price =
        Number(item.product?.price || 0);

      const quantity =
        Number(item.quantity || 0);

      return total + price * quantity;
    },
    0
  );

  // ============================
  // DELIVERY
  // ============================
  const FREE_DELIVERY_LIMIT = 20000;
  const DELIVERY_FEE = 350;

  const delivery =
    subtotal >= FREE_DELIVERY_LIMIT
      ? 0
      : subtotal > 0
        ? DELIVERY_FEE
        : 0;

  const total = subtotal + delivery;

  return (
    <section className="section container cart-page">

      {/* ============================
          HEADER
      ============================ */}

      <div className="cart-header">

        <div>
          <span className="hero-eyebrow">
            Shopping bag
          </span>

          <h1>Your Cart</h1>

          <p className="card-desc">
            Review your handmade pieces before
            placing your order.
          </p>
        </div>

        <Link
          to="/"
          className="back-link"
        >
          &larr; Continue shopping
        </Link>

      </div>


      {/* ============================
          ERROR
      ============================ */}

      {error && (
        <p className="error-text cart-error">
          {error}
        </p>
      )}


      {/* ============================
          EMPTY CART
      ============================ */}

      {items.length === 0 ? (

        <div className="empty-cart">

          <div className="empty-cart-icon">
            🛍️
          </div>

          <h2>
            Your cart is empty
          </h2>

          <p className="card-desc">
            Discover something beautiful from
            our independent artisans.
          </p>

          <Link
            to="/"
            className="btn btn-primary"
          >
            Explore Handmade Pieces
          </Link>

        </div>

      ) : (

        /* ============================
           CART CONTENT
        ============================ */

        <div className="cart-layout">

          {/* ============================
              CART ITEMS
          ============================ */}

          <div className="cart-items-section">

            <div className="cart-items-header">

              <h2>
                Your Items

                <span>
                  {totalQty}
                </span>
              </h2>

              <button
                type="button"
                className="clear-cart-btn"
                onClick={handleClearCart}
                disabled={clearing}
              >
                {clearing
                  ? 'Clearing...'
                  : 'Clear cart'}
              </button>

            </div>


            <div className="cart-items">

              {items.map((item) => {

                const product = item.product;

                const productId =
                  product?._id ||
                  item.product;

                const price =
                  Number(
                    product?.price || 0
                  );

                const quantity =
                  Number(
                    item.quantity || 0
                  );

                const itemTotal =
                  price * quantity;

                const isBusy =
                  busyProduct === productId;

                return (

                  <div
                    className="cart-item-card"
                    key={productId}
                  >

                    {/* =========================
                        PRODUCT IMAGE
                    ========================= */}

                    <div className="cart-item-image">

                      {product?.images?.[0] ? (

                        <img
                          src={product.images[0]}
                          alt={product.name}
                        />

                      ) : (

                        <div className="cart-image-placeholder">
                          Handmade
                        </div>

                      )}

                    </div>


                    {/* =========================
                        PRODUCT DETAILS
                    ========================= */}

                    <div className="cart-item-info">

                      <span className="category-badge">
                        {product?.category?.name ||
                          'Handmade'}
                      </span>

                      <h3>
                        {product?.name ||
                          'Product'}
                      </h3>

                      <p className="cart-unit-price">
                        LKR{' '}
                        {price.toLocaleString()}{' '}
                        each
                      </p>


                      {/* =========================
                          QUANTITY + REMOVE
                      ========================= */}

                      <div className="cart-item-bottom">

                        <div className="cart-quantity">

                          <button
                            type="button"
                            disabled={
                              isBusy ||
                              quantity <= 1
                            }
                            onClick={() =>
                              handleQuantityChange(
                                productId,
                                quantity - 1
                              )
                            }
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>

                          <span>
                            {isBusy
                              ? '...'
                              : quantity}
                          </span>

                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() =>
                              handleQuantityChange(
                                productId,
                                quantity + 1
                              )
                            }
                            aria-label="Increase quantity"
                          >
                            +
                          </button>

                        </div>


                        <button
                          type="button"
                          className="remove-item-btn"
                          disabled={isBusy}
                          onClick={() =>
                            handleRemove(productId)
                          }
                        >
                          {isBusy
                            ? 'Removing...'
                            : 'Remove'}
                        </button>

                      </div>

                    </div>


                    {/* =========================
                        ITEM TOTAL
                    ========================= */}

                    <div className="cart-item-total">

                      <span>
                        Item total
                      </span>

                      <strong>
                        LKR{' '}
                        {itemTotal.toLocaleString()}
                      </strong>

                    </div>

                  </div>

                );
              })}

            </div>

          </div>


          {/* ============================
              ORDER SUMMARY
          ============================ */}

          <aside className="order-summary">

            <div className="summary-card">

              <span className="hero-eyebrow">
                Your order
              </span>

              <h2>
                Order Summary
              </h2>


              {/* SUBTOTAL */}

              <div className="summary-line">

                <span>
                  Subtotal
                </span>

                <strong>
                  LKR{' '}
                  {subtotal.toLocaleString()}
                </strong>

              </div>


              {/* DELIVERY */}

              <div className="summary-line">

                <span>
                  Delivery
                </span>

                <strong>
                  {delivery === 0
                    ? 'FREE'
                    : `LKR ${delivery.toLocaleString()}`}
                </strong>

              </div>


              {/* FREE DELIVERY MESSAGE */}

              {subtotal >=
                FREE_DELIVERY_LIMIT && (

                <p className="free-delivery-note">
                  ✓ You qualify for free
                  delivery!
                </p>

              )}


              {/* DELIVERY MESSAGE */}

              {subtotal > 0 &&
                subtotal <
                  FREE_DELIVERY_LIMIT && (

                <p className="delivery-note">

                  Add LKR{' '}
                  {(
                    FREE_DELIVERY_LIMIT -
                    subtotal
                  ).toLocaleString()}{' '}

                  more for free delivery.

                </p>

              )}


              <div className="summary-divider" />


              {/* TOTAL */}

              <div className="summary-total">

                <span>
                  Total
                </span>

                <strong>
                  LKR{' '}
                  {total.toLocaleString()}
                </strong>

              </div>


              {/* ============================
                  CHECKOUT BUTTON
              ============================ */}

              <button
                type="button"
                className="btn btn-primary checkout-btn"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>


              <p className="secure-note">
                Your order is prepared directly
                with our independent artisans.
              </p>

            </div>

          </aside>

        </div>

      )}

    </section>
  );
}

export default Cart;