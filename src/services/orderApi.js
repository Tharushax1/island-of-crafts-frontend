const API_URL = 'http://localhost:5000/api/orders';

// Temporary mock customer headers.
// Real authentication එක connect කළාම මේවා replace කරන්න.
const headers = {
  'Content-Type': 'application/json',
  'x-mock-role': 'customer',
  'x-mock-userid': '64f000000000000000000001',
};


// ===============================
// CREATE ORDER
// ===============================

export const createOrder = async (orderData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(orderData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Failed to create order'
    );
  }

  return data;
};


// ===============================
// GET ORDER
// ===============================

export const getOrder = async (orderNumber) => {
  const response = await fetch(
    `${API_URL}/${encodeURIComponent(orderNumber)}`,
    {
      method: 'GET',
      headers,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Failed to fetch order'
    );
  }

  return data;
};


// ===============================
// GET PAYHERE PAYMENT DETAILS
// ===============================

export const getPayHerePayment = async (
  orderNumber
) => {
  const response = await fetch(
    `${API_URL}/${encodeURIComponent(
      orderNumber
    )}/payhere`,
    {
      method: 'GET',
      headers,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Failed to prepare PayHere payment'
    );
  }

  return data;
};


// ===============================
// REDIRECT TO REAL PAYHERE SANDBOX
// ===============================

export const redirectToPayHere = (
  action,
  payment
) => {
  const form = document.createElement('form');

  form.method = 'POST';
  form.action = action;

  Object.entries(payment).forEach(
    ([key, value]) => {
      const input =
        document.createElement('input');

      input.type = 'hidden';
      input.name = key;

      input.value =
        value === null || value === undefined
          ? ''
          : String(value);

      form.appendChild(input);
    }
  );

  document.body.appendChild(form);

  form.submit();
};


// ===============================
// DEMO PAYHERE PAYMENT
// University project demo only
// No real money is processed
// ===============================

export const demoPayOrder = async (
  orderNumber
) => {
  const response = await fetch(
    `${API_URL}/${encodeURIComponent(
      orderNumber
    )}/demo-pay`,
    {
      method: 'POST',
      headers,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Demo payment failed'
    );
  }

  return data;
};