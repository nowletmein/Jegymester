import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Components/style/comp.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token'); 
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <header>
      <div className="top-nav">
        <div className="container-fluid px-5">
          <div className="row align-items-center">
            <div className="col-md-4">
              <Link to="/">
                <div className="brand-logo mb-3" style={{ textAlign: 'left', fontSize: '1.5rem', textDecoration: 'none' }}>
                  JEGY<span className="text-white">MESTER</span>
                </div>
              </Link>
            </div>
            
            <div className="col-md-8 d-flex justify-content-end align-items-center gap-4">
              <Link to="/movies" className="nav-link">
                <i className="fas fa-map-marker-alt me-2"></i> Mozi kiválasztása
              </Link>

              <div className="d-flex align-items-center">
                {isLoggedIn ? (
                  <Link to="/profile" className="nav-link">
                    <i className="fas fa-user-circle me-2"></i> Fiókom
                  </Link>
                ) : (
                  <>
                    <Link to="/login" className="nav-link me-2">
                      <i className="fas fa-user me-2"></i> Belépés
                    </Link>
                    <span className="text-secondary">|</span>
                    <Link to="/register" className="nav-link ms-2">Regisztráció</Link>
                  </>
                )}
              </div>

              <div className="input-group w-25">
                <input type="text" className="form-control search-box" placeholder="Keresés..." />
                <span className="input-group-text search-box">
                  <i className="fas fa-search text-white"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav className="navbar navbar-expand-lg main-nav">
        <div className="container-fluid px-5">
          <div className="navbar-nav w-100 justify-content-center">
            <Link className="nav-link" to="/movies">Műsoron</Link>
            <Link className="nav-link" to="/purchase">Ajánlatok</Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;