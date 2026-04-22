import React, { useState } from 'react';
import '../Components/style/comp.css';
import Header from './header.js';
import Footer from './footer.js';
import { useAuth } from '../context/AuthContext';
import { Link,useNavigate } from 'react-router-dom';




const initialTickets = [
  {
    id: 1,
    movieTitle: 'Dűne: Második rész',
    date: '2025-04-07',
    time: '17:00',
    hall: '1-es terem',
    seat: 'A12',
    code: 'JEGY-1001',
    status: 'Aktív',
  },
  {
    id: 2,
    movieTitle: 'Kung Fu Panda 4',
    date: '2025-04-08',
    time: '12:30',
    hall: '2-es terem',
    seat: 'B05',
    code: 'JEGY-1002',
    status: 'Aktív',
  },
  {
    id: 3,
    movieTitle: 'Godzilla x Kong',
    date: '2025-04-09',
    time: '19:00',
    hall: '3-as terem',
    seat: 'C08',
    code: 'JEGY-1003',
    status: 'Felhasznált',
  },
];

function Profile() {
  const { user, logout } = useAuth(); // 2. Grab user and logout
    const navigate = useNavigate();
    const handleLogout = () => {
      logout();
      navigate('/'); // Redirect to home after logging out
    };

  const [userData, setUserData] = useState(initialUser);
  const [formData, setFormData] = useState(initialUser);
  const [tickets] = useState(initialTickets);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.phone) {
      alert('Az e-mail cím és telefonszám kitöltése kötelező.');
      return;
    }

    setUserData(formData);
    alert('A személyes adatok sikeresen frissítve lettek.');
  };

  const activeTickets = tickets.filter((ticket) => ticket.status === 'Aktív').length;
  const usedTickets = tickets.filter((ticket) => ticket.status === 'Felhasznált').length;

  return (
    <>
      <Header />

      <main className="container py-5">
        <div className="mb-4">
          <h1 className="text-white fw-bold">Felhasználói fiók</h1>
          <p className="login-text mb-0">
            Személyes adatok kezelése és megvásárolt jegyek megtekintése.
          </p>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="login-card p-4 text-center" style={{ maxWidth: '100%' }}>
              <div className="brand-logo">{tickets.length}</div>
              <p className="text-white mb-0">Megvásárolt jegy</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="login-card p-4 text-center" style={{ maxWidth: '100%' }}>
              <div className="brand-logo">{activeTickets}</div>
              <p className="text-white mb-0">Aktív jegy</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="login-card p-4 text-center" style={{ maxWidth: '100%' }}>
              <div className="brand-logo">{usedTickets}</div>
              <p className="text-white mb-0">Felhasznált jegy</p>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-5">
            <div className="login-card p-4" style={{ maxWidth: '100%' }}>
              <h3 className="text-white mb-4">Személyes adatok</h3>

              <div className="mb-3">
                <label className="form-label text-white">Teljes név</label>
                <input
                  type="text"
                  className="form-control"
                  value={userData.fullName}
                  disabled
                />
              </div>

              <form onSubmit={handleSave}>
                <div className="mb-3">
                  <label className="form-label text-white">E-mail cím</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
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
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Adatok mentése
                </button>
              </form>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="login-card p-4" style={{ maxWidth: '100%' }}>
              <h3 className="text-white mb-4">Fiókadatok</h3>

              <div className="mb-3">
                <p className="login-text mb-2">
                  <strong className="text-white">Név:</strong> {userData.fullName}
                </p>
                <p className="login-text mb-2">
                  <strong className="text-white">E-mail:</strong> {userData.email}
                </p>
                <p className="login-text mb-0">
                  <strong className="text-white">Telefon:</strong> {userData.phone}
                </p>
              </div>

              <hr className="border-secondary" />

              <p className="login-text mb-0">
                A regisztrált felhasználók saját fiókkal rendelkeznek, ahol módosíthatják
                személyes adataikat annak érdekében, hogy a vásárlási visszaigazolások és
                vetítési információk megfelelően kézbesíthetők legyenek.
              </p>
            </div>
          </div>
        </div>

        <div className="row g-4 mt-1">
          <div className="col-12">
            <div className="login-card p-4" style={{ maxWidth: '100%' }}>
              <h3 className="text-white mb-4">Megvásárolt jegyek</h3>

              {tickets.length === 0 ? (
                <p className="login-text mb-0">Még nincs megvásárolt jegyed.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-dark table-bordered align-middle">
                    <thead>
                      <tr>
                        <th>Film</th>
                        <th>Dátum</th>
                        <th>Időpont</th>
                        <th>Terem</th>
                        <th>Szék</th>
                        <th>Jegykód</th>
                        <th>Állapot</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((ticket) => (
                        <tr key={ticket.id}>
                          <td>{ticket.movieTitle}</td>
                          <td>{ticket.date}</td>
                          <td>{ticket.time}</td>
                          <td>{ticket.hall}</td>
                          <td>{ticket.seat}</td>
                          <td>{ticket.code}</td>
                          <td>
                            <span
                              className={
                                ticket.status === 'Aktív'
                                  ? 'text-success'
                                  : 'text-warning'
                              }
                            >
                              {ticket.status}
                            </span>
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