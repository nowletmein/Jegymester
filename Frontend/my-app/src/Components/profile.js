import React, { useState, useEffect } from 'react';
import '../Components/style/comp.css';
import Header from './header.js';
import Footer from './footer.js';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (user && !user.isGuest && user.id !== 0) {
      refreshUser();
    }
  }, [user?.id]); 

  useEffect(() => {
    if (user && !user.isGuest) {
      const initialData = {
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      };
      setUserData(initialData);
      setFormData(initialData);
    }
  }, [user]);

  // --- ELTÁVOLÍTÁS A KOSÁRBÓL ---
  const handleRemoveFromCart = async (screeningId) => {
    if (!window.confirm("Biztosan el akarod távolítani a kosárból?")) return;
    
    try {
      // Itt a screeningId-t küldjük, amit lentebb az item.id-ból nyerünk ki
      const response = await fetch(`http://localhost:5000/api/Users/RemoveFromCart/${user.id}/${screeningId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        refreshUser(); 
      } else {
        alert("Hiba történt az eltávolítás során.");
      }
    } catch (error) {
      console.error("Hálózati hiba:", error);
    }
  };

  const tickets = user?.tickets || user?.Tickets || [];
  const cartItems = user?.shopingCart || []; 
  const activeTickets = tickets.filter((t) => !t.isVerified && !t.isCancelled).length;
  const usedTickets = tickets.filter((t) => t.isVerified).length;

  const handleLogout = () => {
    logout();
    navigate('/');
    alert('Sikeresen kijelentkezett a fiókjából!');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/Users/Edit/${user.id}`, {
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone
        }),
      });

      if (response.ok) {
        alert('Profil sikeresen frissítve!');
        refreshUser(); 
      } else {
        alert('Hiba történt a mentés során.');
      }
    } catch (error) {
      console.error('Hálózati hiba:', error);
    } finally {
      setLoading(false);
    }
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
          <button className="btn btn-outline-danger" onClick={handleLogout}>Kijelentkezés</button>
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
              {cartItems.length === 0 ? (
                <p className="login-text mb-0 text-center py-3">A kosarad jelenleg üres.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-dark table-bordered align-middle">
                    <thead>
                      <tr>
                        <th>Tétel</th>
                        <th>Ár</th>
                        <th>Műveletek</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item, idx) => {
                        // A JSON-öd alapján az azonosító az 'id' mezőben van
                        const sId = item.id;
                        const dateObj = item.screeningDate ? new Date(item.screeningDate) : null;
                        const extractedTime = dateObj ? dateObj.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' }) : "N/A";
                        const extractedDate = dateObj ? dateObj.toLocaleDateString('hu-HU') : "";
                        const dayName = dateObj ? dateObj.toLocaleDateString('hu-HU', { weekday: 'long' }) : "Ismeretlen nap";

                        return (
                          <tr key={idx}>
                            <td>{item.movieName || `Film ID: ${item.movieId}`}</td>
                            <td>{item.price || 0} Ft</td>
                            <td>
                              <div className="d-flex gap-2">
                                <button 
                                  className="btn btn-sm btn-primary flex-grow-1"
                                  onClick={() => navigate('/purchase', {
                                    state: {
                                      movie: {
                                        title: item.movieName || "Film",
                                        genre: "Nincs megadva",
                                        duration: "N/A",
                                        rating: "12"
                                      },
                                      screening: {
                                        screeningId: sId,
                                        time: extractedTime,
                                        roomId: item.roomId,
                                        date: item.screeningDate
                                      },
                                      day: `${dayName} (${extractedDate})`
                                    }
                                  })}
                                >
                                  Vásárlás
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleRemoveFromCart(sId)}
                                  title="Eltávolítás"
                                >
                                  🗑️
                                </button>
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

            <div className="login-card p-4">
              <h3 className="text-white mb-4">Fiókadatok</h3>
              <div className="mb-3">
                <p className="login-text mb-2"><strong className="text-white">Név:</strong> {userData.fullName}</p>
                <p className="login-text mb-2"><strong className="text-white">E-mail:</strong> {userData.email}</p>
                <p className="login-text mb-0"><strong className="text-white">Telefon:</strong> {userData.phone}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4 mt-1">
          <div className="col-12">
  <div className="login-card p-4 w-100" style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <h3 className="text-white mb-4">Megvásárolt jegyek</h3>
              {tickets.length === 0 ? (
                <p className="login-text mb-0 text-center">Még nincs megvásárolt jegyed.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-dark table-bordered align-middle">
                    <thead>
                      <tr>
                        <th>Azonosító</th>
                        <th>Vásárlás dátuma</th>
                        <th>Ár</th>
                        <th>Állapot</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((ticket) => {
                        let statusText = "Aktív";
                        let statusClass = "text-success";
                        if (ticket.isCancelled) {
                          statusText = "Visszaváltva";
                          statusClass = "text-danger";
                        } else if (ticket.isVerified) {
                          statusText = "Felhasznált";
                          statusClass = "text-warning";
                        }
                        return (
                          <tr key={ticket.id}>
                            <td>#{ticket.id}</td>
                            <td>{ticket.purchaseDate ? new Date(ticket.purchaseDate).toLocaleDateString('hu-HU') : 'N/A'}</td>
                            <td>{ticket.price || 0} Ft</td>
                            <td className={statusClass}>{statusText}</td>
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
      </main>
      <Footer />
    </>
  );
}

export default Profile;