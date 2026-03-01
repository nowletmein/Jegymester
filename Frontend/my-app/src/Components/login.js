import React, { useState } from 'react';
import '../Components/style/login_style.css'; // Make sure the path to your CSS is correct

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in with:", email, password);
    // Add your login logic here (API calls, etc.)
  };

  return (
    <div className="bg-dark text-light min-vh-100">
      {/* Navigation */}
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
              <a href="#" className="nav-link"><i className="fas fa-map-marker-alt me-2"></i> Mozi kiválasztása</a>
              <div className="d-flex align-items-center">
                <a href="/login" className="nav-link me-2"><i className="fas fa-user me-2"></i> Belépés</a>
                <span className="text-secondary">|</span>
                <a href="/register" className="nav-link ms-2">Regisztráció</a>
              </div>
              <div className="input-group w-25">
                <input type="text" className="form-control search-box" placeholder="Keresés..." />
                <span className="input-group-text search-box"><i className="fas fa-search text-white"></i></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container d-flex flex-column align-items-center py-5">
        <h2>Bejelentkezés a Jegymester fiókomba</h2>
        <p className="login-text">Szia! Örülünk, hogy újra itt vagy! Jelentkezz be a fiókodba, hogy tudj jegyet vásárolni!</p>
      </div>

      <div className="container d-flex justify-content-center pb-5">
        <div className="card login-card p-4" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
          <div className="card-body">
            <div className="brand-logo text-center mb-4">JEGY<span className="text-white">MESTER</span></div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label text-secondary small">E-mail cím</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary"><i className="fas fa-envelope"></i></span>
                  <input 
                    type="email" 
                    className="form-control" 
                    id="email" 
                    placeholder="pelda@email.hu" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label htmlFor="password" className="form-label text-secondary small">Jelszó</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary"><i className="fas fa-lock"></i></span>
                  <input 
                    type="password" 
                    className="form-control" 
                    id="password" 
                    placeholder="******" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100 mb-3">Belépés</button>
            </form>

            <div className="login-footer text-center">
              <hr className="border-secondary my-3" />
              <p className="small text-secondary">Nincs még fiókod? <a href="/register" className="fw-bold">Regisztráció</a></p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
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
            </div>
            {/* ... Other footer columns ... */}
          </div>
          <hr className="border-secondary my-4" />
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <span className="text-secondary small">&copy; 2026 JEGYMESTER. Minden jog fenntartva.</span>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" height="20" className="me-3 opacity-50" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;