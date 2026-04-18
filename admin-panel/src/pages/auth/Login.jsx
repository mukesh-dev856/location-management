import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/apiService';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
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
    if (!form.email) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email address is invalid.';
    }

    if (!form.password) {
      newErrors.password = 'Password is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setValidationErrors(newErrors);
      return;
    }

    setLoading(true);
    setError('');
    setValidationErrors({});

    try {
      const result = await apiService.login(form);
      if (result.status) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        navigate('/dashboard');
      } else {
        setError(result.message || 'Login failed');
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
                <h4>Hello! let's get started</h4>
                <h6 className="font-weight-light">Sign in to continue.</h6>

                {error && (
                  <div className="alert alert-danger py-2 mt-3" role="alert">
                    {error}
                  </div>
                )}

                <form className="pt-3" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="loginEmail">Email address</label>
                    <input
                      type="email"
                      name="email"
                      className={`form-control form-control-lg ${validationErrors.email ? 'is-invalid' : ''}`}
                      id="loginEmail"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="email"
                    />
                    {validationErrors.email && <div className="invalid-feedback">{validationErrors.email}</div>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="loginPassword">Password</label>
                    <input
                      type="password"
                      name="password"
                      className={`form-control form-control-lg ${validationErrors.password ? 'is-invalid' : ''}`}
                      id="loginPassword"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                    />
                    {validationErrors.password && <div className="invalid-feedback">{validationErrors.password}</div>}
                  </div>

                  <div className="mt-3 d-grid gap-2">
                    <button
                      type="submit"
                      className="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn"
                      disabled={loading}
                      id="loginSubmitBtn"
                    >
                      {loading ? (
                        <span>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Signing in...
                        </span>
                      ) : 'SIGN IN'}
                    </button>
                  </div>

                  <div className="my-2 d-flex justify-content-between align-items-center">
                    <div className="form-check">
                      <label className="form-check-label text-muted">
                        <input type="checkbox" className="form-check-input" id="keepSignedIn" />
                        Keep me signed in
                      </label>
                    </div>
                    <a href="#!" className="auth-link text-primary" onClick={(e) => e.preventDefault()}>
                      Forgot password?
                    </a>
                  </div>

                  <div className="text-center mt-4 font-weight-light">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary">Register</Link>
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

export default Login;
