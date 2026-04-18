/**
 * PageHeader — renders the page title block with breadcrumb
 * @param {string} title - The page title text
 * @param {string} icon  - MDI icon class (e.g. "mdi-home")
 * @param {string[]} breadcrumbs - Array of breadcrumb labels
 */
const PageHeader = ({ title, icon = 'mdi-home', breadcrumbs = [] }) => {
  return (
    <div className="page-header">
      <h3 className="page-title">
        <span className="page-title-icon bg-gradient-primary text-white me-2">
          <i className={`mdi ${icon}`}></i>
        </span>
        {title}
      </h3>
      <nav aria-label="breadcrumb">
        <ul className="breadcrumb">
          {breadcrumbs.map((crumb, idx) => (
            <li
              key={idx}
              className={`breadcrumb-item ${idx === breadcrumbs.length - 1 ? 'active' : ''}`}
              aria-current={idx === breadcrumbs.length - 1 ? 'page' : undefined}
            >
              <span>{crumb}</span>
              {idx === breadcrumbs.length - 1 && (
                <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle ms-1"></i>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default PageHeader;
