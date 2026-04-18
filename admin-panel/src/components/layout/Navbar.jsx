import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleSidebar = () => {
    document.querySelector('body').classList.toggle('sidebar-icon-only');
  };

  const toggleOffcanvas = () => {
    document.querySelector('.sidebar-offcanvas').classList.toggle('active');
  };

  return (
    <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
      <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-start">
        <Link className="navbar-brand brand-logo" to="/dashboard">
          <img src={`${process.env.PUBLIC_URL}/assets/images/logo.svg`} alt="logo" />
        </Link>
        <Link className="navbar-brand brand-logo-mini" to="/dashboard">
          <img src={`${process.env.PUBLIC_URL}/assets/images/logo-mini.svg`} alt="logo" />
        </Link>
      </div>

      <div className="navbar-menu-wrapper d-flex align-items-stretch">
        <button
          className="navbar-toggler navbar-toggler align-self-center"
          type="button"
          onClick={toggleSidebar}
        >
          <span className="mdi mdi-menu"></span>
        </button>

        <div className="search-field d-none d-md-block">
          <form className="d-flex align-items-center h-100" action="#">
            <div className="input-group">
              <div className="input-group-prepend bg-transparent">
                <i className="input-group-text border-0 mdi mdi-magnify"></i>
              </div>
              <input
                type="text"
                className="form-control bg-transparent border-0"
                placeholder="Search locations"
              />
            </div>
          </form>
        </div>

        <ul className="navbar-nav navbar-nav-right">
          {/* Profile */}
          <li className={`nav-item nav-profile dropdown ${profileOpen ? 'show' : ''}`}>
            <a
              className="nav-link dropdown-toggle"
              id="profileDropdown"
              href="#!"
              onClick={(e) => { e.preventDefault(); setProfileOpen(!profileOpen); setNotifOpen(false); }}
            >
              <div className="nav-profile-img">
                <img src={`${process.env.PUBLIC_URL}/assets/images/faces/face1.jpg`} alt="profile" />
                <span className="availability-status online"></span>
              </div>
              <div className="nav-profile-text">
                <p className="mb-1 text-black">{user ? user.name : 'Guest User'}</p>
              </div>
            </a>
            <div className={`dropdown-menu navbar-dropdown ${profileOpen ? 'show' : ''}`} aria-labelledby="profileDropdown">
              <a className="dropdown-item" href="#!" onClick={(e) => e.preventDefault()}>
                <i className="mdi mdi-account me-2 text-primary"></i> Profile
              </a>
              <div className="dropdown-divider"></div>
              <a className="dropdown-item" href="#!" onClick={handleLogout}>
                <i className="mdi mdi-logout me-2 text-primary"></i> Signout
              </a>
            </div>
          </li>

          {/* Fullscreen */}
          <li className="nav-item d-none d-lg-block full-screen-link">
            <a className="nav-link" href="#!" onClick={(e) => { e.preventDefault(); document.documentElement.requestFullscreen && document.documentElement.requestFullscreen(); }}>
              <i className="mdi mdi-fullscreen" id="fullscreen-button"></i>
            </a>
          </li>

          {/* Notifications */}
          <li className={`nav-item dropdown ${notifOpen ? 'show' : ''}`}>
            <a
              className="nav-link count-indicator dropdown-toggle"
              id="notificationDropdown"
              href="#!"
              onClick={(e) => { e.preventDefault(); setNotifOpen(!notifOpen); setProfileOpen(false); }}
            >
              <i className="mdi mdi-bell-outline"></i>
              <span className="count-symbol bg-danger"></span>
            </a>
            <div className={`dropdown-menu dropdown-menu-end navbar-dropdown preview-list ${notifOpen ? 'show' : ''}`} aria-labelledby="notificationDropdown">
              <h6 className="p-3 mb-0">Notifications</h6>
              <div className="dropdown-divider"></div>
              <a className="dropdown-item preview-item" href="#!" onClick={(e) => e.preventDefault()}>
                <div className="preview-thumbnail">
                  <div className="preview-icon bg-success">
                    <i className="mdi mdi-map-marker"></i>
                  </div>
                </div>
                <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                  <h6 className="preview-subject font-weight-normal mb-1">New State Added</h6>
                  <p className="text-gray ellipsis mb-0">A new state has been created</p>
                </div>
              </a>
              <div className="dropdown-divider"></div>
              <a className="dropdown-item preview-item" href="#!" onClick={(e) => e.preventDefault()}>
                <div className="preview-thumbnail">
                  <div className="preview-icon bg-warning">
                    <i className="mdi mdi-city"></i>
                  </div>
                </div>
                <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                  <h6 className="preview-subject font-weight-normal mb-1">City Updated</h6>
                  <p className="text-gray ellipsis mb-0">City record was modified</p>
                </div>
              </a>
              <div className="dropdown-divider"></div>
              <h6 className="p-3 mb-0 text-center">See all notifications</h6>
            </div>
          </li>

          {/* Logout */}
          <li className="nav-item nav-logout d-none d-lg-block">
            <a className="nav-link" href="#!" onClick={handleLogout}>
              <i className="mdi mdi-power"></i>
            </a>
          </li>
        </ul>

        <button
          className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
          type="button"
          onClick={toggleOffcanvas}
        >
          <span className="mdi mdi-menu"></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
