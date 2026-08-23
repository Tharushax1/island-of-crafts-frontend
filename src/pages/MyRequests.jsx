import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

// NOTE: temporary role switcher — remove once real login/JWT auth exists,
// and get the role from the logged-in user instead.
function MyRequests() {
  const [role, setRole] = useState('artisan');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = () => {
    setLoading(true);
    api.get('/custom-requests', { headers: { 'x-mock-role': role } })
      .then((res) => setRequests(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  return (
    <section className="section container form-section" style={{ maxWidth: '700px' }}>
      <Link to="/" className="back-link">&larr; Back to products</Link>
      <h1>My Custom Requests</h1>

      <div className="role-toggle">
        <button className={role === 'artisan' ? 'active' : ''} onClick={() => setRole('artisan')}>Artisan</button>
        <button className={role === 'customer' ? 'active' : ''} onClick={() => setRole('customer')}>Customer</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && requests.length === 0 && <p>No requests found for this role.</p>}

      {requests.map((req) => (
        <RequestCard key={req._id} request={req} role={role} onUpdated={fetchRequests} />
      ))}
    </section>
  );
}

function RequestCard({ request, role, onUpdated }) {
  const [price, setPrice] = useState('');
  const [estimatedDays, setEstimatedDays] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submitQuote = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.put(`/custom-requests/${request._id}/quote`, {
        price: Number(price),
        estimatedDays: Number(estimatedDays),
        message,
      }, { headers: { 'x-mock-role': 'artisan' } });
      onUpdated();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setBusy(false);
    }
  };

  const respond = async (accept) => {
    setBusy(true);
    setError(null);
    try {
      await api.put(`/custom-requests/${request._id}/respond`,
        { accept },
        { headers: { 'x-mock-role': 'customer' } });
      onUpdated();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="request-card">
      <p style={{ fontWeight: 600, marginBottom: '4px' }}>{request.description}</p>
      <span className={`status-badge status-${request.status}`}>{request.status}</span>
      {request.budgetRange && <span className="meta-line"> · Budget: {request.budgetRange}</span>}

      {request.quotation?.price && (
        <p className="card-desc">
          Quoted: LKR {request.quotation.price} · {request.quotation.estimatedDays} days
          {request.quotation.message && ` — "${request.quotation.message}"`}
        </p>
      )}

      {error && <p className="error-text">{error}</p>}

      {role === 'artisan' && request.status === 'pending' && (
        <form onSubmit={submitQuote} className="quote-form">
          <input type="number" placeholder="Price (LKR)" required value={price} onChange={(e) => setPrice(e.target.value)} />
          <input type="number" placeholder="Estimated days" value={estimatedDays} onChange={(e) => setEstimatedDays(e.target.value)} />
          <input type="text" placeholder="Message to customer" value={message} onChange={(e) => setMessage(e.target.value)} />
          <button type="submit" className="btn btn-primary btn-small" disabled={busy}>{busy ? 'Sending...' : 'Send quote'}</button>
        </form>
      )}

      {role === 'customer' && request.status === 'quoted' && (
        <div className="request-actions">
          <button className="btn btn-primary btn-small" disabled={busy} onClick={() => respond(true)}>Accept quote</button>
          <button className="btn btn-secondary btn-small" disabled={busy} onClick={() => respond(false)}>Reject</button>
        </div>
      )}
    </div>
  );
}

export default MyRequests;
