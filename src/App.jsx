import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './CartContext';

// Main pages
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import ArtisanStorefront from './pages/ArtisanStorefront';
import ArtisansList from './pages/ArtisansList';
import CustomRequestForm from './pages/CustomRequestForm';
import MyRequests from './pages/MyRequests';
import About from './pages/About';

// Authentication
import Login from './pages/Login';
import Register from './pages/Register';

// Cart & Orders
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';

// Admin
import AdminDashboard from './pages/AdminDashboard';

// Payment
import PaymentSuccess from './pages/PaymentSuccess';
import PayHereDemo from './pages/PayHereDemo';


function App() {
  return (
    <AuthProvider>
      <CartProvider>

        <BrowserRouter>

          <Layout>

            <Routes>

              {/* ==========================
                  PUBLIC PAGES
              ========================== */}

              <Route
                path="/"
                element={<ProductList />}
              />

              <Route
                path="/products/:id"
                element={<ProductDetail />}
              />

              <Route
                path="/artisans"
                element={<ArtisansList />}
              />

              <Route
                path="/store/:storeSlug"
                element={<ArtisanStorefront />}
              />

              <Route
                path="/about"
                element={<About />}
              />


              {/* ==========================
                  AUTHENTICATION
              ========================== */}

              <Route
                path="/login"
                element={<Login />}
              />

              <Route
                path="/register"
                element={<Register />}
              />


              {/* ==========================
                  CUSTOMER - CUSTOM REQUESTS
              ========================== */}

              <Route
                path="/requests"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <MyRequests />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/request/:artisanId"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <CustomRequestForm />
                  </ProtectedRoute>
                }
              />


              {/* ==========================
                  CART
              ========================== */}

              <Route
                path="/cart"
                element={<Cart />}
              />


              {/* ==========================
                  CHECKOUT
              ========================== */}

              <Route
                path="/checkout"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <Checkout />
                  </ProtectedRoute>
                }
              />


              {/* ==========================
                  ORDER CONFIRMATION
              ========================== */}

              <Route
                path="/order-confirmation/:orderNumber"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <OrderConfirmation />
                  </ProtectedRoute>
                }
              />


              {/* ==========================
                  PAYMENT
              ========================== */}

              <Route
                path="/payment-success/:orderNumber"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <PaymentSuccess />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/payhere-demo/:orderNumber"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <PayHereDemo />
                  </ProtectedRoute>
                }
              />


              {/* ==========================
                  ADMIN
              ========================== */}

              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />


              {/* ==========================
                  ARTISAN
              ========================== */}

              <Route
                path="/artisan"
                element={
                  <ProtectedRoute allowedRoles={['artisan']}>
                    <div>
                      Artisan Dashboard
                    </div>
                  </ProtectedRoute>
                }
              />

            </Routes>

          </Layout>

        </BrowserRouter>

      </CartProvider>
    </AuthProvider>
  );
}

export default App;