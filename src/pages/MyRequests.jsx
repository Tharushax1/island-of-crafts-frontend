import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

// NOTE: Hasandi's real Auth module isn't wired in yet, so there's no real
// logged-in user to know if you're the artisan or the customer. This role
// switcher is a TEMPORARY testing aid — remove it once real login/JWT
// auth exists, and get the role from the logged-in user instead.
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
    <div style={{ padding: '24px', maxWidth: '700px' }}>
      <Link to="/">&larr; Back to products</Link>
      <h1>My Custom Requests</h1>

      <div style={{ marginBottom: '20px' }}>
        <span style={{ marginRight: '8px' }}>Viewing as:</span>
        <button
          onClick={() => setRole('artisan')}
          style={{ fontWeight: role === 'artisan' ? 'bold' : 'normal', marginRight: '8px' }}
        >
          Artisan
        </button>
        <button
          onClick={() => setRole('customer')}
          style={{ fontWeight: role === 'customer' ? 'bold' : 'normal' }}
        >
          Customer
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'salmon' }}>{error}</p>}
      {!loading && requests.length === 0 && <p>No requests found for this role.</p>}

      {requests.map((req) => (
        <RequestCard key={req._id} request={req} role={role} onUpdated={fetchRequests} />
      ))}
    </div>
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
    <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
      <p><strong>{request.description}</strong></p>
      <p style={{ fontSize: '12px', color: '#999' }}>
        Status: <strong>{request.status}</strong>
        {request.budgetRange && ` · Budget: ${request.budgetRange}`}
      </p>

      {request.quotation?.price && (
        <p style={{ color: '#666' }}>
          Quoted: LKR {request.quotation.price} · {request.quotation.estimatedDays} days
          {request.quotation.message && ` — "${request.quotation.message}"`}
        </p>
      )}

      {error && <p style={{ color: 'salmon' }}>{error}</p>}

      {/* Artisan quotes a pending request */}
      {role === 'artisan' && request.status === 'pending' && (
        <form onSubmit={submitQuote} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
          <input type="number" placeholder="Price (LKR)" required value={price} onChange={(e) => setPrice(e.target.value)} />
          <input type="number" placeholder="Estimated days" value={estimatedDays} onChange={(e) => setEstimatedDays(e.target.value)} />
          <input type="text" placeholder="Message to customer" value={message} onChange={(e) => setMessage(e.target.value)} />
          <button type="submit" disabled={busy}>{busy ? 'Sending...' : 'Send quote'}</button>
        </form>
      )}

      {/* Customer accepts/rejects a quoted request */}
      {role === 'customer' && request.status === 'quoted' && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <button disabled={busy} onClick={() => respond(true)}>Accept quote</button>
          <button disabled={busy} onClick={() => respond(false)}>Reject</button>
        </div>
      )}
    </div>
  );
}

export default MyRequests;
