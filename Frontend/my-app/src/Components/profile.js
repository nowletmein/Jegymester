import React, { useState, useEffect, useCallback } from 'react';
import '../Components/style/comp.css';
import Header from './header.js';
import Footer from './footer.js';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const { user, token, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [userData, setUserData] = useState({
    fullName: user?.name || 'Vendég',
    email: user?.email || '',
    phone: user?.phone || 'Nincs megadva'
  });

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const [loading, setLoading] = useState(false);

  const fetchExtraData = useCallback(async () => {
    if (!token) return;
    
    setLoadingData(true);
    try {
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      };
      
      const [cartRes, ticketRes] = await Promise.all([
        fetch('http://localhost:5000/api/Users/GetShopingCart', { headers }),
        fetch('http://localhost:5000/api/Users/GetTickets', { headers })
      ]);

      if (cartRes.ok) {
        const cartData = await cartRes.json();
        setCartItems(cartData);
      }

      if (ticketRes.ok) {
        const ticketData = await ticketRes.json();
        setTickets(ticketData);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoadingData(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchExtraData();
    }
  }, [token, fetchExtraData]);

  useEffect(() => {
    if (user && !user.isGuest) {
      const updatedInfo = {
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      };
      setUserData(updatedInfo);
      setFormData(updatedInfo);
    }
  }, [user]);

  const handleRemoveFromCart = async (screeningId) => {
    if (!window.confirm("Biztosan el akarod távolítani a kosárból?")) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/Users/RemoveFromCart/${screeningId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchExtraData();
      }
    } catch (error) {
      console.error("Hiba:", error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/Users/Edit`, {
        method: 'PATCH', 
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone
        }),
      });

      if (response.ok) {
        alert('Profil sikeresen frissítve!');
        refreshUser(); 
      }
    } catch (error) {
      console.error('Hiba:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeTickets = tickets.filter((t) => !t.isVerified && !t.isCancelled).length;
  const usedTickets = tickets.filter((t) => t.isVerified).length;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!user || user.isGuest) {
    return (
      <div className="container py-5 text-center">
        <h2 className="text-white">Kérjük, jelentkezz be a profilod megtekintéséhez.</h2>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/login')}>Belépés</button>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="text-white fw-bold">Felhasználói fiók</h1>
            <p className="login-text mb-0">Üdvözlünk, {userData.fullName}!</p>
          </div>
          <button className="btn btn-outline-danger" onClick={() => { logout(); navigate('/'); }}>Kijelentkezés</button>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="login-card p-4 text-center">
              <div className="brand-logo">{tickets.length}</div>
              <p className="text-white mb-0">Megvásárolt jegy</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="login-card p-4 text-center">
              <div className="brand-logo">{activeTickets}</div>
              <p className="text-white mb-0">Aktív jegy</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="login-card p-4 text-center">
              <div className="brand-logo">{usedTickets}</div>
              <p className="text-white mb-0">Felhasznált jegy</p>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-5">
            <div className="login-card p-4">
              <h3 className="text-white mb-4">Személyes adatok</h3>
              <form onSubmit={handleSave}>
                <div className="mb-3">
                  <label className="form-label text-white">Teljes név</label>
                  <input type="text" name="fullName" className="form-control" value={formData.fullName} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label text-white">E-mail cím</label>
                  <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label text-white">Telefonszám</label>
                  <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'Mentés...' : 'Mentés'}
                </button>
              </form>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="login-card p-4 mb-4">
              <h3 className="text-white mb-4">Kosár tartalma</h3>
              {loadingData ? (
                <p className="text-white text-center">Betöltés...</p>
              ) : cartItems.length === 0 ? (
                <p className="login-text mb-0 text-center py-3">A kosarad jelenleg üres.</p>
              ) : (
                <div className="table-responsive">
                    <table className="table table-dark table-bordered align-middle">
                      <thead>
                        <tr>
                          <th>Film</th>
                          <th>Vetítés dátuma</th>
                          <th>Ár</th>
                          <th>Műveletek</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map((item, idx) => {
                          const dateObj = item.screeningDate ? new Date(item.screeningDate) : null;
                          
                          // Formats to: 2026. április 20., hétfő
                          const extractedFullDate = dateObj ? dateObj.toLocaleDateString('hu-HU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            weekday: 'long'
                          }) : "N/A";

                          const extractedTime = dateObj ? dateObj.toLocaleTimeString('hu-HU', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          }) : "N/A";

                          return (
                            <tr key={idx}>
                              <td>
                                <div className="fw-bold">{item.movieTitle || "Ismeretlen film"}</div>
                              </td>
                              <td>
                                <div>{extractedFullDate}</div>
                                <small className="text-info">{extractedTime}</small>
                              </td>
                              <td>{item.price || 0} Ft</td>
                              <td>
                                <div className="d-flex gap-2">
                                  <button 
                                    className="btn btn-sm btn-primary flex-grow-1"
                                    onClick={() => navigate('/purchase', {
                                      state: {
                                        movie: { title: item.movieTitle || "Film" },
                                        screening: {
                                          screeningId: item.id,
                                          time: extractedTime,
                                          roomId: item.roomId,
                                          date: item.screeningDate
                                        }
                                      }
                                    })}
                                  >
                                    Vásárlás
                                  </button>
                                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveFromCart(item.id)}>🗑️</button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
              )}
            </div>
          </div>
        </div>

        <div className="row g-4 mt-1">
          <div className="col-12">
            <div className="login-card p-4 w-100">
              <h3 className="text-white mb-4">Megvásárolt jegyek</h3>
              {loadingData ? (
                <p className="text-white text-center">Betöltés...</p>
              ) : tickets.length === 0 ? (
                <p className="login-text mb-0 text-center">Még nincs megvásárolt jegyed.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-dark table-bordered align-middle">
                    <thead>
                      <tr>
                        <th>Film</th>
                        <th>Dátum</th>
                        <th>Ár</th>
                        <th>Állapot</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((ticket) => (
                        <tr key={ticket.movieTitle}>
                          <td>#{ticket.movieTitle}</td>
                          <td>{new Date(ticket.purchaseDate).toLocaleDateString('hu-HU')}</td>
                          <td>{ticket.price} Ft</td>
                          <td className={ticket.isCancelled ? "text-danger" : ticket.isVerified ? "text-warning" : "text-success"}>
                            {ticket.isCancelled ? "Visszaváltva" : ticket.isVerified ? "Felhasznált" : "Aktív"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Profile;