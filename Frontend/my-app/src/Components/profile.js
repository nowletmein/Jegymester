import React, { useState, useEffect } from 'react';
import '../Components/style/comp.css';
import Header from './header.js';
import Footer from './footer.js';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const { user, logout, refreshUser } = useAuth(); // Added refreshUser from context
  const navigate = useNavigate();

  // Display data
  const [userData, setUserData] = useState({
    fullName: user?.name || 'Vendég',
    email: user?.email || '',
    phone: user?.phone || 'Nincs megadva'
  });

  // Form data for editing
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Initial Load: Refresh user data from API to get latest tickets
  useEffect(() => {
    if (user && !user.isGuest) {
      refreshUser();
    }
  }, []);

  // 2. Update local state when AuthContext user changes
  useEffect(() => {
    if (user) {
      const initialData = {
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      };
      setUserData(initialData);
      setFormData(initialData);
      
      // Handle potential casing differences (tickets vs Tickets)
      setTickets(user.tickets || []);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
    alert('Sikeresen kijelentkezett a fiókjából!');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.phone || !formData.fullName) {
      alert('Minden mező kitöltése kötelező.');
      return;
    }

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
        setUserData({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone
        });
        alert('Profil sikeresen frissítve!');
        refreshUser(); // Sync context with new profile info
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Hiba történt: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Hálózati hiba:', error);
      alert('Nem sikerült elérni a szervert.');
    } finally {
      setLoading(false);
    }
  };

  // Logic for statistics based on your C# DTO properties
  const activeTickets = tickets.filter((t) => !t.isVerified && !t.isCancelled).length;
  const usedTickets = tickets.filter((t) => t.isVerified).length;

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

        {/* Statistics Cards */}
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="login-card p-4 text-center">
              <div className="brand-logo">{user.tickets.length}</div>
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
                  <input 
                    type="text" 
                    name="fullName"
                    className="form-control" 
                    value={formData.fullName} 
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-white">E-mail cím</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-white">Telefonszám</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'Mentés...' : 'Mentés'}
                </button>
              </form>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="login-card p-4">
              <h3 className="text-white mb-4">Fiókadatok</h3>
              <div className="mb-3">
                <p className="login-text mb-2"><strong className="text-white">Név:</strong> {userData.fullName}</p>
                <p className="login-text mb-2"><strong className="text-white">E-mail:</strong> {userData.email}</p>
                <p className="login-text mb-0"><strong className="text-white">Telefon:</strong> {userData.phone}</p>
              </div>
              <hr className="border-secondary" />
              <p className="login-text mb-0 small">
                A regisztrált adatok segítségével kapod meg a vásárlási visszaigazolásokat.
              </p>
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="row g-4 mt-1">
          <div className="col-12">
            <div className="login-card p-4">
              <h3 className="text-white mb-4">Megvásárolt jegyek</h3>
              {user.tickets.length === 0 ? (
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
                      {user.tickets.map((ticket) => {
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