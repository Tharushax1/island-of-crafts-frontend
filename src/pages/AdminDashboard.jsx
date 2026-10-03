import { useEffect, useState } from 'react';

function AdminDashboard() {
  const [stats, setStats] = useState(null);

  const [pendingArtisans, setPendingArtisans] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [approvingId, setApprovingId] = useState(null);
  const [updatingProductId, setUpdatingProductId] = useState(null);

  // ===============================
  // GET DASHBOARD STATISTICS
  // ===============================

  const fetchDashboard = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/admin/dashboard',
        {
          headers: {
            'x-mock-role': 'admin',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load dashboard data');
      }

      const data = await response.json();

      setStats(data);

    } catch (err) {
      setError(err.message);
    }
  };


  // ===============================
  // GET PENDING ARTISANS
  // ===============================

  const fetchPendingArtisans = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/admin/artisans/pending',
        {
          headers: {
            'x-mock-role': 'admin',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load pending artisans');
      }

      const data = await response.json();

      setPendingArtisans(data);

    } catch (err) {
      setError(err.message);
    }
  };


  // ===============================
  // GET PENDING PRODUCTS
  // ===============================

  const fetchPendingProducts = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/admin/products/pending',
        {
          headers: {
            'x-mock-role': 'admin',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load pending products');
      }

      const data = await response.json();

      setPendingProducts(data);

    } catch (err) {
      setError(err.message);
    }
  };


  // ===============================
  // LOAD ALL DATA
  // ===============================

  useEffect(() => {

    const loadData = async () => {

      setLoading(true);

      await Promise.all([
        fetchDashboard(),
        fetchPendingArtisans(),
        fetchPendingProducts(),
      ]);

      setLoading(false);
    };

    loadData();

  }, []);


  // ===============================
  // APPROVE ARTISAN
  // ===============================

  const handleApprove = async (artisanId) => {

    try {

      setApprovingId(artisanId);

      const response = await fetch(
        `http://localhost:5000/api/admin/artisans/${artisanId}/approve`,
        {
          method: 'PUT',

          headers: {
            'x-mock-role': 'admin',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to approve artisan');
      }

      // Remove approved artisan from list
      setPendingArtisans((currentArtisans) =>
        currentArtisans.filter(
          (artisan) => artisan._id !== artisanId
        )
      );

      // Update dashboard count
      setStats((currentStats) => ({
        ...currentStats,

        pendingArtisans: Math.max(
          0,
          currentStats.pendingArtisans - 1
        ),
      }));

    } catch (err) {

      setError(err.message);

    } finally {

      setApprovingId(null);
    }
  };


  // ===============================
  // APPROVE / REJECT PRODUCT
  // ===============================

  const handleProductStatus = async (productId, status) => {

    try {

      setUpdatingProductId(productId);

      const response = await fetch(
        `http://localhost:5000/api/products/${productId}/approve`,
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json',
            'x-mock-role': 'admin',
          },

          body: JSON.stringify({
            status: status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      // Remove product after approve / reject
      setPendingProducts((products) =>
        products.filter(
          (product) => product._id !== productId
        )
      );

      // Update pending product count
      setStats((currentStats) => ({
        ...currentStats,

        pendingProducts: Math.max(
          0,
          currentStats.pendingProducts - 1
        ),
      }));

    } catch (err) {

      setError(err.message);

    } finally {

      setUpdatingProductId(null);
    }
  };


  // ===============================
  // LOADING
  // ===============================

  if (loading) {

    return (
      <div style={{ padding: '40px' }}>
        Loading dashboard...
      </div>
    );
  }


  // ===============================
  // ERROR
  // ===============================

  if (error) {

    return (
      <div style={{ padding: '40px' }}>
        Error: {error}
      </div>
    );
  }


  // ===============================
  // PAGE
  // ===============================

  return (

    <div style={{ padding: '40px' }}>

      <h1>Admin Dashboard</h1>


      {/* ===============================
          DASHBOARD CARDS
      =============================== */}

      <div
        style={{
          display: 'grid',

          gridTemplateColumns:
            'repeat(auto-fit, minmax(220px, 1fr))',

          gap: '20px',

          marginTop: '30px',
        }}
      >

        <div style={cardStyle}>
          <h3>Total Products</h3>

          <p>{stats.totalProducts}</p>
        </div>


        <div style={cardStyle}>
          <h3>Pending Products</h3>

          <p>{stats.pendingProducts}</p>
        </div>


        <div style={cardStyle}>
          <h3>Total Artisans</h3>

          <p>{stats.totalArtisans}</p>
        </div>


        <div style={cardStyle}>
          <h3>Pending Artisans</h3>

          <p>{stats.pendingArtisans}</p>
        </div>


        <div style={cardStyle}>
          <h3>Total Orders</h3>

          <p>{stats.totalOrders}</p>
        </div>


        <div style={cardStyle}>
          <h3>Paid Orders</h3>

          <p>{stats.paidOrders}</p>
        </div>


        <div style={cardStyle}>
          <h3>Total Revenue</h3>

          <p>
            LKR {stats.totalRevenue}
          </p>
        </div>

      </div>


      {/* ===============================
          PENDING ARTISANS
      =============================== */}

      <div style={{ marginTop: '50px' }}>

        <h2>
          Pending Artisan Approvals
        </h2>


        {pendingArtisans.length === 0 ? (

          <p>
            No pending artisans.
          </p>

        ) : (

          <div style={{ marginTop: '20px' }}>

            {pendingArtisans.map((artisan) => (

              <div
                key={artisan._id}
                style={artisanCardStyle}
              >

                <div>

                  <h3
                    style={{
                      marginBottom: '8px',
                    }}
                  >
                    {artisan.storeName}
                  </h3>


                  <p>
                    <strong>
                      Specialty:
                    </strong>{' '}

                    {artisan.craftSpecialty ||
                      'Not provided'}
                  </p>


                  <p>
                    <strong>
                      Location:
                    </strong>{' '}

                    {artisan.location ||
                      'Not provided'}
                  </p>


                  <p>
                    <strong>
                      Bio:
                    </strong>{' '}

                    {artisan.bio ||
                      'Not provided'}
                  </p>

                </div>


                <button
                  onClick={() =>
                    handleApprove(
                      artisan._id
                    )
                  }

                  disabled={
                    approvingId ===
                    artisan._id
                  }

                  style={approveButtonStyle}
                >

                  {approvingId === artisan._id
                    ? 'Approving...'
                    : 'Approve'}

                </button>

              </div>

            ))}

          </div>

        )}

      </div>


      {/* ===============================
          PENDING PRODUCTS
      =============================== */}

      <div style={{ marginTop: '50px' }}>

        <h2>
          Pending Product Approvals
        </h2>


        {pendingProducts.length === 0 ? (

          <p>
            No pending products.
          </p>

        ) : (

          <div style={{ marginTop: '20px' }}>

            {pendingProducts.map((product) => (

              <div
                key={product._id}
                style={artisanCardStyle}
              >

                <div>

                  <h3
                    style={{
                      marginBottom: '8px',
                    }}
                  >
                    {product.name}
                  </h3>


                  <p>
                    <strong>
                      Price:
                    </strong>{' '}

                    LKR {product.price}
                  </p>


                  <p>
                    <strong>
                      Stock:
                    </strong>{' '}

                    {product.stock}
                  </p>


                  <p>
                    <strong>
                      Category:
                    </strong>{' '}

                    {product.category?.name ||
                      'Not provided'}
                  </p>


                  <p>
                    <strong>
                      Artisan:
                    </strong>{' '}

                    {product.artisan?.name ||
                      'Not provided'}
                  </p>


                  <p>
                    <strong>
                      Description:
                    </strong>{' '}

                    {product.description}
                  </p>

                </div>


                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                  }}
                >

                  <button
                    onClick={() =>
                      handleProductStatus(
                        product._id,
                        'approved'
                      )
                    }

                    disabled={
                      updatingProductId ===
                      product._id
                    }

                    style={approveButtonStyle}
                  >

                    {updatingProductId ===
                    product._id
                      ? 'Updating...'
                      : 'Approve'}

                  </button>


                  <button
                    onClick={() =>
                      handleProductStatus(
                        product._id,
                        'rejected'
                      )
                    }

                    disabled={
                      updatingProductId ===
                      product._id
                    }

                    style={rejectButtonStyle}
                  >

                    Reject

                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}


// ===============================
// DASHBOARD CARD STYLE
// ===============================

const cardStyle = {

  background: '#fff',

  padding: '20px',

  borderRadius: '12px',

  boxShadow:
    '0 2px 10px rgba(0,0,0,0.1)',
};


// ===============================
// APPROVAL ITEM STYLE
// ===============================

const artisanCardStyle = {

  background: '#fff',

  padding: '20px',

  borderRadius: '12px',

  marginBottom: '15px',

  boxShadow:
    '0 2px 10px rgba(0,0,0,0.08)',

  display: 'flex',

  justifyContent: 'space-between',

  alignItems: 'center',

  gap: '20px',
};


// ===============================
// APPROVE BUTTON
// ===============================

const approveButtonStyle = {

  background: '#17324d',

  color: '#fff',

  border: 'none',

  padding: '12px 22px',

  borderRadius: '8px',

  cursor: 'pointer',

  fontWeight: 'bold',
};


// ===============================
// REJECT BUTTON
// ===============================

const rejectButtonStyle = {

  background: '#b42318',

  color: '#fff',

  border: 'none',

  padding: '12px 22px',

  borderRadius: '8px',

  cursor: 'pointer',

  fontWeight: 'bold',
};


export default AdminDashboard;