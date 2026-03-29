import React, { useState } from 'react';
import '../Components/style/comp.css'; // Make sure the path to your CSS is correct
import Header from './header.js';
import Footer from './footer.js';

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
      <Header />

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
      <Footer />
    </div>
  );
};

export default Login;