import React from 'react';
import '../Components/style/comp.css';

const Footer = () => {
  return (
    <footer className="footer mt-auto py-5">
      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-4 col-md-6">
            <div className="brand-logo mb-3" style={{ textAlign: 'left', fontSize: '1.5rem' }}>
              JEGY<span className="text-white">MESTER</span>
            </div>
            <p className="text-secondary">
              Napjaink legmodernebb moziélménye. Foglaljon jegyet egyszerűen és élvezze a legújabb kasszasikereket IMAX és 4DX minőségben.
            </p>
            <div className="social-links d-flex gap-3">
              <a href="#" className="text-secondary fs-4"><i className="fab fa-facebook"></i></a>
              <a href="#" className="text-secondary fs-4"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-secondary fs-4"><i className="fab fa-youtube"></i></a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6 ms-lg-auto">
            <h6 className="text-white fw-bold mb-3">NAVIGÁCIÓ</h6>
            <ul className="list-unstyled footer-links">
              <li><a href="#" className="text-secondary text-decoration-none">Műsoron</a></li>
              <li><a href="#" className="text-secondary text-decoration-none">Hamarosan</a></li>
              <li><a href="#" className="text-secondary text-decoration-none">Ajánlatok</a></li>
              <li><a href="#" className="text-secondary text-decoration-none">VIP</a></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="text-white fw-bold mb-3">INFORMÁCIÓ</h6>
            <ul className="list-unstyled footer-links">
              <li><a href="#" className="text-secondary text-decoration-none">Házirend</a></li>
              <li><a href="#" className="text-secondary text-decoration-none">Adatvédelem</a></li>
              <li><a href="#" className="text-secondary text-decoration-none">Kapcsolat</a></li>
              <li><a href="#" className="text-secondary text-decoration-none">GYIK</a></li>
            </ul>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <span className="text-secondary small">&copy; 2026 JEGYMESTER. Minden jog fenntartva.</span>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <img 
                src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" 
                alt="PayPal" 
                height="20" 
                className="me-3 opacity-50" 
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;