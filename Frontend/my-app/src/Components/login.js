import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you use react-router
import { useAuth } from '../context/AuthContext'; // Path to your context file
import '../Components/style/comp.css';
import Header from './header.js';
import Footer from './footer.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  // The backend expects these 4 keys. 
  // For login, we provide real email/password and dummy strings for the rest.
  const loginData = {
    name: "login_attempt", 
    email: email, 
    phone: "00000000", 
    password: password
  };

  try {
    const response = await fetch('http://localhost:5000/api/Users/Login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      throw new Error('Hibás e-mail cím vagy jelszó!');
    }

    // 1. JAVÍTÁS: Nyers szövegként (text) olvassuk be a tokent JSON helyett!
    const token = await response.text();
    
    const cleanToken = token.startsWith('"') ? JSON.parse(token) : token;

    login(cleanToken); 
    navigate('/'); 
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="bg-dark text-light min-vh-100">
      <Header />

      <div className="container d-flex flex-column align-items-center py-5">
        <h2>Bejelentkezés a Jegymester fiókomba</h2>
        <p className="login-text">Szia! Örülünk, hogy újra itt vagy! Jelentkezz be a fiókodba, hogy tudj jegyet vásárolni!</p>
      </div>

      <div className="container d-flex justify-content-center pb-5">
        <div className="card login-card p-4" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
          <div className="card-body">
            <div className="brand-logo text-center mb-4">JEGY<span className="text-white">MESTER</span></div>
            
            {/* Error Message Display */}
            {error && (
              <div className="alert alert-danger py-2 small text-center" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label text-secondary small">E-mail cím</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <i className="fas fa-envelope"></i>
                  </span>
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
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <i className="fas fa-lock"></i>
                  </span>
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

              <button 
                type="submit" 
                className="btn btn-primary w-100 mb-3"
                disabled={loading}
              >
                {loading ? 'Bejelentkezés...' : 'Belépés'}
              </button>
            </form>

            <div className="login-footer text-center">
              <hr className="border-secondary my-3" />
              <p className="small text-secondary">
                Nincs még fiókod? <a href="/register" className="fw-bold text-decoration-none">Regisztráció</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;