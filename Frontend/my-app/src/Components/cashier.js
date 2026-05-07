import React, { useState, useEffect } from 'react';
import '../Components/style/comp.css';
import Header from './header.js';
import Footer from './footer.js';
// Change this line to match your file name on disk
import { useAuth } from '../context/AuthContext.js'; 

function Cashier() {
  const { token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [searchCode, setSearchCode] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);

  const BASE_URL = 'http://localhost:5000';

  const [saleForm, setSaleForm] = useState({
    screeningId: '',
    email: '',
    phone: '',
    seatNumber: '',
  });

  useEffect(() => {
    if (token) {
      fetchAllTickets();
    }
  }, [token]);

  const getAuthHeaders = () => ({
    'accept': '*/*',
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  const fetchAllTickets = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/Movies/GetAll`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const movies = await response.json();
        
        const allTickets = movies.flatMap(movie => 
          movie.screeningDtos.flatMap(screening => 
            screening.ticketDtos.map(ticket => ({
              ...ticket,
              movieTitle: movie.title, 
              screeningDate: screening.screeningDate
            }))
          )
        );

        const sortedTickets = allTickets.sort((a, b) => 
          new Date(b.purchaseDate) - new Date(a.purchaseDate)
        );

        setTickets(sortedTickets);
      }
    } catch (error) {
      console.error('Error fetching all tickets:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchCode.trim()) return;

    try {
      const response = await fetch(`${BASE_URL}/api/Tickets/Get/${searchCode}`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedTicket(data);
      } else {
        alert('Nem található ilyen jegykód.');
        setSelectedTicket(null);
      }
    } catch (error) {
      console.error('Error during search:', error);
    }
  };

  const handleValidateTicket = async () => {
    if (!selectedTicket) return;

    try {
      const response = await fetch(`${BASE_URL}/api/Tickets/VerifyTicket/${selectedTicket.id}`, {
        method: 'PATCH',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        alert('A jegy sikeresen ellenőrizve és visszaigazolva.');
        setSelectedTicket({ ...selectedTicket, isVerified: true });
        fetchAllTickets();
      } else {
        alert('Hiba történt a visszaigazolás során.');
      }
    } catch (error) {
      console.error('Validation error:', error);
    }
  };

  const handleSaleChange = (e) => {
    const { name, value } = e.target;
    setSaleForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewSale = async (e) => {
    e.preventDefault();
    try {
      const url = `${BASE_URL}/api/Tickets/CashierCreate/${saleForm.screeningId}/${saleForm.email}/${saleForm.phone}/${saleForm.seatNumber}`;
      const response = await fetch(url, { 
        method: 'POST',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        alert('Sikeres rögzítés.');
        setSaleForm({ screeningId: '', email: '', phone: '', seatNumber: '' });
        fetchAllTickets();
      } else {
        alert('Hiba történt a rögzítés során.');
      }
    } catch (error) {
      console.error('Sale error:', error);
    }
  };

  const validTicketCount = tickets.filter((t) => !t.isCancelled).length;
  const checkedTicketCount = tickets.filter((t) => t.isVerified).length;

  return (
    <>
      <Header />

      <main className="container py-5">
        <div className="mb-4">
          <h1 className="text-white fw-bold">Pénztáros felület</h1>
          <p className="login-text mb-0">
            Jegyek ellenőrzése, visszaigazolása és helyszíni jegyértékesítés kezelése.
          </p>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="login-card p-4 text-center" style={{ maxWidth: '100%' }}>
              <div className="brand-logo">{tickets.length}</div>
              <p className="text-white mb-0">Rögzített jegy</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="login-card p-4 text-center" style={{ maxWidth: '100%' }}>
              <div className="brand-logo">{validTicketCount}</div>
              <p className="text-white mb-0">Érvényes jegy</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="login-card p-4 text-center" style={{ maxWidth: '100%' }}>
              <div className="brand-logo">{checkedTicketCount}</div>
              <p className="text-white mb-0">Visszaigazolt jegy</p>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-5">
            <div className="login-card p-4" style={{ maxWidth: '100%' }}>
              <h3 className="text-white mb-4">Jegy ellenőrzése</h3>
              <div className="mb-3">
                <label className="form-label text-white">Jegykód (ID)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="pl. 14"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                />
              </div>
              <button className="btn btn-primary w-100 mb-4" onClick={handleSearch}>
                Jegy keresése
              </button>

              {selectedTicket ? (
                <div className="border border-secondary rounded p-3">
                  <h5 className="text-white mb-3">{selectedTicket.movieTitle || 'Film adatai'}</h5>
                  <p className="login-text mb-2"><strong className="text-white">Név:</strong> {selectedTicket.userName || 'Vendég'}</p>
                  <p className="login-text mb-2"><strong className="text-white">Email:</strong> {selectedTicket.email}</p>
                  <p className="login-text mb-2"><strong className="text-white">Szék:</strong> {selectedTicket.seatNumber}</p>
                  <p className="login-text mb-2"><strong className="text-white">Kód:</strong> {selectedTicket.id}</p>
                  <p className="login-text mb-2">
                    <strong className="text-white">Állapot:</strong>{' '}
                    <span className={selectedTicket.isCancelled ? 'text-danger' : 'text-success'}>
                      {selectedTicket.isCancelled ? 'Törölt' : 'Érvényes'}
                    </span>
                  </p>
                  <p className="login-text mb-3">
                    <strong className="text-white">Ellenőrizve:</strong>{' '}
                    {selectedTicket.isVerified ? <span className="text-success">Igen</span> : <span className="text-warning">Nem</span>}
                  </p>
                  <button
                    className="btn btn-primary w-100"
                    onClick={handleValidateTicket}
                    disabled={selectedTicket.isVerified || selectedTicket.isCancelled}
                  >
                    Jegy visszaigazolása
                  </button>
                </div>
              ) : (
                <p className="login-text mb-0">Keresés után itt jelennek meg a jegy adatai.</p>
              )}
            </div>
          </div>

          <div className="col-lg-7">
            <div className="login-card p-4" style={{ maxWidth: '100%' }}>
              <h3 className="text-white mb-4">Helyszíni jegyvásárlás</h3>
              <form onSubmit={handleNewSale}>
                <div className="mb-3">
                  <label className="form-label text-white">Email</label>
                  <input type="email" name="email" className="form-control" value={saleForm.email} onChange={handleSaleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label text-white">Telefonszám</label>
                  <input type="text" name="phone" className="form-control" value={saleForm.phone} onChange={handleSaleChange} required />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-white">Vetítés ID</label>
                    <input type="number" name="screeningId" className="form-control" value={saleForm.screeningId} onChange={handleSaleChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-white">Szék száma</label>
                    <input type="number" name="seatNumber" className="form-control" value={saleForm.seatNumber} onChange={handleSaleChange} required />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100">Jegyvásárlás rögzítése</button>
              </form>
            </div>
          </div>
        </div>

        <div className="row g-4 mt-1">
          <div className="col-12">
            <div className="login-card p-4" style={{ maxWidth: '100%' }}>
              <h3 className="text-white mb-4">Jegyek listája</h3>
              <div className="table-responsive">
                <table className="table table-dark table-bordered align-middle">
                  <thead>
                    <tr>
                      <th>Vásárló</th>
                      <th>Film</th>
                      <th>Vásárlás dátuma</th>
                      <th>Szék</th>
                      <th>Email</th>
                      <th>Jegykód</th>
                      <th>Állapot</th>
                      <th>Ellenőrizve</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket) => (
                      <tr key={ticket.id}>
                        <td>{ticket.userName || 'Vendég'}</td>
                        <td>{ticket.movieTitle}</td>
                        <td>{new Date(ticket.purchaseDate).toLocaleString()}</td>
                        <td>{ticket.seatNumber}</td>
                        <td>{ticket.email}</td>
                        <td>{ticket.id}</td>
                        <td>
                          <span className={ticket.isCancelled ? 'text-danger' : 'text-success'}>
                            {ticket.isCancelled ? 'Törölt' : 'Érvényes'}
                          </span>
                        </td>
                        <td>
                          {ticket.isVerified ? <span className="text-success">Igen</span> : <span className="text-warning">Nem</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Cashier;