import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';

function CustomRequestForm() {
  const { artisanId } = useParams();
  const navigate = useNavigate();

  const [description, setDescription] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      // NOTE: in production this call needs a real logged-in customer's
      // JWT token attached (from Hasandi's auth module). For now it relies
      // on the temporary mock auth header set in api.js / Postman testing.
      await api.post('/custom-requests', {
        artisan: artisanId,
        description,
        budgetRange,
      }, {
        headers: { 'x-mock-role': 'customer' },
      });
      setSuccess(true);
      setDescription('');
      setBudgetRange('');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={{ padding: '24px', maxWidth: '500px' }}>
        <h1>Request sent!</h1>
        <p>The artisan will review your request and send you a quotation soon.</p>
        <Link to="/">&larr; Back to products</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '500px' }}>
      <Link to="/">&larr; Back to products</Link>
      <h1>Request a custom piece</h1>
      <p style={{ color: '#666' }}>Describe what you'd like made, and this artisan will send you a price quote.</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
        <label>
          Description
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={{ width: '100%', padding: '8px' }}
            placeholder="e.g. I want a custom wooden mask with a peacock design"
          />
        </label>

        <label>
          Budget range (optional)
          <input
            type="text"
            value={budgetRange}
            onChange={(e) => setBudgetRange(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            placeholder="e.g. LKR 5000-10000"
          />
        </label>

        {error && <p style={{ color: 'salmon' }}>{error}</p>}

        <button type="submit" disabled={submitting} style={{ padding: '10px', cursor: 'pointer' }}>
          {submitting ? 'Sending...' : 'Send request'}
        </button>
      </form>
    </div>
  );
}

export default CustomRequestForm;
