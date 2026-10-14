import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getOrder } from '../services/orderApi';

function OrderConfirmation() {
  const { orderNumber } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await getOrder(orderNumber);
        setOrder(data);
      } catch (err) {
        setError(err.message || 'Unable to load your order.');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderNumber]);

  if (loading) {
    return (
      <section className="section container order-confirmation">
        <p>Loading your order...</p>
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className="section container order-confirmation">
        <div className="confirmation-card">
          <span className="hero-eyebrow">Order</span>
          <h1>We could not find that order</h1>
          <p>{error || 'Please return to the shop and try again.'}</p>
          <Link to="/" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section container order-confirmation">
      <div className="confirmation-card">
        <div className="confirmation-icon">✓</div>

        <span className="hero-eyebrow">
          Order Confirmed
        </span>

        <h1>Thank you for your order.</h1>

        <p className="confirmation-intro">
          Your handmade pieces are now being prepared
          for delivery by our independent artisans.
        </p>

        <div className="confirmation-order-number">
          <span>Order number</span>
          <strong>{order.orderNumber}</strong>
        </div>

        <div className="confirmation-details">
          <div>
            <span>Status</span>
            <strong>{order.status}</strong>
          </div>

          <div>
            <span>Payment</span>
            <strong>Cash on Delivery</strong>
          </div>

          <div>
            <span>Total</span>
            <strong>
              LKR {order.total.toLocaleString()}
            </strong>
          </div>
        </div>

        <div className="confirmation-section">
          <h2>Delivery Details</h2>

          <p>
            <strong>{order.shippingAddress.fullName}</strong>
            <br />
            {order.shippingAddress.address}
            <br />
            {order.shippingAddress.city}{' '}
            {order.shippingAddress.postalCode}
            <br />
            {order.shippingAddress.phone}
          </p>

          {order.customerEmail && (
            <p>{order.customerEmail}</p>
          )}
        </div>

        <div className="confirmation-section">
          <h2>Items</h2>

          <div className="confirmation-items">
            {order.items.map((item) => (
              <div
                className="confirmation-item"
                key={item._id}
              >
                <div>
                  <strong>{item.productName}</strong>
                  <span>
                    {item.quantity} × LKR{' '}
                    {item.price.toLocaleString()}
                  </span>
                </div>

                <strong>
                  LKR {item.subtotal.toLocaleString()}
                </strong>
              </div>
            ))}
          </div>
        </div>

        <div className="confirmation-total">
          <span>Total</span>
          <strong>
            LKR {order.total.toLocaleString()}
          </strong>
        </div>

        <Link to="/" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    </section>
  );
}

export default OrderConfirmation;
