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

import { useAuth } from './context/AuthContext';


const CartContext = createContext(null);


export function CartProvider({
  children,
}) {
  const {
    isAuthenticated,
  } = useAuth();

  const [cart, setCart] = useState({
    items: [],
  });

  const [loading, setLoading] =
    useState(true);


  // ======================================================
  // CART QUANTITY
  // ======================================================

  const cartQty =
    cart?.items?.reduce(
      (total, item) =>
        total +
        Number(item.quantity || 0),
      0
    ) || 0;


  // ======================================================
  // FETCH CART
  // ======================================================

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart({
        items: [],
      });

      setLoading(false);

      return;
    }

    try {
      setLoading(true);

      const data =
        await getCart();

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


  // ======================================================
  // REFRESH WHEN LOGIN / LOGOUT CHANGES
  // ======================================================

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);


  // ======================================================
  // ADD ITEM
  // ======================================================

  const addItem = async (
    productId,
    quantity = 1
  ) => {

    if (!isAuthenticated) {
      throw new Error(
        'Please sign in before adding items to your cart'
      );
    }

    const updatedCart =
      await addToCart(
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


  // ======================================================
  // UPDATE QUANTITY
  // ======================================================

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


  // ======================================================
  // REMOVE ITEM
  // ======================================================

  const removeItem = async (
    productId
  ) => {

    await removeFromCart(
      productId
    );

    const updatedCart =
      await getCart();

    setCart(
      updatedCart || {
        items: [],
      }
    );

    return updatedCart;
  };


  // ======================================================
  // CLEAR CART
  // ======================================================

  const clearAll = async () => {

    await clearCart();

    setCart({
      items: [],
    });

  };


  // ======================================================
  // MANUAL REFRESH
  // ======================================================

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
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      'useCart must be used inside CartProvider'
    );
  }

  return context;
}