// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import api from '../api';
// // import { useAuth } from '../context/AuthContext';

// function Register() {
//   const navigate = useNavigate();
// //   const { login } = useAuth();

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     role: 'customer',
//   });

//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setError('');
//     setSuccess('');
//     setLoading(true);

//     try {
//       const response = await api.post('/auth/register', formData);

//       setSuccess(response.data.message);

//       // Registration endpoint does not return a JWT,
//       // so we don't log the user in automatically.
//       setTimeout(() => {
//         navigate('/login');
//       }, 1200);

//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//         'Registration failed. Please try again.'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="section container form-section">
//       <div className="form-card">

//         <span className="hero-eyebrow">
//           Join Island of Crafts
//         </span>

//         <h1>Create an account</h1>

//         <p className="card-desc">
//           Create your Island of Crafts account.
//         </p>

//         <form onSubmit={handleSubmit} className="stacked-form">

//           <label>
//             Name
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Enter your name"
//               required
//             />
//           </label>

//           <label>
//             Email
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Enter your email"
//               required
//             />
//           </label>

//           <label>
//             Password
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="At least 6 characters"
//               minLength={6}
//               required
//             />
//           </label>

//           <label>
//             Account type
//             <select
//               name="role"
//               value={formData.role}
//               onChange={handleChange}
//             >
//               <option value="customer">
//                 Customer
//               </option>

//               <option value="artisan">
//                 Artisan
//               </option>
//             </select>
//           </label>

//           {formData.role === 'artisan' && (
//             <p className="card-desc">
//               Artisan accounts require administrator approval
//               before you can manage an artisan storefront.
//             </p>
//           )}

//           {error && (
//             <p className="error-text">
//               {error}
//             </p>
//           )}

//           {success && (
//             <p>
//               {success}
//             </p>
//           )}

//           <button
//             type="submit"
//             className="btn btn-primary"
//             disabled={loading}
//           >
//             {loading ? 'Creating account...' : 'Create account'}
//           </button>

//         </form>

//         <p style={{ marginTop: '20px' }}>
//           Already have an account?{' '}
//           <Link to="/login">
//             Login
//           </Link>
//         </p>

//       </div>
//     </section>
//   );
// }

// export default Register;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.post('/auth/register', formData);

      setSuccess(response.data.message);

      setTimeout(() => {
        navigate('/login');
      }, 1200);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="register-page">

      <div className="register-overlay">

        <div className="register-card">

          {/* Header */}
          <div className="register-header">

            <span className="register-eyebrow">
              ISLAND OF CRAFTS
            </span>

            <h1>Create your account</h1>

            <p>
              Join our community of customers and
              talented Sri Lankan artisans.
            </p>

          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="register-form"
          >

            {/* Name */}
            <div className="input-group">

              <label htmlFor="name">
                Full Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />

            </div>

            {/* Email */}
            <div className="input-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />

            </div>

            {/* Password */}
            <div className="input-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                minLength={6}
                required
              />

            </div>

            {/* Account Type */}
            <div className="input-group">

              <label htmlFor="role">
                Account Type
              </label>

              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="customer">
                  Customer
                </option>

                <option value="artisan">
                  Artisan
                </option>
              </select>

            </div>

            {/* Artisan Information */}
            {formData.role === 'artisan' && (
              <div className="artisan-notice">

                <strong>Artisan account</strong>

                <p>
                  Your account will be reviewed by an
                  administrator before you can manage
                  an artisan storefront.
                </p>

              </div>
            )}

            {/* Error */}
            {error && (
              <div className="register-error">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="register-success">
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading
                ? 'Creating account...'
                : 'Create account'}
            </button>

          </form>

          {/* Login link */}
          <div className="register-footer">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Login
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Register;