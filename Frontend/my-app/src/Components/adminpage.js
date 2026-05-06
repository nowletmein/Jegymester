import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../Components/style/comp.css';
import Header from './header.js';
import Footer from './footer.js';

function Admin() {
  const { user, token } = useAuth(); // Kinyerjük a tokent az AuthContext-ből

  const [activeTab, setActiveTab] = useState('movies'); 
  const [movies, setMovies] = useState([]);
  const [screenings, setScreenings] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [showAddForm, setShowAddForm] = useState(null); 
  const [formData, setFormData] = useState({});

  const normalizePicturePath = (path) => {
    if (!path) return 'https://placehold.co/40x60/1a1a2e/4fc3f7?text=Film';
    return path.replace('/Frontend/my-app/public', '');
  };

  const fetchData = async () => {
    const effectiveToken = token || user?.token; // Debugolt token keresés

    if (!effectiveToken) return;

    const authHeaders = {
      'Authorization': `Bearer ${effectiveToken}`,
      'Content-Type': 'application/json'
    };

    try {
      // Filmek lekérése
      const moviesRes = await fetch('http://localhost:5000/api/Movies/GetAll', { headers: authHeaders });
      if (moviesRes.ok) setMovies(await moviesRes.json());

      // Vetítések lekérése és duplikáció szűrése
      const screeningsRes = await fetch('http://localhost:5000/api/Screenings/GetWeekly', { headers: authHeaders });
      if (screeningsRes.ok) {
        const data = await screeningsRes.json();
        const flatScreenings = data.flatMap(dayGroup => dayGroup.screenings);
        const uniqueScreenings = flatScreenings.filter((v, i, a) => 
          a.findIndex(t => t.movieId === v.movieId && t.roomId === v.roomId && t.screeningDate === v.screeningDate) === i
        );
        setScreenings(uniqueScreenings); 
      }

      // Termek lekérése
      const roomsRes = await fetch('http://localhost:5000/api/Room/GetAll', { headers: authHeaders });
      if (roomsRes.ok) setRooms(await roomsRes.json());

    } catch (error) {
      console.error("Hiba az adatok lekérésekor:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, token]);

  const handleToggleRoomStatus = async (room) => {
    const effectiveToken = token || user?.token;
    try {
      // Fix: Query paraméter és 3 'l' betű a végponton
      const response = await fetch(`http://localhost:5000/api/Room/SetAvailablility?Id=${room.id}`, { 
        method: 'POST',
        headers: { 'Authorization': `Bearer ${effectiveToken}` }
      });
      if (response.ok) fetchData();
    } catch (error) { console.error(error); }
  };

  const handleAddSubmit = async (type) => {
    const effectiveToken = token || user?.token;
    let endpoint = type === 'movie' ? 'Movies/Add' : type === 'screening' ? 'Screenings/Add' : 'Room/Add';
    try {
      const response = await fetch(`http://localhost:5000/api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${effectiveToken}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert("Sikeres mentés!");
        setShowAddForm(null);
        setFormData({});
        fetchData();
      }
    } catch (error) { console.error(error); }
  };

  const handleDeleteMovie = async (id) => {
    const effectiveToken = token || user?.token;
    if (window.confirm("Biztosan törölni szeretnéd ezt a filmet?")) {
      await fetch(`http://localhost:5000/api/Movies/Delete/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${effectiveToken}` }
      });
      fetchData();
    }
  };

  const handleDeleteScreening = async (id) => {
    const effectiveToken = token || user?.token;
    if (window.confirm("Biztosan törölni szeretnéd ezt a vetítést?")) {
      await fetch(`http://localhost:5000/api/Screenings/Delete/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${effectiveToken}` }
      });
      fetchData();
    }
  };

  return (
    <>
      <Header />
      <main className="container py-5">
        <h1 className="text-white text-center fw-bold mb-5">Adminisztrációs felület</h1>

        {/* STATISZTIKA SZÁMLÁLÓK */}
        <div className="row g-4 mb-5 text-center">
          <div className="col-md-4">
            <div className="login-card p-4 shadow">
              <div className="brand-logo text-primary h1">{movies.length}</div>
              <p className="text-white mb-0">Rögzített film</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="login-card p-4 shadow">
              <div className="brand-logo text-primary h1">{screenings.length}</div>
              <p className="text-white mb-0">Aktív vetítés</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="login-card p-4 shadow">
              <div className="brand-logo text-primary h1">{rooms.length}</div>
              <p className="text-white mb-0">Regisztrált terem</p>
            </div>
          </div>
        </div>

        {/* NAVIGÁCIÓ ÉS ÚJ ELEM GOMB */}
        <div className="d-flex flex-wrap gap-2 mb-4 p-3 login-card align-items-center justify-content-between shadow">
          <div className="d-flex gap-2">
            <button className={`btn ${activeTab === 'movies' ? 'btn-primary shadow' : 'btn-outline-light'}`} onClick={() => setActiveTab('movies')}>FILMEK</button>
            <button className={`btn ${activeTab === 'screenings' ? 'btn-primary shadow' : 'btn-outline-light'}`} onClick={() => setActiveTab('screenings')}>Vetítések</button>
            <button className={`btn ${activeTab === 'rooms' ? 'btn-primary shadow' : 'btn-outline-light'}`} onClick={() => setActiveTab('rooms')}>Termek</button>
          </div>
          <button className="btn btn-success shadow" onClick={() => setShowAddForm(activeTab === 'movies' ? 'movie' : activeTab === 'screenings' ? 'screening' : 'room')}>
            Új {activeTab === 'movies' ? 'film' : activeTab === 'screenings' ? 'vetítés' : 'terem'}
          </button>
        </div>

        {/* DINAMIKUS HOZZÁADÁSŰRLAP */}
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

        {/* ADATTÁBLÁZATOK */}
        <div className="login-card p-0 overflow-hidden shadow-lg border-top border-primary border-3">
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle mb-0">
                <thead className="table-primary text-dark">
                  <tr>
                    {activeTab === 'movies' && (<><th>Kép</th><th>Cím</th><th>Hossz</th><th className="text-center">Műveletek</th></>)}
                    {activeTab === 'screenings' && (<><th>Kép</th><th>Film címe</th><th>Terem</th><th>Időpont</th><th>Ár</th><th className="text-center">Műveletek</th></>)}
                    {activeTab === 'rooms' && (<><th>ID</th><th>Név</th><th>Kapacitás</th><th>Státusz</th><th className="text-center">Műveletek</th></>)}
                  </tr>
                </thead>
                <tbody>
                  {activeTab === 'movies' && movies.map(movie => (
                    <tr key={movie.id}>
                      <td><img src={normalizePicturePath(movie.picturePath)} alt="film" style={{ width: '40px', borderRadius: '4px' }} /></td>
                      <td className="fw-bold">{movie.title}</td>
                      <td>{movie.length} perc</td>
                      <td className="text-center"><button className="btn btn-danger btn-sm shadow-sm" onClick={() => handleDeleteMovie(movie.id)}>Törlés</button></td>
                    </tr>
                  ))}
                  {activeTab === 'screenings' && screenings.sort((a, b) => {
                      const titleA = movies.find(m => m.id === a.movieId)?.title || '';
                      const titleB = movies.find(m => m.id === b.movieId)?.title || '';
                      return titleA.localeCompare(titleB);
                    }).map(screening => {
                    const movie = movies.find(m => m.id === screening.movieId);
                    const room = rooms.find(r => r.id === screening.roomId);
                    return (
                      <tr key={screening.id}>
                        <td><img src={normalizePicturePath(movie?.picturePath)} alt="film" style={{ width: '40px', borderRadius: '4px' }} /></td>
                        <td className="fw-bold text-info">{movie?.title || 'Betöltés...'}</td>
                        <td>
                          <span className={`badge ${room?.available ? 'bg-success' : 'bg-danger'} me-2`} style={{width: '10px', height: '10px', padding: 0, borderRadius: '50%', display: 'inline-block'}}> </span>
                          {room?.name || screening.roomId}
                        </td>
                        <td>{new Date(screening.screeningDate).toLocaleString('hu-HU')}</td>
                        <td>{screening.price} Ft</td>
                        <td className="text-center"><button className="btn btn-danger btn-sm shadow-sm" onClick={() => handleDeleteScreening(screening.id)}>Törlés</button></td>
                      </tr>
                    );
                  })}
                  {activeTab === 'rooms' && rooms.map(room => (
                    <tr key={room.id}>
                      <td>{room.id}</td>
                      <td className="fw-bold">{room.name}</td>
                      <td>{room.capacity} fő</td>
                      <td>{room.available ? <span className="badge bg-success">Aktív</span> : <span className="badge bg-danger">Inaktív</span>}</td>
                      <td className="text-center"><button className="btn btn-sm btn-outline-light shadow-sm" onClick={() => handleToggleRoomStatus(room)}>Váltás</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Admin;