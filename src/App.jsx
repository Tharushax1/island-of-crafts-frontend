import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import ArtisanStorefront from './pages/ArtisanStorefront';
import CustomRequestForm from './pages/CustomRequestForm';
import MyRequests from './pages/MyRequests';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/store/:storeSlug" element={<ArtisanStorefront />} />
        <Route path="/request/:artisanId" element={<CustomRequestForm />} />
        <Route path="/requests" element={<MyRequests />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
