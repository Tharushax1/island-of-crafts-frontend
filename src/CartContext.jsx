import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from './services/cartApi';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({
    items: [],
  });

  const [loading, setLoading] = useState(true);

  // Calculate TOTAL UNITS
  const cartQty =
    cart?.items?.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    ) || 0;

  // Load cart
  const fetchCart = async () => {
    try {
      const data = await getCart();

      setCart(
        data || {
          items: [],
        }
      );
    } catch (error) {
      console.error(
        'Failed to load cart:',
        error
      );

      setCart({
        items: [],
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchCart();
  }, []);

  // ADD
  const addItem = async (
    productId,
    quantity = 1
  ) => {
    const updatedCart = await addToCart(
      productId,
      quantity
    );

    setCart(
      updatedCart || {
        items: [],
      }
    );

    return updatedCart;
  };

  // UPDATE QUANTITY
  const updateItem = async (
    productId,
    quantity
  ) => {
    const updatedCart =
      await updateCartItem(
        productId,
        quantity
      );

    setCart(
      updatedCart || {
        items: [],
      }
    );

    return updatedCart;
  };

  // REMOVE
  const removeItem = async (productId) => {
    await removeFromCart(productId);

    // IMPORTANT:
    // Fetch the complete cart again.
    const updatedCart = await getCart();

    setCart(
      updatedCart || {
        items: [],
      }
    );

    return updatedCart;
  };

  // CLEAR
  const clearAll = async () => {
    await clearCart();

    // Immediately make Navbar quantity 0
    setCart({
      items: [],
    });
  };

  // Manual refresh
  const refreshCart = async () => {
    await fetchCart();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartQty,
        loading,

        addItem,
        updateItem,
        removeItem,
        clearAll,

        refreshCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      'useCart must be used inside CartProvider'
    );
  }

  return context;
}