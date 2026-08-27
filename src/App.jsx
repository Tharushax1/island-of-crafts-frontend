import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import { AuthProvider } from './context/AuthContext';

import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import ArtisanStorefront from './pages/ArtisanStorefront';
import ArtisansList from './pages/ArtisansList';
import CustomRequestForm from './pages/CustomRequestForm';
import MyRequests from './pages/MyRequests';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>

            {/* Public pages */}
            <Route path="/" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/artisans" element={<ArtisansList />} />
            <Route path="/store/:storeSlug" element={<ArtisanStorefront />} />
            <Route path="/about" element={<About />} />

            {/* Authentication */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected customer page */}
            <Route
              path="/requests"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <MyRequests />
                </ProtectedRoute>
              }
            />

            {/* Protected custom request */}
            <Route
              path="/request/:artisanId"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomRequestForm />
                </ProtectedRoute>
              }
            />

            {/* Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <div>Admin Dashboard</div>
                </ProtectedRoute>
              }
            />

            {/* Artisan */}
            <Route
              path="/artisan"
              element={
                <ProtectedRoute allowedRoles={['artisan']}>
                  <div>Artisan Dashboard</div>
                </ProtectedRoute>
              }
            />

          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;