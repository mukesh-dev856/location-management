import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/apiService';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    if (validationErrors[e.target.name]) {
      setValidationErrors({ ...validationErrors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let newErrors = {};
    if (!form.name) {
      newErrors.name = 'Full name is required.';
    }
    
    if (!form.email) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email address is invalid.';
    }
    
    if (!form.password) {
      newErrors.password = 'Password is required.';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    
    if (!form.confirm) {
      newErrors.confirm = 'Please confirm your password.';
    } else if (form.password !== form.confirm) {
      newErrors.confirm = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setValidationErrors(newErrors);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setValidationErrors({});

    try {
      const result = await apiService.register({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      if (result.status) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'Server error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-scroller">
      <div className="container-fluid page-body-wrapper full-page-wrapper">
        <div className="content-wrapper d-flex align-items-center auth">
          <div className="row flex-grow">
            <div className="col-lg-4 mx-auto">
              <div className="auth-form-light text-left p-5">
                <div className="brand-logo">
                  <Link to="/">
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/images/logo.svg`}
                      alt="logo"
                    />
                  </Link>
                </div>
                <h4>New here?</h4>
                <h6 className="font-weight-light">Signing up is easy. It only takes a few steps.</h6>

                {error && (
                  <div className="alert alert-danger py-2 mt-3" role="alert">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="alert alert-success py-2 mt-3" role="alert">
                    {success}
                  </div>
                )}

                <form className="pt-3" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="registerName">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className={`form-control form-control-lg ${validationErrors.name ? 'is-invalid' : ''}`}
                      id="registerName"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={handleChange}
                      autoComplete="name"
                    />
                    {validationErrors.name && <div className="invalid-feedback">{validationErrors.name}</div>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="registerEmail">Email address</label>
                    <input
                      type="email"
                      name="email"
                      className={`form-control form-control-lg ${validationErrors.email ? 'is-invalid' : ''}`}
                      id="registerEmail"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="email"
                    />
                    {validationErrors.email && <div className="invalid-feedback">{validationErrors.email}</div>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="registerPassword">Password</label>
                    <input
                      type="password"
                      name="password"
                      className={`form-control form-control-lg ${validationErrors.password ? 'is-invalid' : ''}`}
                      id="registerPassword"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                    {validationErrors.password && <div className="invalid-feedback">{validationErrors.password}</div>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="registerConfirm">Confirm Password</label>
                    <input
                      type="password"
                      name="confirm"
                      className={`form-control form-control-lg ${validationErrors.confirm ? 'is-invalid' : ''}`}
                      id="registerConfirm"
                      placeholder="Re-enter your password"
                      value={form.confirm}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                    {validationErrors.confirm && <div className="invalid-feedback">{validationErrors.confirm}</div>}
                  </div>

                  <div className="mt-3 d-grid gap-2">
                    <button
                      type="submit"
                      className="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn"
                      disabled={loading}
                      id="registerSubmitBtn"
                    >
                      {loading ? (
                        <span>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Registering...
                        </span>
                      ) : 'REGISTER'}
                    </button>
                  </div>

                  <div className="text-center mt-4 font-weight-light">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary">Login</Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
