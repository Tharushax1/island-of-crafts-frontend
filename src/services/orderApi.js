const API_URL = 'http://localhost:5000/api/orders';

// Temporary mock customer headers.
// Replace these with the real authentication headers/token later.
const headers = {
  'Content-Type': 'application/json',
  'x-mock-role': 'customer',
  'x-mock-userid': '64f000000000000000000001',
};

export const createOrder = async (orderData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(orderData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create order');
  }

  return data;
};

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
    throw new Error(data.message || 'Failed to fetch order');
  }

  return data;
};
