const API_URL = 'http://localhost:5000/api/cart';


// ======================================================
// GET JWT TOKEN
// ======================================================

const getToken = () => {
  // Most common token names
  let token =
    localStorage.getItem('token') ||
    localStorage.getItem('authToken') ||
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('token') ||
    sessionStorage.getItem('authToken') ||
    sessionStorage.getItem('accessToken');

  // If authentication was saved as one JSON object
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
// GET CART
// GET /api/cart
// ======================================================

export const getCart = async () => {
  const response = await fetch(
    API_URL,
    {
      method: 'GET',
      headers: getHeaders(),
    }
  );

  return handleResponse(
    response,
    'Failed to fetch cart'
  );
};


// ======================================================
// ADD PRODUCT TO CART
// POST /api/cart
// ======================================================

export const addToCart = async (
  productId,
  quantity = 1
) => {
  const response = await fetch(
    API_URL,
    {
      method: 'POST',

      headers: getHeaders(),

      body: JSON.stringify({
        productId,
        quantity,
      }),
    }
  );

  return handleResponse(
    response,
    'Failed to add product to cart'
  );
};


// ======================================================
// UPDATE CART ITEM
// PUT /api/cart/:productId
// ======================================================

export const updateCartItem = async (
  productId,
  quantity
) => {
  const response = await fetch(
    `${API_URL}/${productId}`,
    {
      method: 'PUT',

      headers: getHeaders(),

      body: JSON.stringify({
        quantity,
      }),
    }
  );

  return handleResponse(
    response,
    'Failed to update cart'
  );
};


// ======================================================
// REMOVE PRODUCT
// DELETE /api/cart/:productId
// ======================================================

export const removeFromCart = async (
  productId
) => {
  const response = await fetch(
    `${API_URL}/${productId}`,
    {
      method: 'DELETE',

      headers: getHeaders(),
    }
  );

  return handleResponse(
    response,
    'Failed to remove product'
  );
};


// ======================================================
// CLEAR CART
// DELETE /api/cart
// ======================================================

export const clearCart = async () => {
  const response = await fetch(
    API_URL,
    {
      method: 'DELETE',

      headers: getHeaders(),
    }
  );

  return handleResponse(
    response,
    'Failed to clear cart'
  );
};