import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  
  // Don't show breadcrumbs on homepage or auth page
  if (location.pathname === '/' || location.pathname === '/auth') {
    return null;
  }

  return (
    <div className="breadcrumbs">
      <Link to="/" className="breadcrumb-item">Home</Link>
      
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        
        // Format the breadcrumb text (capitalize, replace dashes with spaces)
        const formattedName = name
          .replace(/-/g, ' ')
          .replace(/\b\w/g, letter => letter.toUpperCase());
        
        return (
          <React.Fragment key={name}>
            <span className="breadcrumb-separator">/</span>
            {isLast ? (
              <span className="breadcrumb-item current">{formattedName}</span>
            ) : (
              <Link className="breadcrumb-item" to={routeTo}>
                {formattedName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Breadcrumbs; 