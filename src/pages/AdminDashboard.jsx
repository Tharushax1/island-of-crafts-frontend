
import { useCallback, useEffect, useState } from 'react';
import api from '../api';

function AdminDashboard() {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [processingId, setProcessingId] = useState('');

  const fetchPendingArtisans = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/admin/artisans/pending');
      setArtisans(response.data.artisans || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to load pending artisans. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingArtisans();
  }, [fetchPendingArtisans]);

  const handleDecision = async (artisanId, decision) => {
    const action = decision === 'approve' ? 'approve' : 'reject';

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this artisan?`
    );

    if (!confirmed) return;

    setProcessingId(artisanId);
    setError('');
    setMessage('');

    try {
      const response = await api.put(
        `/admin/artisans/${artisanId}/${action}`
      );

      setMessage(response.data.message);
      await fetchPendingArtisans();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        `Failed to ${action} artisan. Please try again.`
      );
    } finally {
      setProcessingId('');
    }
  };

  return (
    <section className="section container">
      <span className="hero-eyebrow">ADMINISTRATION</span>
      <h1>Admin Dashboard</h1>

      <p className="card-desc">
        Review artisan applications and manage account approvals.
      </p>

      <div className="form-card" style={{ marginTop: '24px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h2>Pending Artisan Applications</h2>
            <p className="card-desc">
              {artisans.length} pending application(s)
            </p>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={fetchPendingArtisans}
            disabled={loading || Boolean(processingId)}
          >
            Refresh
          </button>
        </div>

        {message && (
          <p role="status" style={{ color: 'green' }}>
            {message}
          </p>
        )}

        {error && (
          <p className="error-text" role="alert">
            {error}
          </p>
        )}

        {loading ? (
          <p>Loading artisan applications...</p>
        ) : artisans.length === 0 && !error ? (
          <p>No pending artisan applications.</p>
        ) : (
          <div style={{ display: 'grid', gap: '16px', marginTop: '20px' }}>
            {artisans.map((artisan) => (
              <article
                key={artisan._id}
                className="request-card"
              >
                <h3>{artisan.name}</h3>

                <p className="card-desc">{artisan.email}</p>

                <p>
                  <strong>Status:</strong>{' '}
                  {artisan.artisanStatus}
                </p>

                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    flexWrap: 'wrap',
                    marginTop: '16px',
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-primary btn-small"
                    disabled={Boolean(processingId)}
                    onClick={() =>
                      handleDecision(artisan._id, 'approve')
                    }
                  >
                    {processingId === artisan._id
                      ? 'Processing...'
                      : 'Approve'}
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary btn-small"
                    disabled={Boolean(processingId)}
                    onClick={() =>
                      handleDecision(artisan._id, 'reject')
                    }
                  >
                    {processingId === artisan._id
                      ? 'Processing...'
                      : 'Reject'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminDashboard;
