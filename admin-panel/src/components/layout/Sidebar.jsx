import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const isActiveGroup = (...paths) => paths.some(p => location.pathname.startsWith(p));

  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav">
        {/* Dashboard */}
        <li className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
          <Link className="nav-link" to="/dashboard">
            <span className="menu-title">Dashboard</span>
            <i className="mdi mdi-home menu-icon"></i>
          </Link>
        </li>

        {/* Location Management */}
        <li className={`nav-item ${isActiveGroup('/states', '/cities') ? 'active' : ''}`}>
          <a
            className="nav-link"
            data-bs-toggle="collapse"
            href="#locationMenu"
            aria-expanded={isActiveGroup('/states', '/cities') ? 'true' : 'false'}
            aria-controls="locationMenu"
            onClick={(e) => e.preventDefault()}
          >
            <span className="menu-title">Location Management</span>
            <i className="menu-arrow"></i>
            <i className="mdi mdi-map-marker-multiple menu-icon"></i>
          </a>
          <div className={`collapse ${isActiveGroup('/states', '/cities') ? 'show' : ''}`} id="locationMenu">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/states') ? 'active' : ''}`} to="/states">
                  States
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/cities') ? 'active' : ''}`} to="/cities">
                  Cities
                </Link>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
