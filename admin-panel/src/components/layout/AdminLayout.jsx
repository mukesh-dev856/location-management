import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

/**
 * AdminLayout — wraps all protected admin pages with Navbar + Sidebar + Footer
 */
const AdminLayout = ({ children }) => {
  return (
    <div className="container-scroller">
      <Navbar />
      <div className="container-fluid page-body-wrapper">
        <Sidebar />
        <div className="main-panel">
          <div className="content-wrapper">
            {children}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
