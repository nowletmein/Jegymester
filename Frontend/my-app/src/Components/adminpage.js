import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../Components/style/comp.css';
import Header from './header.js';
import Footer from './footer.js';

function Admin() {
  const { user } = useAuth(); // Bejelentkezett admin adatai (token)

  const [activeTab, setActiveTab] = useState('movies'); 
  const [movies, setMovies] = useState([]);
  const [screenings, setScreenings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [problematicScreenings, setProblematicScreenings] = useState([]);

  const [showAddForm, setShowAddForm] = useState(null); 
  const [formData, setFormData] = useState({});

  const normalizePicturePath = (path) => {
    if (!path) return 'https://placehold.co/40x60/1a1a2e/4fc3f7?text=Film';
    return path.replace('/Frontend/my-app/public', '');
  };

  const fetchData = async () => {
    if (!user || !user.token) return;

    const headers = {
      'Authorization': `Bearer ${user.token}`,
      'Content-Type': 'application/json'
    };

    try {
      const moviesRes = await fetch('http://localhost:5000/api/Movies/GetAll', { headers });
      if (moviesRes.ok) setMovies(await moviesRes.json());

      const screeningsRes = await fetch('http://localhost:5000/api/Screenings/GetWeekly', { headers });
      if (screeningsRes.ok) {
        const data = await screeningsRes.json();
        const flatScreenings = data.flatMap(dayGroup => dayGroup.screenings);
        
        const uniqueScreenings = flatScreenings.filter((v, i, a) => 
          a.findIndex(t => 
            t.movieId === v.movieId && 
            t.roomId === v.roomId && 
            t.screeningDate === v.screeningDate
          ) === i
        );
        setScreenings(uniqueScreenings); 
      }

      const roomsRes = await fetch('http://localhost:5000/api/Room/GetAll', { headers });
      if (roomsRes.ok) setRooms(await roomsRes.json());

      const probRes = await fetch('http://localhost:5000/api/Screenings/GetRoomUnavailableScreenings', { headers });
      if (probRes.ok) setProblematicScreenings(await probRes.json());

    } catch (error) {
      console.error("Hiba az adatok lekérésekor:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleToggleRoomStatus = async (room) => {
    try {
      const response = await fetch(`http://localhost:5000/api/Room/SetAvailablility?Id=${room.id}`, { 
        method: 'POST',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (response.ok) fetchData();
    } catch (error) {
      console.error("Hiba:", error);
    }
  };

  const handleAddSubmit = async (type) => {
    let endpoint = '';
    if (type === 'movie') endpoint = 'Movies/Create';
    if (type === 'screening') endpoint = 'Screenings/Create'; 
    if (type === 'room') endpoint = 'Room/Create';

    try {
      const response = await fetch(`http://localhost:5000/api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("Sikeres mentés!");
        setShowAddForm(null);
        setFormData({});
        fetchData();
      } else {
        alert("Hiba történt a mentéskor!");
      }
    } catch (error) {
      console.error("Hiba:", error);
    }
  };

  const handleDeleteMovie = async (id) => {
    if (window.confirm("Biztosan törölni szeretnéd ezt a filmet?")) {
      await fetch(`http://localhost:5000/api/Movies/Delete/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      fetchData();
    }
  };

  const handleDeleteScreening = async (id) => {
    if (window.confirm("Biztosan törölni szeretnéd ezt a vetítést?")) {
      await fetch(`http://localhost:5000/api/Screenings/Delete/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      fetchData();
    }
  };

  return (
    <>
      <Header />
      <main className="container py-5">
        <h1 className="text-white fw-bold mb-4">Adminisztrációs felület</h1>

        {problematicScreenings.length > 0 && (
          <div className="alert alert-danger shadow-lg border-start border-5 border-danger p-4 mb-5">
            <h4 className="fw-bold">⚠️ Kritikus hiba: Inaktív terem használata!</h4>
            <p className="mb-0">Jelenleg {problematicScreenings.length} vetítés érintett.</p>
          </div>
        )}

        <div className="row g-4 mb-4 text-center">
          <div className="col-md-4">
            <div className="login-card p-4">
              <div className="brand-logo text-primary">{movies.length}</div>
              <p className="text-white mb-0">Rögzített film</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="login-card p-4">
              <div className="brand-logo text-primary">{screenings.length}</div>
              <p className="text-white mb-0">Aktív vetítés</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="login-card p-4">
              <div className="brand-logo text-primary">{rooms.length}</div>
              <p className="text-white mb-0">Regisztrált terem</p>
            </div>
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2 mb-4 p-3 login-card align-items-center justify-content-between">
          <div className="d-flex gap-2">
            <button className={`btn ${activeTab === 'movies' ? 'btn-primary' : 'btn-outline-light'}`} onClick={() => setActiveTab('movies')}>Filmek</button>
            <button className={`btn ${activeTab === 'screenings' ? 'btn-primary' : 'btn-outline-light'}`} onClick={() => setActiveTab('screenings')}>Vetítések</button>
            <button className={`btn ${activeTab === 'rooms' ? 'btn-primary' : 'btn-outline-light'}`} onClick={() => setActiveTab('rooms')}>Termek</button>
          </div>
          <button className="btn btn-success" onClick={() => setShowAddForm(activeTab === 'movies' ? 'movie' : activeTab === 'screenings' ? 'screening' : 'room')}>
            <i className="fas fa-plus me-2"></i> Új {activeTab === 'movies' ? 'film' : activeTab === 'screenings' ? 'vetítés' : 'terem'}
          </button>
        </div>

        {showAddForm && (
          <div className="login-card p-4 mb-4 border border-success">
            <h3 className="text-white mb-3">Új elem rögzítése</h3>
            <div className="row g-3">
              {showAddForm === 'movie' && (
                <>
                  <div className="col-md-4"><input type="text" className="form-control bg-dark text-white" placeholder="Cím" onChange={e => setFormData({...formData, title: e.target.value})} /></div>
                  <div className="col-md-4"><input type="number" className="form-control bg-dark text-white" placeholder="Perc" onChange={e => setFormData({...formData, length: parseInt(e.target.value)})} /></div>
                  <div className="col-md-4"><input type="text" className="form-control bg-dark text-white" placeholder="Kép elérési út" onChange={e => setFormData({...formData, picturePath: e.target.value})} /></div>
                </>
              )}
              {showAddForm === 'screening' && (
                <>
                  <div className="col-md-3">
                    <select className="form-select bg-dark text-white" onChange={e => setFormData({...formData, movieId: parseInt(e.target.value)})}>
                      <option>Válassz filmet...</option>
                      {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <select className="form-select bg-dark text-white" onChange={e => setFormData({...formData, roomId: parseInt(e.target.value)})}>
                      <option>Válassz termet...</option>
                      {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>
                  <div className="col-md-3"><input type="datetime-local" className="form-control bg-dark text-white" onChange={e => setFormData({...formData, screeningDate: e.target.value})} /></div>
                  <div className="col-md-3"><input type="number" className="form-control bg-dark text-white" placeholder="Ár" onChange={e => setFormData({...formData, price: parseInt(e.target.value)})} /></div>
                </>
              )}
              {showAddForm === 'room' && (
                <>
                  <div className="col-md-6"><input type="text" className="form-control bg-dark text-white" placeholder="Terem neve" onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                  <div className="col-md-6"><input type="number" className="form-control bg-dark text-white" placeholder="Kapacitás" onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})} /></div>
                </>
              )}
            </div>
            <div className="mt-3 d-flex gap-2">
              <button className="btn btn-success" onClick={() => handleAddSubmit(showAddForm)}>Mentés</button>
              <button className="btn btn-outline-secondary" onClick={() => setShowAddForm(null)}>Mégse</button>
            </div>
          </div>
        )}

        {activeTab === 'rooms' && (
          <div className="login-card p-4 table-responsive">
            <table className="table table-dark table-striped align-middle">
              <thead>
                <tr><th>ID</th><th>Név</th><th>Kapacitás</th><th>Státusz</th><th>Műveletek</th></tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td>{room.id}</td>
                    <td className="fw-bold">{room.name}</td>
                    <td>{room.capacity} fő</td>
                    <td>{room.available ? <span className="badge bg-success">Aktív</span> : <span className="badge bg-danger">Inaktív</span>}</td>
                    <td><button className="btn btn-sm btn-outline-light" onClick={() => handleToggleRoomStatus(room)}>Váltás</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'movies' && (
          <div className="login-card p-4 table-responsive">
            <table className="table table-dark table-striped align-middle">
              <thead>
                <tr><th>Kép</th><th>Cím</th><th>Hossz</th><th>Műveletek</th></tr>
              </thead>
              <tbody>
                {movies.map((movie) => (
                  <tr key={movie.id}>
                    <td><img src={normalizePicturePath(movie.picturePath)} alt="film" style={{ width: '40px', borderRadius: '4px' }} /></td>
                    <td className="fw-bold text-primary">{movie.title}</td>
                    <td>{movie.length} perc</td>
                    <td><button className="btn btn-danger btn-sm" onClick={() => handleDeleteMovie(movie.id)}>Törlés</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'screenings' && (
          <div className="login-card p-4 table-responsive">
            <table className="table table-dark table-striped align-middle">
              <thead>
                <tr><th>Kép</th><th>Film címe</th><th>Terem & Állapot</th><th>Időpont</th><th>Ár</th><th>Műveletek</th></tr>
              </thead>
              <tbody>
                {screenings
                  .slice()
                  .sort((a, b) => {
                    const titleA = movies.find(m => m.id === a.movieId)?.title || '';
                    const titleB = movies.find(m => m.id === b.movieId)?.title || '';
                    return titleA.localeCompare(titleB);
                  })
                  .map((screening) => {
                    const movie = movies.find(m => m.id === screening.movieId);
                    const room = rooms.find(r => r.id === screening.roomId);
                    return (
                      <tr key={screening.id}>
                        <td><img src={normalizePicturePath(movie?.picturePath)} alt="film" style={{ width: '40px', borderRadius: '4px' }} /></td>
                        <td>
                          <div className="fw-bold text-primary">{movie?.title || 'Ismeretlen'}</div>
                          <small className="text-secondary">Film ID: {screening.movieId}</small>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                             <span 
                               className={`badge rounded-circle p-1 ${room?.available ? 'bg-success' : 'bg-danger'}`} 
                               style={{ width: '10px', height: '10px' }}
                             ></span>
                             <span>{room?.name || `Terem ${screening.roomId}`}</span>
                          </div>
                        </td>
                        <td>{new Date(screening.screeningDate).toLocaleString('hu-HU')}</td>
                        <td>{screening.price} Ft</td>
                        <td>
                          {/* JAVÍTÁS: A gombba szöveget tettünk az ikon mellé a láthatóság érdekében */}
                          <button className="btn btn-danger btn-sm" onClick={() => handleDeleteScreening(screening.id)}>
                            Törlés
                          </button>
                        </td>
                      </tr>
                    );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default Admin;