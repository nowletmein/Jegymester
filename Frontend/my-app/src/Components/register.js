import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Components/style/comp.css';
import Header from './header.js';
import Footer from './footer.js';

const RegisterPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("A két jelszó nem egyezik!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/Users/Register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        }),
      });

      if (response.ok) {
        // Since your backend returns the token on success:
        const token = await response.text();
        alert("Sikeres regisztráció!");
        // You might want to save the token to context here, 
        // but typically redirected to login is safer for new users.
        navigate('/login');
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Hiba történt a regisztráció során.");
      }
    } catch (err) {
      console.error("Regisztrációs hiba:", err);
      setError("Nem sikerült kapcsolódni a szerverhez.");
    } finally {
      setLoading(false);
    }
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
              
              {error && (
                <div className="alert alert-danger py-2 small mb-3">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label text-secondary small">Teljes név</label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary text-secondary">
                      <i className="fas fa-user"></i>
                    </span>
                    <input 
                      type="text" 
                      className="form-control text-white border-secondary bg-dark" 
                      id="name" 
                      placeholder="Teszt Ádám" 
                      value={formData.name}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="phone" className="form-label text-secondary small">Telefonszám</label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary text-secondary">
                      <i className="fas fa-phone"></i>
                    </span>
                    <input 
                      type="tel" 
                      className="form-control text-white border-secondary bg-dark" 
                      id="phone" 
                      placeholder="+36 1 234 5678" 
                      value={formData.phone}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label text-secondary small">E-mail cím</label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary text-secondary">
                      <i className="fas fa-envelope"></i>
                    </span>
                    <input 
                      type="email" 
                      className="form-control text-white border-secondary bg-dark" 
                      id="email" 
                      placeholder="pelda@email.hu" 
                      value={formData.email}
                      onChange={handleChange}
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
                      className="form-control text-white border-secondary bg-dark" 
                      id="password" 
                      placeholder="******" 
                      value={formData.password}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label text-secondary small">Jelszó mégegyszer</label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary text-secondary">
                      <i className="fas fa-lock"></i>
                    </span>
                    <input 
                      type="password" 
                      className="form-control text-white border-secondary bg-dark" 
                      id="confirmPassword" 
                      placeholder="******" 
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100 mb-3 py-2" 
                  disabled={loading}
                >
                  {loading ? 'Feldolgozás...' : 'Regisztráció'}
                </button>
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