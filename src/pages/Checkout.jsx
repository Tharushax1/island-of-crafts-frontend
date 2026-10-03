import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useCart } from '../CartContext';
import {
  createOrder,
  demoPayOrder,
} from '../services/orderApi';

const FREE_DELIVERY_LIMIT = 20000;
const DELIVERY_FEE = 350;

function Checkout() {
  const { cart, loading, refreshCart } = useCart();
  const navigate = useNavigate();

  // ================================
  // CUSTOMER FORM
  // ================================

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  // ================================
  // PAYMENT METHOD
  // ================================

  const [paymentMethod, setPaymentMethod] =
    useState('cash_on_delivery');

  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const items = cart?.items || [];

  // ================================
  // SUBTOTAL
  // ================================

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const price = Number(item.product?.price || 0);
      const quantity = Number(item.quantity || 0);

      return sum + price * quantity;
    }, 0);
  }, [items]);

  // ================================
  // DELIVERY
  // ================================

  const delivery =
    subtotal >= FREE_DELIVERY_LIMIT
      ? 0
      : subtotal > 0
        ? DELIVERY_FEE
        : 0;

  const total = subtotal + delivery;

  // ================================
  // HANDLE INPUT
  // ================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setSaved(false);

    if (error) {
      setError('');
    }
  };

  // ================================
  // SAVE DETAILS
  // ================================

  const handleSave = () => {
    setError('');

    if (
      !form.fullName ||
      !form.email ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.postalCode
    ) {
      setError(
        'Please complete all customer and delivery details.'
      );

      setSaved(false);

      return;
    }

    setSaved(true);
  };

  // ================================
  // SUBMIT ORDER
  // ================================

const handleSubmit = async (event) => {
  event.preventDefault();

  if (items.length === 0) {
    setError('Your cart is empty.');
    return;
  }

  if (
    !form.fullName ||
    !form.email ||
    !form.phone ||
    !form.address ||
    !form.city ||
    !form.postalCode
  ) {
    setError(
      'Please complete all customer and delivery details.'
    );
    return;
  }

  setSubmitting(true);
  setError('');

  try {
    // Create order first
    const data = await createOrder({
      email: form.email,

      paymentMethod,

      shippingAddress: {
        fullName: form.fullName,
        phone: form.phone,
        address: form.address,
        city: form.city,
        postalCode: form.postalCode,
      },
    });

    const orderNumber =
      data.order.orderNumber;

    // ============================
    // CASH ON DELIVERY
    // ============================

    if (
      paymentMethod ===
      'cash_on_delivery'
    ) {
      await refreshCart();

      navigate(
        `/order-confirmation/${orderNumber}`
      );

      return;
    }

    // ============================
    // PAYHERE
    // ============================

if (paymentMethod === 'payhere') {
  const demoUrl =
    `${window.location.origin}/payhere-demo/${orderNumber}`;

  window.open(
    demoUrl,
    '_blank',
    'noopener,noreferrer'
  );

  await refreshCart();

  return;
}

  } catch (err) {
    setError(
      err.response?.data?.message ||
        err.message ||
        'Unable to place your order.'
    );

    setSubmitting(false);
  }
};

  // ================================
  // LOADING
  // ================================

  if (loading) {
    return (
      <section className="section container checkout-page">
        <div className="checkout-loading">
          Loading your checkout...
        </div>
      </section>
    );
  }

  // ================================
  // EMPTY CART
  // ================================

  if (items.length === 0) {
    return (
      <section className="section container checkout-page">
        <div className="checkout-empty">

          <span className="hero-eyebrow">
            Checkout
          </span>

          <h1>Your cart is empty</h1>

          <p>
            Add some handmade pieces before continuing
            to checkout.
          </p>

          <Link
            to="/"
            className="btn btn-primary"
          >
            Continue Shopping
          </Link>

        </div>
      </section>
    );
  }

  // ================================
  // CHECKOUT PAGE
  // ================================

  return (
    <section className="section container checkout-page">

      {/* HEADER */}
      <div className="checkout-header">

        <div>

          <span className="hero-eyebrow">
            Checkout
          </span>

          <h1>
            Complete Your Order
          </h1>

          <p>
            Enter your delivery details and review
            your order before placing it.
          </p>

        </div>

        <Link
          to="/cart"
          className="back-link"
        >
          &larr; Back to cart
        </Link>

      </div>

      {/* ERROR */}
      {error && (
        <div
          className="checkout-error"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="checkout-layout">

        {/* ==========================
            LEFT SIDE
        ========================== */}

        <form
          id="checkout-form"
          className="checkout-form"
          onSubmit={handleSubmit}
        >

          {/* CUSTOMER DETAILS */}
          <div className="checkout-card">

            <span className="checkout-card-label">
              01 · Customer
            </span>

            <h2>
              Customer Details
            </h2>

            <div className="checkout-form-grid">

              <label className="checkout-field">

                <span>
                  Full name
                </span>

                <input
                  name="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  autoComplete="name"
                  required
                />

              </label>

              <label className="checkout-field">

                <span>
                  Email address
                </span>

                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />

              </label>

              <label className="checkout-field">

                <span>
                  Phone number
                </span>

                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="07X XXX XXXX"
                  autoComplete="tel"
                  required
                />

              </label>

            </div>

          </div>

          {/* DELIVERY */}
          <div className="checkout-card">

            <span className="checkout-card-label">
              02 · Delivery
            </span>

            <h2>
              Delivery Address
            </h2>

            <div className="checkout-form-grid">

              <label className="checkout-field checkout-field-full">

                <span>
                  Street address
                </span>

                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="House number, street and area"
                  rows="3"
                  autoComplete="street-address"
                  required
                />

              </label>

              <label className="checkout-field">

                <span>
                  City
                </span>

                <input
                  name="city"
                  type="text"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Colombo"
                  autoComplete="address-level2"
                  required
                />

              </label>

              <label className="checkout-field">

                <span>
                  Postal code
                </span>

                <input
                  name="postalCode"
                  type="text"
                  value={form.postalCode}
                  onChange={handleChange}
                  placeholder="00100"
                  autoComplete="postal-code"
                  required
                />

              </label>

            </div>

          </div>

          {/* ==========================
              PAYMENT METHOD
          ========================== */}

          <div className="checkout-card">

            <span className="checkout-card-label">
              03 · Payment
            </span>

            <h2>
              Payment Method
            </h2>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                marginTop: '20px',
              }}
            >

              {/* CASH ON DELIVERY */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  border:
                    paymentMethod === 'cash_on_delivery'
                      ? '2px solid #17324d'
                      : '1px solid #ddd',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  background:
                    paymentMethod === 'cash_on_delivery'
                      ? '#f7f3e8'
                      : '#fff',
                }}
              >

                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash_on_delivery"
                  checked={
                    paymentMethod ===
                    'cash_on_delivery'
                  }
                  onChange={(event) =>
                    setPaymentMethod(
                      event.target.value
                    )
                  }
                />

                <span>
                  <strong>
                    Cash on Delivery
                  </strong>

                  <br />

                  <small>
                    Pay when your order is delivered.
                  </small>
                </span>

              </label>

              {/* PAYHERE */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  border:
                    paymentMethod === 'payhere'
                      ? '2px solid #17324d'
                      : '1px solid #ddd',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  background:
                    paymentMethod === 'payhere'
                      ? '#f7f3e8'
                      : '#fff',
                }}
              >

                <input
                  type="radio"
                  name="paymentMethod"
                  value="payhere"
                  checked={
                    paymentMethod === 'payhere'
                  }
                  onChange={(event) =>
                    setPaymentMethod(
                      event.target.value
                    )
                  }
                />

                <span>
                  <strong>
                    PayHere
                  </strong>

                  <br />

                  <small>
                    Pay securely online using PayHere.
                  </small>
                </span>

              </label>

            </div>

          </div>

          {/* SAVE */}
          <div className="checkout-save-area">

            <button
              type="button"
              className="btn btn-primary save-checkout-btn"
              onClick={handleSave}
            >
              {saved ? 'Saved' : 'Save'}
            </button>

          </div>

        </form>

        {/* ==========================
            RIGHT SIDE
        ========================== */}

        <aside className="checkout-summary">

          <div className="summary-card">

            <span className="hero-eyebrow">
              Your order
            </span>

            <h2>
              Order Summary
            </h2>

            {/* ORDER ITEMS */}
            <div className="checkout-summary-items">

              {items.map((item) => {
                const product = item.product;

                const quantity =
                  Number(item.quantity || 0);

                const price =
                  Number(product?.price || 0);

                const itemTotal =
                  price * quantity;

                return (
                  <div
                    className="checkout-summary-item"
                    key={
                      product?._id ||
                      item._id
                    }
                  >

                    <div>

                      <strong>
                        {product?.name ||
                          'Product'}
                      </strong>

                      <span>
                        {quantity} × LKR{' '}
                        {price.toLocaleString()}
                      </span>

                    </div>

                    <strong>
                      LKR{' '}
                      {itemTotal.toLocaleString()}
                    </strong>

                  </div>
                );
              })}

            </div>

            {/* SUBTOTAL */}
            <div className="summary-line">

              <span>
                Subtotal
              </span>

              <strong>
                LKR {subtotal.toLocaleString()}
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

            <div className="summary-divider" />

            {/* TOTAL */}
            <div className="summary-total">

              <span>
                Total
              </span>

              <strong>
                LKR {total.toLocaleString()}
              </strong>

            </div>

            {/* PAYMENT METHOD SUMMARY */}
            <div
              style={{
                marginTop: '18px',
                padding: '12px',
                background: '#f7f3e8',
                borderRadius: '8px',
              }}
            >

              <small>
                Payment Method
              </small>

              <br />

              <strong>
                {paymentMethod === 'payhere'
                  ? 'PayHere'
                  : 'Cash on Delivery'}
              </strong>

            </div>

            {/* DELIVERY MESSAGE */}
            {subtotal < FREE_DELIVERY_LIMIT && (
              <p className="delivery-note">

                Add LKR{' '}
                {(
                  FREE_DELIVERY_LIMIT -
                  subtotal
                ).toLocaleString()}{' '}

                more for free delivery.

              </p>
            )}

            {subtotal >= FREE_DELIVERY_LIMIT && (
              <p className="free-delivery-note">

                ✓ You qualify for free delivery.

              </p>
            )}

            {/* PLACE ORDER */}
            <button
              type="submit"
              form="checkout-form"
              className="btn btn-primary place-order-btn"
              disabled={submitting}
            >

              {submitting
                ? 'Processing...'
                : paymentMethod === 'payhere'
                  ? 'Continue with PayHere'
                  : 'Place Order'}

            </button>

            <p className="secure-note">

              {paymentMethod === 'payhere'
                ? 'You will continue to secure online payment after placing your order.'
                : 'Your order is prepared directly with our independent artisans.'}

            </p>

          </div>

        </aside>

      </div>

    </section>
  );
}

export default Checkout;