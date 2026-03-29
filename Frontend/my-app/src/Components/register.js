import React from 'react';
import '../Components/style/comp.css';
import Header from './header.js';
import Footer from './footer.js';

const RegisterPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Regisztrációs adatok feldolgozása...");
  };

  return (
    <div className="register-page-wrapper bg-dark">
      <Header />

      <main>
        <div className="container d-flex flex-column align-items-center py-5">
          <h2 className="text-light">Regisztrálj egy Jegymester fiókot</h2>
          <p className="login-text text-secondary text-center">
            Szia! Szeretnél egy Jegymester fiókot létrehozni? <br />
            Add meg az adataidat, pár kattintás és kész is!
          </p>
        </div>

        <div className="container d-flex justify-content-center pb-5">
          <div className="card login-card p-4 bg-dark border-secondary shadow" style={{ maxWidth: '500px', width: '100%' }}>
            <div className="card-body">
              <div className="brand-logo mb-4 text-center" style={{ fontSize: '1.5rem' }}>
                JEGY<span className="text-white">MESTER</span>
              </div>
              
              <form onSubmit={handleSubmit}>
                {/* Teljes név */}
                <div className="mb-3">
                  <label htmlFor="name" className="form-label text-secondary small">Teljes név</label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary text-secondary">
                      <i className="fas fa-user"></i>
                    </span>
                    <input type="text" className="form-control text-white border-secondary" id="name" placeholder="Teszt Ádám" required />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="phone" className="form-label text-secondary small">Telefonszám</label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary text-secondary">
                      <i className="fas fa-phone"></i>
                    </span>
                    <input type="tel" className="form-control text-white border-secondary" id="phone" placeholder="+36 1 234 5678" required />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label text-secondary small">E-mail cím</label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary text-secondary">
                      <i className="fas fa-envelope"></i>
                    </span>
                    <input type="email" className="form-control text-white border-secondary" id="email" placeholder="pelda@email.hu" required />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label text-secondary small">Jelszó</label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary text-secondary">
                      <i className="fas fa-lock"></i>
                    </span>
                    <input type="password" className="form-control text-white border-secondary" id="password" placeholder="******" required />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="password_confirm" className="form-label text-secondary small">Jelszó mégegyszer</label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary text-secondary">
                      <i className="fas fa-lock"></i>
                    </span>
                    <input type="password" className="form-control text-white border-secondary" id="password_confirm" placeholder="******" required />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-100 mb-3 py-2">Regisztráció</button>
              </form>

              <div className="login-footer text-center">
                <hr className="border-secondary my-3" />
                <p className="small text-secondary">
                  Van már fiókod? <a href="/login" className="fw-bold text-decoration-none text-primary">Bejelentkezés</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RegisterPage;