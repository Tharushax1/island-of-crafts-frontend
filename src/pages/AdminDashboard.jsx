import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000';


// ======================================================
// GET JWT TOKEN
// ======================================================

const getToken = () => {
  let token =
    localStorage.getItem('token') ||
    localStorage.getItem('authToken') ||
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('token') ||
    sessionStorage.getItem('authToken') ||
    sessionStorage.getItem('accessToken');

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

const getHeaders = (includeJson = false) => {
  const token = getToken();

  return {
    ...(includeJson && {
      'Content-Type': 'application/json',
    }),

    ...(token && {
      Authorization: `Bearer ${token}`,
    }),
  };
};


function AdminDashboard() {
  const [stats, setStats] = useState(null);

  const [pendingArtisans, setPendingArtisans] =
    useState([]);

  const [pendingProducts, setPendingProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [approvingId, setApprovingId] =
    useState(null);

  const [rejectingId, setRejectingId] =
    useState(null);

  const [
    updatingProductId,
    setUpdatingProductId,
  ] = useState(null);


  // ======================================================
  // DASHBOARD STATISTICS
  // ======================================================

  const fetchDashboard = async () => {
    const response = await fetch(
      `${API_URL}/api/admin/dashboard`,
      {
        headers: getHeaders(),
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message ||
          'Failed to load dashboard data'
      );
    }

    setStats(data);
  };


  // ======================================================
  // PENDING ARTISANS
  // ======================================================

  const fetchPendingArtisans =
    async () => {
      const response = await fetch(
        `${API_URL}/api/admin/artisans/pending`,
        {
          headers: getHeaders(),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            'Failed to load pending artisans'
        );
      }

      // New backend response:
      // { count: number, artisans: [] }
      setPendingArtisans(
        Array.isArray(data)
          ? data
          : data?.artisans || []
      );
    };


  // ======================================================
  // PENDING PRODUCTS
  // ======================================================

  const fetchPendingProducts =
    async () => {
      const response = await fetch(
        `${API_URL}/api/admin/products/pending`,
        {
          headers: getHeaders(),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            'Failed to load pending products'
        );
      }

      setPendingProducts(
        Array.isArray(data)
          ? data
          : []
      );
    };


  // ======================================================
  // LOAD EVERYTHING
  // ======================================================

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        await Promise.all([
          fetchDashboard(),
          fetchPendingArtisans(),
          fetchPendingProducts(),
        ]);

      } catch (err) {

        console.error(
          'Admin dashboard error:',
          err
        );

        setError(
          err.message ||
            'Failed to load admin dashboard'
        );

      } finally {

        setLoading(false);

      }
    };

    loadData();
  }, []);


  // ======================================================
  // APPROVE ARTISAN
  // ======================================================

  const handleApprove = async (
    artisanId
  ) => {
    try {
      setError('');
      setApprovingId(artisanId);

      const response = await fetch(
        `${API_URL}/api/admin/artisans/${artisanId}/approve`,
        {
          method: 'PUT',
          headers: getHeaders(),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            'Failed to approve artisan'
        );
      }

      setPendingArtisans(
        (currentArtisans) =>
          currentArtisans.filter(
            (artisan) =>
              artisan._id !== artisanId
          )
      );

      setStats((currentStats) => {
        if (!currentStats) {
          return currentStats;
        }

        return {
          ...currentStats,

          pendingArtisans:
            Math.max(
              0,
              Number(
                currentStats.pendingArtisans ||
                  0
              ) - 1
            ),
        };
      });

    } catch (err) {

      setError(err.message);

    } finally {

      setApprovingId(null);

    }
  };


  // ======================================================
  // REJECT ARTISAN
  // ======================================================

  const handleReject = async (
    artisanId
  ) => {
    try {
      setError('');
      setRejectingId(artisanId);

      const response = await fetch(
        `${API_URL}/api/admin/artisans/${artisanId}/reject`,
        {
          method: 'PUT',
          headers: getHeaders(),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            'Failed to reject artisan'
        );
      }

      setPendingArtisans(
        (currentArtisans) =>
          currentArtisans.filter(
            (artisan) =>
              artisan._id !== artisanId
          )
      );

      setStats((currentStats) => {
        if (!currentStats) {
          return currentStats;
        }

        return {
          ...currentStats,

          pendingArtisans:
            Math.max(
              0,
              Number(
                currentStats.pendingArtisans ||
                  0
              ) - 1
            ),
        };
      });

    } catch (err) {

      setError(err.message);

    } finally {

      setRejectingId(null);

    }
  };


  // ======================================================
  // APPROVE / REJECT PRODUCT
  // ======================================================

  const handleProductStatus = async (
    productId,
    status
  ) => {
    try {
      setError('');
      setUpdatingProductId(productId);

      const response = await fetch(
        `${API_URL}/api/products/${productId}/approve`,
        {
          method: 'PUT',

          headers: getHeaders(true),

          body: JSON.stringify({
            status,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            'Failed to update product'
        );
      }

      setPendingProducts(
        (products) =>
          products.filter(
            (product) =>
              product._id !== productId
          )
      );

      setStats((currentStats) => {
        if (!currentStats) {
          return currentStats;
        }

        return {
          ...currentStats,

          pendingProducts:
            Math.max(
              0,
              Number(
                currentStats.pendingProducts ||
                  0
              ) - 1
            ),
        };
      });

    } catch (err) {

      setError(err.message);

    } finally {

      setUpdatingProductId(null);

    }
  };


  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={loadingCardStyle}>
          Loading dashboard...
        </div>
      </div>
    );
  }


  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div style={pageStyle}>

      <div style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>
            ISLAND OF CRAFTS
          </p>

          <h1 style={titleStyle}>
            Admin Dashboard
          </h1>

          <p style={subtitleStyle}>
            Manage artisans, products,
            orders and platform activity.
          </p>
        </div>
      </div>


      {/* ERROR */}

      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}


      {/* ==================================================
          DASHBOARD CARDS
      ================================================== */}

      <div style={statsGridStyle}>

        <StatCard
          label="Total Products"
          value={stats?.totalProducts || 0}
        />

        <StatCard
          label="Pending Products"
          value={stats?.pendingProducts || 0}
        />

        <StatCard
          label="Total Artisans"
          value={stats?.totalArtisans || 0}
        />

        <StatCard
          label="Pending Artisans"
          value={stats?.pendingArtisans || 0}
        />

        <StatCard
          label="Total Orders"
          value={stats?.totalOrders || 0}
        />

        <StatCard
          label="Paid Orders"
          value={stats?.paidOrders || 0}
        />

        <StatCard
          label="Total Revenue"
          value={`LKR ${
            Number(
              stats?.totalRevenue || 0
            ).toLocaleString()
          }`}
        />

      </div>


      {/* ==================================================
          PENDING ARTISANS
      ================================================== */}

      <section style={sectionStyle}>

        <div style={sectionHeaderStyle}>
          <div>
            <p style={sectionEyebrowStyle}>
              ARTISAN MANAGEMENT
            </p>

            <h2 style={sectionTitleStyle}>
              Pending Artisan Approvals
            </h2>
          </div>

          <span style={countBadgeStyle}>
            {pendingArtisans.length}
          </span>
        </div>


        {pendingArtisans.length === 0 ? (

          <div style={emptyStyle}>
            No pending artisans.
          </div>

        ) : (

          <div>

            {pendingArtisans.map(
              (artisan) => (

                <div
                  key={artisan._id}
                  style={itemCardStyle}
                >

                  <div
                    style={{
                      flex: 1,
                    }}
                  >

                    <h3
                      style={{
                        margin:
                          '0 0 8px',
                      }}
                    >
                      {artisan.name ||
                        artisan.storeName ||
                        'Unnamed Artisan'}
                    </h3>

                    <p style={detailStyle}>
                      <strong>
                        Email:
                      </strong>{' '}
                      {artisan.email ||
                        'Not provided'}
                    </p>

                    <p style={detailStyle}>
                      <strong>
                        Status:
                      </strong>{' '}
                      {artisan.artisanStatus ||
                        'pending'}
                    </p>

                    {artisan.craftSpecialty && (
                      <p style={detailStyle}>
                        <strong>
                          Specialty:
                        </strong>{' '}
                        {
                          artisan.craftSpecialty
                        }
                      </p>
                    )}

                    {artisan.location && (
                      <p style={detailStyle}>
                        <strong>
                          Location:
                        </strong>{' '}
                        {artisan.location}
                      </p>
                    )}

                  </div>


                  <div style={actionStyle}>

                    <button
                      onClick={() =>
                        handleApprove(
                          artisan._id
                        )
                      }
                      disabled={
                        approvingId ===
                          artisan._id ||
                        rejectingId ===
                          artisan._id
                      }
                      style={
                        approveButtonStyle
                      }
                    >
                      {approvingId ===
                      artisan._id
                        ? 'Approving...'
                        : 'Approve'}
                    </button>


                    <button
                      onClick={() =>
                        handleReject(
                          artisan._id
                        )
                      }
                      disabled={
                        approvingId ===
                          artisan._id ||
                        rejectingId ===
                          artisan._id
                      }
                      style={
                        rejectButtonStyle
                      }
                    >
                      {rejectingId ===
                      artisan._id
                        ? 'Rejecting...'
                        : 'Reject'}
                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </section>


      {/* ==================================================
          PENDING PRODUCTS
      ================================================== */}

      <section style={sectionStyle}>

        <div style={sectionHeaderStyle}>
          <div>
            <p style={sectionEyebrowStyle}>
              PRODUCT MANAGEMENT
            </p>

            <h2 style={sectionTitleStyle}>
              Pending Product Approvals
            </h2>
          </div>

          <span style={countBadgeStyle}>
            {pendingProducts.length}
          </span>
        </div>


        {pendingProducts.length === 0 ? (

          <div style={emptyStyle}>
            No pending products.
          </div>

        ) : (

          <div>

            {pendingProducts.map(
              (product) => (

                <div
                  key={product._id}
                  style={itemCardStyle}
                >

                  <div
                    style={{
                      flex: 1,
                    }}
                  >

                    <h3
                      style={{
                        margin:
                          '0 0 8px',
                      }}
                    >
                      {product.name}
                    </h3>

                    <p style={detailStyle}>
                      <strong>
                        Price:
                      </strong>{' '}
                      LKR{' '}
                      {Number(
                        product.price || 0
                      ).toLocaleString()}
                    </p>

                    <p style={detailStyle}>
                      <strong>
                        Stock:
                      </strong>{' '}
                      {product.stock}
                    </p>

                    <p style={detailStyle}>
                      <strong>
                        Category:
                      </strong>{' '}
                      {product.category
                        ?.name ||
                        'Not provided'}
                    </p>

                    <p style={detailStyle}>
                      <strong>
                        Artisan:
                      </strong>{' '}
                      {product.artisan
                        ?.name ||
                        'Not provided'}
                    </p>

                    <p style={detailStyle}>
                      <strong>
                        Description:
                      </strong>{' '}
                      {product.description}
                    </p>

                  </div>


                  <div style={actionStyle}>

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
                      style={
                        approveButtonStyle
                      }
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
                      style={
                        rejectButtonStyle
                      }
                    >
                      Reject
                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </section>

    </div>
  );
}


// ======================================================
// STAT CARD
// ======================================================

function StatCard({
  label,
  value,
}) {
  return (
    <div style={cardStyle}>

      <p style={cardLabelStyle}>
        {label}
      </p>

      <p style={cardValueStyle}>
        {value}
      </p>

    </div>
  );
}


// ======================================================
// STYLES
// ======================================================

const pageStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '50px 24px 80px',
};

const headerStyle = {
  marginBottom: '34px',
};

const eyebrowStyle = {
  margin: '0 0 8px',
  color: '#c18a32',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '3px',
};

const titleStyle = {
  margin: '0',
  color: '#162b45',
  fontSize: '42px',
};

const subtitleStyle = {
  marginTop: '10px',
  color: '#6d6962',
};

const statsGridStyle = {
  display: 'grid',
  gridTemplateColumns:
    'repeat(auto-fit, minmax(190px, 1fr))',
  gap: '18px',
};

const cardStyle = {
  background: '#fff',
  padding: '22px',
  borderRadius: '14px',
  border:
    '1px solid rgba(22, 43, 69, 0.08)',
  boxShadow:
    '0 8px 24px rgba(22,43,69,0.06)',
};

const cardLabelStyle = {
  margin: '0 0 8px',
  color: '#77736c',
  fontSize: '12px',
  textTransform: 'uppercase',
  letterSpacing: '1px',
};

const cardValueStyle = {
  margin: 0,
  color: '#162b45',
  fontSize: '27px',
  fontWeight: '700',
};

const sectionStyle = {
  marginTop: '50px',
};

const sectionHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '20px',
  marginBottom: '18px',
};

const sectionEyebrowStyle = {
  margin: '0 0 5px',
  color: '#c18a32',
  fontSize: '10px',
  letterSpacing: '2px',
  fontWeight: '700',
};

const sectionTitleStyle = {
  margin: 0,
  color: '#162b45',
};

const countBadgeStyle = {
  minWidth: '34px',
  height: '34px',
  padding: '0 10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '20px',
  background: '#f7f0e2',
  border:
    '1px solid rgba(193,138,50,0.35)',
  color: '#162b45',
  fontWeight: '700',
};

const itemCardStyle = {
  background: '#fff',
  padding: '22px',
  borderRadius: '14px',
  marginBottom: '14px',
  border:
    '1px solid rgba(22,43,69,0.08)',
  boxShadow:
    '0 5px 18px rgba(22,43,69,0.05)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '25px',
  flexWrap: 'wrap',
};

const detailStyle = {
  margin: '5px 0',
  color: '#625f59',
  fontSize: '13px',
};

const actionStyle = {
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap',
};

const approveButtonStyle = {
  background: '#17324d',
  color: '#fff',
  border: 'none',
  padding: '11px 20px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '700',
};

const rejectButtonStyle = {
  background: '#b42318',
  color: '#fff',
  border: 'none',
  padding: '11px 20px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '700',
};

const emptyStyle = {
  background: '#fff',
  padding: '22px',
  borderRadius: '12px',
  color: '#77736c',
  border:
    '1px solid rgba(22,43,69,0.08)',
};

const errorStyle = {
  marginBottom: '20px',
  padding: '14px 16px',
  background: '#fff1f0',
  border: '1px solid #f5c2c0',
  borderRadius: '9px',
  color: '#b42318',
};

const loadingCardStyle = {
  padding: '30px',
  background: '#fff',
  borderRadius: '12px',
};


export default AdminDashboard;