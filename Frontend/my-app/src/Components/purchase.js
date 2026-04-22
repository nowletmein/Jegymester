import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../Components/style/comp.css';
import Header from './header.js';
import Footer from './footer.js';

function Purchase() {
  const location = useLocation();
  const { movie, screening, day } = location.state || {};

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Később ide jöhet a loginból kiolvasott user ID
  const loggedInUserId = null;
  const resolvedUserId = loggedInUserId ?? 0;

  if (!movie || !screening) {
    return (
      <>
        <Header />

        <main className="container py-5">
          <div className="login-card p-4 text-center" style={{ maxWidth: '100%' }}>
            <h1 className="text-white fw-bold mb-3">Jegyvásárlás</h1>
            <p className="login-text mb-0">
              Nincs kiválasztott vetítés. Kérlek térj vissza a műsor oldalra.
            </p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  const ticketPrice = Number(screening?.price ?? 0);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePurchase = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    if (!formData.email || !formData.phone) {
      setMessage('Kérlek tölts ki minden mezőt.');
      setIsError(true);
      setLoading(false);
      return;
    }

    try {
      const requestBody = {
        screeningId: Number(screening.screeningId),
        userId: resolvedUserId,
        phone: formData.phone,
        email: formData.email,
      };

      console.log('PURCHASE REQUEST:', requestBody);

      const response = await fetch('http://localhost:5000/api/Tickets/Create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('A jegyvásárlás nem sikerült.');
      }

      setMessage('A jegyvásárlás sikeresen megtörtént.');
      setIsError(false);

      setFormData({
        email: '',
        phone: '',
      });
    } catch (error) {
      setMessage(error.message || 'Hiba történt a vásárlás során.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="container py-5">
        <div className="mb-4">
          <h1 className="text-white fw-bold">Jegyvásárlás</h1>
          <p className="login-text mb-0">
            Vásárlás előtt ellenőrizd az adatokat.
          </p>
        </div>

        <div className="row g-4">
          <div className="col-lg-5">
            <div className="login-card p-4" style={{ maxWidth: '100%' }}>
              <h3 className="text-white mb-4">Kiválasztott vetítés</h3>

              <p className="login-text mb-2">
                <strong className="text-white">Film:</strong> {movie.title}
              </p>
              <p className="login-text mb-2">
                <strong className="text-white">Rendező:</strong> {movie.genre}
              </p>
              <p className="login-text mb-2">
                <strong className="text-white">Játékidő:</strong> {movie.duration}
              </p>
              <p className="login-text mb-2">
                <strong className="text-white">Korhatár:</strong> {movie.rating}+
              </p>
              <p className="login-text mb-2">
                <strong className="text-white">Nap:</strong>{' '}
                {day
                  ? typeof day === 'object'
                    ? `${day.label}, ${day.short}`
                    : day
                  : ''}
              </p>
              <p className="login-text mb-2">
                <strong className="text-white">Időpont:</strong> {screening.time}
              </p>
              <p className="login-text mb-3">
                <strong className="text-white">Terem:</strong> {screening.roomId}
              </p>

              <hr className="border-secondary" />

              <p className="login-text mb-2">
                <strong className="text-white">Jegyár:</strong> {ticketPrice} Ft
              </p>
              <p className="login-text mb-0">
                <strong className="text-white">Vetítés azonosító:</strong> {screening.screeningId}
              </p>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="login-card p-4" style={{ maxWidth: '100%' }}>
              <h3 className="text-white mb-4">Vásárlási adatok</h3>

              <form onSubmit={handlePurchase}>
                <div className="mb-3">
                  <label className="form-label text-white">E-mail cím</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="pelda@email.com"
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
                    placeholder="+36 30 123 4567"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

	<div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary w-50"
                  disabled={loading}
                >
                  {loading ? 'Feldolgozás...' : 'Jegy megvásárlása'}
                </button>

		<button
  		type="submit"
  		className="btn btn-secondary w-50"
  			//onClick={handleAddToCart}
		>
  		Kosárba helyezés
		</button>
	</div>
              </form>

              <div className="mt-4 p-3 border border-secondary rounded">
                <p className="login-text mb-0">
                  Bejelentkezés nélkül vendégként vásárolsz jegyet.
                </p>
              </div>

              {message && (
                <div className="mt-4 p-3 border border-secondary rounded">
                  <p className={`mb-0 ${isError ? 'text-danger' : 'text-success'}`}>
                    {message}
                  </p>
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

export default Purchase;