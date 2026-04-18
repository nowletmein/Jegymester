import React, { useState } from 'react';
import '../Components/style/comp.css';
import Header from './header.js';
import Footer from './footer.js';

const initialTickets = [
  {
    id: 1,
    customerName: 'Kovács Anna',
    movieTitle: 'Dűne: Második rész',
    date: '2025-04-07',
    time: '17:00',
    seat: 'A12',
    code: 'JEGY-1001',
    status: 'Érvényes',
    checked: false,
  },
  {
    id: 2,
    customerName: 'Nagy Péter',
    movieTitle: 'Kung Fu Panda 4',
    date: '2025-04-08',
    time: '12:30',
    seat: 'B05',
    code: 'JEGY-1002',
    status: 'Érvényes',
    checked: true,
  },
  {
    id: 3,
    customerName: 'Szabó Lilla',
    movieTitle: 'Godzilla x Kong',
    date: '2025-04-09',
    time: '19:00',
    seat: 'C08',
    code: 'JEGY-1003',
    status: 'Érvénytelen',
    checked: false,
  },
];

const movieOptions = [
  'Dűne: Második rész',
  'Kung Fu Panda 4',
  'Godzilla x Kong',
  'Civil War',
  'Ghostbusters: Frozen Empire',
];

function Cashier() {
  const [tickets, setTickets] = useState(initialTickets);
  const [searchCode, setSearchCode] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [saleForm, setSaleForm] = useState({
    customerName: '',
    movieTitle: '',
    date: '',
    time: '',
    seat: '',
  });

  const handleSearch = () => {
    const foundTicket = tickets.find(
      (ticket) => ticket.code.toLowerCase() === searchCode.trim().toLowerCase()
    );

    if (!foundTicket) {
      alert('Nem található ilyen jegykód.');
      setSelectedTicket(null);
      return;
    }

    setSelectedTicket(foundTicket);
  };

  const handleValidateTicket = () => {
    if (!selectedTicket) return;

    if (selectedTicket.status !== 'Érvényes') {
      alert('Ez a jegy nem érvényes, ezért nem igazolható vissza.');
      return;
    }

    if (selectedTicket.checked) {
      alert('Ez a jegy már vissza lett igazolva.');
      return;
    }

    const updatedTickets = tickets.map((ticket) =>
      ticket.id === selectedTicket.id
        ? { ...ticket, checked: true }
        : ticket
    );

    setTickets(updatedTickets);
    setSelectedTicket((prev) => ({ ...prev, checked: true }));
    alert('A jegy sikeresen ellenőrizve és visszaigazolva.');
  };

  const handleSaleChange = (e) => {
    const { name, value } = e.target;
    setSaleForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewSale = (e) => {
    e.preventDefault();

    if (
      !saleForm.customerName ||
      !saleForm.movieTitle ||
      !saleForm.date ||
      !saleForm.time ||
      !saleForm.seat
    ) {
      alert('Kérlek tölts ki minden mezőt a helyszíni jegyvásárláshoz.');
      return;
    }

    const newTicket = {
      id: Date.now(),
      customerName: saleForm.customerName,
      movieTitle: saleForm.movieTitle,
      date: saleForm.date,
      time: saleForm.time,
      seat: saleForm.seat,
      code: `JEGY-${Date.now().toString().slice(-6)}`,
      status: 'Érvényes',
      checked: false,
    };

    setTickets((prev) => [newTicket, ...prev]);

    setSaleForm({
      customerName: '',
      movieTitle: '',
      date: '',
      time: '',
      seat: '',
    });

    alert('A helyszíni jegyvásárlás sikeresen rögzítve.');
  };

  const validTicketCount = tickets.filter((ticket) => ticket.status === 'Érvényes').length;
  const checkedTicketCount = tickets.filter((ticket) => ticket.checked).length;

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
                <label className="form-label text-white">Jegykód</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="pl. JEGY-1001"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                />
              </div>

              <button className="btn btn-primary w-100 mb-4" onClick={handleSearch}>
                Jegy keresése
              </button>

              {selectedTicket ? (
                <div className="border border-secondary rounded p-3">
                  <h5 className="text-white mb-3">{selectedTicket.movieTitle}</h5>

                  <p className="login-text mb-2">
                    <strong className="text-white">Név:</strong> {selectedTicket.customerName}
                  </p>
                  <p className="login-text mb-2">
                    <strong className="text-white">Dátum:</strong> {selectedTicket.date}
                  </p>
                  <p className="login-text mb-2">
                    <strong className="text-white">Időpont:</strong> {selectedTicket.time}
                  </p>
                  <p className="login-text mb-2">
                    <strong className="text-white">Szék:</strong> {selectedTicket.seat}
                  </p>
                  <p className="login-text mb-2">
                    <strong className="text-white">Kód:</strong> {selectedTicket.code}
                  </p>
                  <p className="login-text mb-2">
                    <strong className="text-white">Állapot:</strong>{' '}
                    <span
                      className={
                        selectedTicket.status === 'Érvényes'
                          ? 'text-success'
                          : 'text-danger'
                      }
                    >
                      {selectedTicket.status}
                    </span>
                  </p>
                  <p className="login-text mb-3">
                    <strong className="text-white">Ellenőrizve:</strong>{' '}
                    {selectedTicket.checked ? (
                      <span className="text-success">Igen</span>
                    ) : (
                      <span className="text-warning">Nem</span>
                    )}
                  </p>

                  <button
                    className="btn btn-primary w-100"
                    onClick={handleValidateTicket}
                    disabled={selectedTicket.checked || selectedTicket.status !== 'Érvényes'}
                  >
                    Jegy visszaigazolása
                  </button>
                </div>
              ) : (
                <p className="login-text mb-0">
                  Keresés után itt jelennek meg a jegy adatai.
                </p>
              )}
            </div>
          </div>

          <div className="col-lg-7">
            <div className="login-card p-4" style={{ maxWidth: '100%' }}>
              <h3 className="text-white mb-4">Helyszíni jegyvásárlás</h3>

              <form onSubmit={handleNewSale}>
                <div className="mb-3">
                  <label className="form-label text-white">Vásárló neve</label>
                  <input
                    type="text"
                    name="customerName"
                    className="form-control"
                    value={saleForm.customerName}
                    onChange={handleSaleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-white">Film</label>
                  <select
                    name="movieTitle"
                    className="form-control"
                    value={saleForm.movieTitle}
                    onChange={handleSaleChange}
                  >
                    <option value="">Válassz filmet</option>
                    {movieOptions.map((movie) => (
                      <option key={movie} value={movie}>
                        {movie}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label text-white">Dátum</label>
                    <input
                      type="date"
                      name="date"
                      className="form-control"
                      value={saleForm.date}
                      onChange={handleSaleChange}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label text-white">Időpont</label>
                    <input
                      type="time"
                      name="time"
                      className="form-control"
                      value={saleForm.time}
                      onChange={handleSaleChange}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label text-white">Szék</label>
                    <input
                      type="text"
                      name="seat"
                      className="form-control"
                      placeholder="pl. D10"
                      value={saleForm.seat}
                      onChange={handleSaleChange}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Jegyvásárlás rögzítése
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="row g-4 mt-1">
          <div className="col-12">
            <div className="login-card p-4" style={{ maxWidth: '100%' }}>
              <h3 className="text-white mb-4">Jegyek listája</h3>

              {tickets.length === 0 ? (
                <p className="login-text mb-0">Nincs rögzített jegy.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-dark table-bordered align-middle">
                    <thead>
                      <tr>
                        <th>Vásárló</th>
                        <th>Film</th>
                        <th>Dátum</th>
                        <th>Időpont</th>
                        <th>Szék</th>
                        <th>Jegykód</th>
                        <th>Állapot</th>
                        <th>Ellenőrizve</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((ticket) => (
                        <tr key={ticket.id}>
                          <td>{ticket.customerName}</td>
                          <td>{ticket.movieTitle}</td>
                          <td>{ticket.date}</td>
                          <td>{ticket.time}</td>
                          <td>{ticket.seat}</td>
                          <td>{ticket.code}</td>
                          <td>
                            <span
                              className={
                                ticket.status === 'Érvényes'
                                  ? 'text-success'
                                  : 'text-danger'
                              }
                            >
                              {ticket.status}
                            </span>
                          </td>
                          <td>
                            {ticket.checked ? (
                              <span className="text-success">Igen</span>
                            ) : (
                              <span className="text-warning">Nem</span>
                            )}
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

export default Cashier;