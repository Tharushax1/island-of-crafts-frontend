const API_URL = 'http://localhost:5000/api/cart';

// Temporary mock customer headers
// Later these will come from your real authentication system.
const headers = {
  'Content-Type': 'application/json',
  'x-mock-role': 'customer',
  'x-mock-userid': '64f000000000000000000001',
};

// GET CART
export const getCart = async () => {
  const response = await fetch(API_URL, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch cart');
  }

  return response.json();
};

// ADD PRODUCT
export const addToCart = async (productId, quantity = 1) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      productId,
      quantity,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to add product to cart');
  }

  return response.json();
};

// UPDATE QUANTITY
export const updateCartItem = async (productId, quantity) => {
  const response = await fetch(`${API_URL}/${productId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      quantity,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update cart');
  }

  return response.json();
};

// REMOVE PRODUCT
export const removeFromCart = async (productId) => {
  const response = await fetch(`${API_URL}/${productId}`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to remove product');
  }

  return response.json();
};

// CLEAR CART
export const clearCart = async () => {
  const response = await fetch(API_URL, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to clear cart');
  }

  return response.json();
};