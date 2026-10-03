import { Link, useParams } from 'react-router-dom';

function PaymentSuccess() {
  const { orderNumber } = useParams();

  return (
    <section
      className="section container"
      style={{
        textAlign: 'center',
        paddingTop: '80px',
        paddingBottom: '80px',
      }}
    >
      <div
        style={{
          maxWidth: '650px',
          margin: '0 auto',
          background: '#fff',
          padding: '50px',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}
      >
        <div
          style={{
            fontSize: '60px',
            marginBottom: '20px',
          }}
        >
          ✓
        </div>

        <span className="hero-eyebrow">
          Demo Payment
        </span>

        <h1>
          Payment Successful
        </h1>

        <p>
          Your payment has been successfully
          completed in demo mode.
        </p>

        <p>
          <strong>Order Number:</strong>
          <br />
          {orderNumber}
        </p>

        <div
          style={{
            marginTop: '25px',
            padding: '12px',
            background: '#f7f3e8',
            borderRadius: '8px',
          }}
        >
          University Project Demo
          <br />
          No real money was processed.
        </div>

        <Link
          to={`/order-confirmation/${orderNumber}`}
          className="btn btn-primary"
          style={{
            marginTop: '25px',
            display: 'inline-block',
          }}
        >
          View Order
        </Link>
      </div>
    </section>
  );
}

export default PaymentSuccess;