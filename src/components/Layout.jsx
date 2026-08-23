import Navbar from './Navbar';
import Footer from './Footer';

function Layout({ children }) {
  return (
    <div className="page">
      <div className="announce-bar">
        Free island-wide delivery on orders over LKR 5,000 · Handmade by verified Sri Lankan artisans
      </div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
