import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import ArtisanStorefront from './pages/ArtisanStorefront';
import ArtisansList from './pages/ArtisansList';
import CustomRequestForm from './pages/CustomRequestForm';
import MyRequests from './pages/MyRequests';
import About from './pages/About';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/artisans" element={<ArtisansList />} />
          <Route path="/store/:storeSlug" element={<ArtisanStorefront />} />
          <Route path="/request/:artisanId" element={<CustomRequestForm />} />
          <Route path="/requests" element={<MyRequests />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
