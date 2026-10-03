import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  getOrder,
  demoPayOrder,
} from '../services/orderApi';

function PayHereDemo() {
  const { orderNumber } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const [card, setCard] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await getOrder(orderNumber);
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderNumber]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setCard((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handlePayment = async (event) => {
    event.preventDefault();

    if (
      !card.number ||
      !card.expiry ||
      !card.cvc ||
      !card.name
    ) {
      setError('Please complete all demo card details.');
      return;
    }

    try {
      setProcessing(true);
      setError('');

      await demoPayOrder(orderNumber);

      navigate(
        `/payment-success/${orderNumber}`,
        {
          replace: true,
        }
      );
    } catch (err) {
      setError(
        err.message || 'Demo payment failed'
      );

      setProcessing(false);
    }
  };

  if (loading) {
    return <div style={loadingStyle}>Loading payment...</div>;
  }

  if (!order) {
    return <div style={loadingStyle}>Order not found.</div>;
  }

  return (
    <div style={pageStyle}>

      <div style={paymentCardStyle}>

        {/* BLUE HEADER */}
        <div style={headerStyle}>

          <div style={logoStyle}>
            <span style={{ color: '#1747d1' }}>Pay</span>
            <span style={{ color: '#f5a400' }}>Here</span>
          </div>

          <div>
            <h2 style={merchantStyle}>
              Island of Crafts
            </h2>

            <div style={orderTextStyle}>
              Island of Crafts Order {orderNumber}
            </div>

            <div style={amountStyle}>
              Rs. {Number(order.total).toLocaleString()}.00
            </div>
          </div>

        </div>

        {/* BODY */}
        <div style={bodyStyle}>

          <div style={iconStyle}>
            ✓
          </div>

          <h2 style={{ marginBottom: '5px' }}>
            PayHere Sandbox Demo
          </h2>

          <p style={demoTextStyle}>
            University Project Demo — No real payment is processed.
          </p>

          {error && (
            <div style={errorStyle}>
              {error}
            </div>
          )}

          <form onSubmit={handlePayment}>

            <div style={paymentOptionStyle}>
              <input
                type="radio"
                checked
                readOnly
              />

              <div>
                <strong>Pay with Card</strong>
                <div style={smallTextStyle}>
                  Visa · MasterCard · Amex
                </div>
              </div>
            </div>

            <input
              style={inputStyle}
              type="text"
              name="number"
              value={card.number}
              onChange={handleChange}
              placeholder="Card Number"
              maxLength="19"
            />

            <div style={twoColumnStyle}>

              <input
                style={inputStyle}
                type="text"
                name="expiry"
                value={card.expiry}
                onChange={handleChange}
                placeholder="MM / YY"
                maxLength="5"
              />

              <input
                style={inputStyle}
                type="password"
                name="cvc"
                value={card.cvc}
                onChange={handleChange}
                placeholder="CVC"
                maxLength="4"
              />

            </div>

            <input
              style={inputStyle}
              type="text"
              name="name"
              value={card.name}
              onChange={handleChange}
              placeholder="Cardholder Name"
            />

            <button
              type="submit"
              disabled={processing}
              style={payButtonStyle}
            >
              {processing
                ? 'Processing Demo Payment...'
                : 'Complete Demo Payment →'}
            </button>

          </form>

          <div style={noticeStyle}>
            ⓘ This is a demo payment flow for presentation purposes.
          </div>

        </div>

        <div style={footerStyle}>
          PayHere Sandbox Demo Integration
        </div>

      </div>

    </div>
  );
}


// ==============================
// STYLES
// ==============================

const pageStyle = {
  minHeight: '100vh',
  background:
    'linear-gradient(135deg, #eef3f8, #dce4ed)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  padding: '35px 20px',
  fontFamily: 'Arial, sans-serif',
};

const paymentCardStyle = {
  width: '520px',
  maxWidth: '100%',
  background: '#fff',
  borderRadius: '22px',
  overflow: 'hidden',
  boxShadow: '0 18px 50px rgba(0,0,0,0.14)',
};

const headerStyle = {
  background:
    'linear-gradient(135deg, #1645d5, #2458ef)',
  color: '#fff',
  padding: '28px',
  display: 'flex',
  alignItems: 'center',
  gap: '24px',
};

const logoStyle = {
  width: '120px',
  height: '120px',
  background: '#fff',
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '26px',
  fontWeight: '800',
  fontStyle: 'italic',
  flexShrink: 0,
};

const merchantStyle = {
  margin: '0 0 6px 0',
  fontSize: '28px',
};

const orderTextStyle = {
  fontSize: '14px',
  opacity: 0.85,
  marginBottom: '12px',
};

const amountStyle = {
  fontSize: '30px',
  fontWeight: '800',
};

const bodyStyle = {
  padding: '38px 32px',
  textAlign: 'center',
};

const iconStyle = {
  width: '70px',
  height: '70px',
  margin: '0 auto 15px',
  borderRadius: '50%',
  background: '#35b779',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '34px',
};

const demoTextStyle = {
  color: '#697386',
  marginBottom: '28px',
};

const paymentOptionStyle = {
  border: '1px solid #d7e0ea',
  borderRadius: '10px',
  padding: '15px',
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
  textAlign: 'left',
  marginBottom: '16px',
  background: '#f8faff',
};

const smallTextStyle = {
  color: '#7a8494',
  marginTop: '4px',
  fontSize: '14px',
};

const inputStyle = {
  boxSizing: 'border-box',
  width: '100%',
  padding: '15px',
  marginBottom: '12px',
  border: '1px solid #ccd5df',
  borderRadius: '9px',
  fontSize: '16px',
  outline: 'none',
};

const twoColumnStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px',
};

const payButtonStyle = {
  width: '100%',
  border: 'none',
  borderRadius: '9px',
  padding: '16px',
  marginTop: '8px',
  background:
    'linear-gradient(135deg, #1748dc, #245af2)',
  color: '#fff',
  fontSize: '17px',
  fontWeight: '700',
  cursor: 'pointer',
};

const noticeStyle = {
  marginTop: '17px',
  background: '#f4f6f8',
  color: '#667085',
  borderRadius: '8px',
  padding: '13px',
  fontSize: '13px',
};

const errorStyle = {
  padding: '12px',
  marginBottom: '15px',
  background: '#fff0f0',
  color: '#b42318',
  borderRadius: '8px',
};

const footerStyle = {
  padding: '17px',
  textAlign: 'center',
  background: '#fafafa',
  color: '#9aa4b2',
  fontSize: '12px',
};

const loadingStyle = {
  padding: '50px',
  textAlign: 'center',
};


export default PayHereDemo;