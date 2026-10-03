import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

function CustomRequestForm() {
  const { artisanId } = useParams();

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
      // NOTE: relies on temporary mock auth until Hasandi's real Auth module is wired in.
      await api.post('/custom-requests', {
        artisan: artisanId,
        description,
        budgetRange,
      // }, {
      //   headers: { 'x-mock-role': 'customer' },
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
      <section className="section container form-section">
        <div className="form-card">
          <h1>Request sent!</h1>
          <p className="card-desc">The artisan will review your request and send you a quotation soon.</p>
          <Link to="/" className="back-link">&larr; Back to products</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section container form-section">
      <Link to="/" className="back-link">&larr; Back to products</Link>
      <div className="form-card">
        <span className="hero-eyebrow">Commission a piece</span>
        <h1>Request a custom piece</h1>
        <p className="card-desc">Describe what you'd like made, and this artisan will send you a price quote.</p>

        <form onSubmit={handleSubmit} className="stacked-form">
          <label>
            Description
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="e.g. I want a custom wooden mask with a peacock design"
            />
          </label>

          <label>
            Budget range (optional)
            <input
              type="text"
              value={budgetRange}
              onChange={(e) => setBudgetRange(e.target.value)}
              placeholder="e.g. LKR 5000-10000"
            />
          </label>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Sending...' : 'Send request'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default CustomRequestForm;
