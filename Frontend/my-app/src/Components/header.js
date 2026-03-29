import React from 'react';
import '../Components/style/comp.css';

const Header = () => {
  return (
    <header>
      <div className="top-nav">
        <div className="container-fluid px-5">
          <div className="row align-items-center">
            <div className="col-md-4">
              <a href="/">
                <div className="brand-logo mb-3" style={{ textAlign: 'left', fontSize: '1.5rem' }}>
                  JEGY<span className="text-white">MESTER</span>
                </div>
              </a>
            </div>
            <div className="col-md-8 d-flex justify-content-end align-items-center gap-4">
              <a href="#" className="nav-link">
                <i className="fas fa-map-marker-alt me-2"></i> Mozi kiválasztása
              </a>
              <div className="d-flex align-items-center">
                <a href="/login" className="nav-link me-2">
                  <i className="fas fa-user me-2"></i> Belépés
                </a>
                <span className="text-secondary">|</span>
                <a href="/register" className="nav-link ms-2">Regisztráció</a>
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
            <a className="nav-link" href="#">Műsoron</a>
            <a className="nav-link" href="#">Ajánlatok</a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;