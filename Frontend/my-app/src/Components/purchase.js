import React, { useState, useEffect } from 'react'; // 1. Added useEffect
import { useLocation, useNavigate } from 'react-router-dom';
import '../Components/style/comp.css';
import Header from './header.js';
import Footer from './footer.js';
import { useAuth } from '../context/AuthContext';

//székfoglalás próbálkozás
import SeatSelection from './seatselection.js';



function Purchase() {
  const { user, token, logout } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();
  const { movie, screening } = location.state || {};



//székfoglaláshoz
const [selectedSeats, setSelectedSeats] = useState([]);



  // Formatted date logic
  const formattedDate = screening?.date 
  ? new Date(screening.date).toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  : 'Nincs megadva';
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // 2. Automatically fill data if user is logged in
  useEffect(() => {
    if (user && !user.isGuest) {
      setFormData({
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };




  const handlePurchase = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    // Use user data if logged in, otherwise use form data
    const finalEmail = user.isGuest ? formData.email : user.email;
    const finalPhone = user.isGuest ? formData.phone : user.phone;

    if (!finalEmail || !finalPhone || selectedSeats.length === 0) {
      setMessage('Kérlek tölts ki minden mezőt és válassz egy ülőhelyet.');
      setIsError(true);
      setLoading(false);
      return;
    }

    try {
      for (const seat of selectedSeats) {
  const requestBody = {
    screeningId: Number(screening.screeningId),
    userId: user.isGuest ? 0 : Number(user.id),
    seatNumber: Number(seat.seatNumber),
    phone: finalPhone,
    email: finalEmail,
  };

  const response = await fetch('http://localhost:5000/api/Tickets/Create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: '*/*',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`A jegyvásárlás nem sikerült ennél a széknél: ${seat.seatNumber}`);
  }
}

      setMessage('A jegyvásárlás sikeresen megtörtént.');
	

	//foglaláshoz
	setSelectedSeats([]);	

      if (user.isGuest) setFormData({ email: '', phone: '' });
    } catch (error) {
      setMessage(error.message || 'Hiba történt a vásárlás során.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };







  // Logic for the Add to Cart button
  const handleAddToCart = async () => {
    if (!user || user.isGuest) {
      alert("A kosár funkció használatához kérjük jelentkezzen be!");
      return;
    }

    try {
      // Fixed variable name to screening.screeningId
      const response = await fetch(`http://localhost:5000/api/Users/AddToCart/${screening.screeningId}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'accept': '*/*' 
        }
      });

      if (response.ok) {
        alert("Sikeresen a kosárhoz adva!");
      } else {
        // If the token is expired or invalid, the backend usually returns 401
        alert("Hiba történt a kosárba helyezéskor. Ellenőrizd a bejelentkezésed!");
      }
    } catch (error) {
      console.error("Hiba:", error);
      alert("Hálózati hiba történt.");
    }
  };

  return (
    <>
      <Header />
      <main className="container py-5">
        <div className="mb-4">
          <h1 className="text-white fw-bold">Jegyvásárlás</h1>
          <p className="login-text mb-0">Vásárlás előtt ellenőrizd az adatokat.</p>
        </div>



<SeatSelection
  screeningId={screening.screeningId}
  ticketPrice={ticketPrice}
  maxSelectable={4}
  onSelectionChange={setSelectedSeats}
/>





        <div className="row g-4">
          <div className="col-lg-5">
            <div className="login-card p-4" style={{ maxWidth: '100%' }}>
               <h3 className="text-white mb-4">Kiválasztott vetítés</h3>
               <p className="login-text mb-2"><strong className="text-white">Film:</strong> {movie.title}</p>
               <p className="login-text mb-2"><strong className="text-white">Dátum:</strong> {formattedDate}</p>
               <p className="login-text mb-2"><strong className="text-white">Időpont:</strong> {screening.time}</p>
               {/*<p className="login-text mb-2"><strong className="text-white">Jegyár:</strong> {ticketPrice} Ft</p>*/}
            </div>
          </div>










          <div className="col-lg-7">
            <div className="login-card p-4" style={{ maxWidth: '100%' }}>
              <h3 className="text-white mb-4">Vásárlási adatok</h3>

              <form onSubmit={handlePurchase}>
                {user.isGuest ? (
                  <>
                    <div className="mb-3">
                      <label className="form-label text-white">E-mail cím</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="pelda@email.com"
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
                        placeholder="+36 30 123 4567"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </>
                ) : (
                  <div className="mb-4 p-3 bg-dark border border-secondary rounded">
                    <p className="text-white mb-1"><strong>Név:</strong> {user.name}</p>
                    <p className="text-white mb-1"><strong>E-mail:</strong> {user.email}</p>
                    <p className="text-white mb-0"><strong>Telefon:</strong> {user.phone}</p>
                    <small className="text-secondary mt-2 d-block">A jegyet a profilodban megadott adatokkal vásárolod meg.</small>
                  </div>
                )}

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary w-50" disabled={loading}>
                    {loading ? 'Feldolgozás...' : 'Jegy megvásárlása'}
                  </button>
                  <button type="button" className="btn btn-secondary w-50" onClick={handleAddToCart}>
                    Kosárba helyezés
                  </button>
                </div>
              </form>

              <div className="mt-4 p-3 border border-secondary rounded">
                <p className="login-text mb-0">
                  {user.isGuest 
                    ? "Bejelentkezés nélkül vendégként vásárolsz jegyet." 
                    : "Bejelentkezve vásárolsz, a jegy mentésre kerül a fiókodba."}
                </p>
              </div>

              {message && (
                <div className="mt-4 p-3 border border-secondary rounded">
                  <p className={`mb-0 ${isError ? 'text-danger' : 'text-success'}`}>{message}</p>
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