import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);

      const { token, user } = response.data;

      // Store authentication information
    //   localStorage.setItem('token', token);
    //   localStorage.setItem('user', JSON.stringify(user));

    login(token, user);

      // Redirect according to role
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'artisan') {
        navigate('/artisan');
      } else {
        navigate('/');
      }

    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
  <section className="auth-page">

    <div className="auth-wrapper">

      {/* LEFT SIDE */}
      <div className="auth-brand-panel">

        <div className="auth-brand-content">
          <span className="auth-brand-small">
            ISLAND OF CRAFTS
          </span>

          <h1>
            Every craft has
            <br />
            a story.
          </h1>

          <p>
            Discover unique handmade creations and connect
            with talented Sri Lankan artisans.
          </p>

          <div className="auth-brand-features">
            <span>✦ Handmade</span>
            <span>✦ Sri Lankan</span>
            <span>✦ Authentic</span>
          </div>
        </div>

      </div>


      {/* RIGHT SIDE */}
      <div className="auth-form-panel">

        <div className="auth-form-content">

          <span className="hero-eyebrow">
            Welcome back
          </span>

          <h2>
            Sign in to your account
          </h2>

          <p className="auth-subtitle">
            Enter your details to continue your journey
            with Island of Crafts.
          </p>

          <form
            onSubmit={handleSubmit}
            className="auth-form"
          >

            <label>
              Email Address

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </label>


            <label>
              Password

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </label>


            {error && (
              <p className="error-text">
                {error}
              </p>
            )}


            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading
                ? 'Signing in...'
                : 'Sign In'
              }
            </button>

          </form>


          <div className="auth-divider">
            <span />
            <p>New to Island of Crafts?</p>
            <span />
          </div>


          <p className="auth-switch">
            Don't have an account?{' '}

            <Link to="/register">
              Create an account
            </Link>
          </p>

        </div>

      </div>

    </div>

  </section>
);
}

export default Login;
