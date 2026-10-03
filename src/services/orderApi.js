const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

const API_URL = `${API_BASE_URL}/orders`;


// ======================================================
// GET JWT TOKEN
// ======================================================

const getToken = () => {
  let token =
    localStorage.getItem('token') ||
    localStorage.getItem('authToken') ||
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('token') ||
    sessionStorage.getItem('authToken') ||
    sessionStorage.getItem('accessToken');

  if (!token) {
    try {
      const authData =
        localStorage.getItem('auth') ||
        localStorage.getItem('user');

      if (authData) {
        const parsed = JSON.parse(authData);

        token =
          parsed?.token ||
          parsed?.authToken ||
          parsed?.accessToken ||
          null;
      }
    } catch (error) {
      console.error(
        'Failed to read authentication token:',
        error
      );
    }
  }

  return token;
};


// ======================================================
// AUTH HEADERS
// ======================================================

const getHeaders = () => {
  const token = getToken();

  return {
    'Content-Type': 'application/json',

    ...(token && {
      Authorization: `Bearer ${token}`,
    }),
  };
};


// ======================================================
// RESPONSE HANDLER
// ======================================================

const handleResponse = async (
  response,
  defaultMessage
) => {
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message || defaultMessage
    );
  }

  return data;
};


// ======================================================
// CREATE ORDER
// ======================================================

export const createOrder = async (
  orderData
) => {
  const response = await fetch(
    API_URL,
    {
      method: 'POST',

      headers: getHeaders(),

      body: JSON.stringify(orderData),
    }
  );

  return handleResponse(
    response,
    'Failed to create order'
  );
};


// ======================================================
// GET ORDER
// ======================================================

export const getOrder = async (
  orderNumber
) => {
  const response = await fetch(
    `${API_URL}/${encodeURIComponent(
      orderNumber
    )}`,
    {
      method: 'GET',

      headers: getHeaders(),
    }
  );

  return handleResponse(
    response,
    'Failed to fetch order'
  );
};


// ======================================================
// GET PAYHERE PAYMENT DETAILS
// ======================================================

export const getPayHerePayment = async (
  orderNumber
) => {
  const response = await fetch(
    `${API_URL}/${encodeURIComponent(
      orderNumber
    )}/payhere`,
    {
      method: 'GET',

      headers: getHeaders(),
    }
  );

  return handleResponse(
    response,
    'Failed to prepare PayHere payment'
  );
};


// ======================================================
// REDIRECT TO PAYHERE
// ======================================================

export const redirectToPayHere = (
  action,
  payment
) => {
  const form =
    document.createElement('form');

  form.method = 'POST';
  form.action = action;

  Object.entries(payment).forEach(
    ([key, value]) => {
      const input =
        document.createElement('input');

      input.type = 'hidden';
      input.name = key;

      input.value =
        value === null ||
        value === undefined
          ? ''
          : String(value);

      form.appendChild(input);
    }
  );

  document.body.appendChild(form);

  form.submit();
};


// ======================================================
// DEMO PAYMENT
// ======================================================

export const demoPayOrder = async (
  orderNumber
) => {
  const response = await fetch(
    `${API_URL}/${encodeURIComponent(
      orderNumber
    )}/demo-pay`,
    {
      method: 'POST',

      headers: getHeaders(),
    }
  );

  return handleResponse(
    response,
    'Demo payment failed'
  );
};