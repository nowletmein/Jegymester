import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../Components/style/comp.css';
import Header from './header.js';
import Footer from './footer.js';

function Admin() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('movies');
  const [movies, setMovies] = useState([]);
  const [screenings, setScreenings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ active: false, type: null, mode: 'add', data: {} });

  const normalizePath = (p) => p ? p.replace('/Frontend/my-app/public', '') : 'https://placehold.co/40x60/1a1a2e/4fc3f7?text=Film';

  const fetchData = async () => {
    const t = token || user?.token;
    if (!t) return;
    const h = { 'Authorization': `Bearer ${t}`, 'Content-Type': 'application/json' };

    try {
      const [mR, sR, rR] = await Promise.all([
        fetch('http://localhost:5000/api/Movies/GetAll', { headers: h }),
        fetch('http://localhost:5000/api/Screenings/GetWeekly', { headers: h }),
        fetch('http://localhost:5000/api/Room/GetAll', { headers: h })
      ]);

      if (mR.ok) setMovies(await mR.json());
      if (rR.ok) setRooms(await rR.json());
      if (sR.ok) {
        const d = await sR.json();
        const flat = d.flatMap(i => i.screenings);
        setScreenings(flat.filter((v, i, a) => a.findIndex(t => t.movieId === v.movieId && t.roomId === v.roomId && t.screeningDate === v.screeningDate) === i));
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, [user, token]);

  const handleSubmit = async () => {
    const t = token || user?.token;
    const isAdd = form.mode === 'add';
    const ep = `http://localhost:5000/api/${form.type === 'movie' ? 'Movies' : form.type === 'screening' ? 'Screenings' : 'Room'}/${isAdd ? 'Add' : 'Update'}`;

    const res = await fetch(ep, {
      method: isAdd ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${t}` },
      body: JSON.stringify(form.data)
    });

    if (res.ok) {
      setForm({ active: false, type: null, mode: 'add', data: {} });
      fetchData();
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm("Törlés?")) return;
    const t = token || user?.token;
    const ep = `http://localhost:5000/api/${type === 'movie' ? 'Movies' : 'Screenings'}/Delete/${id}`;
    const res = await fetch(ep, { method: 'DELETE', headers: { 'Authorization': `Bearer ${t}` } });
    if (res.ok) fetchData();
  };

  const toggleRoom = async (r) => {
    const t = token || user?.token;
    await fetch(`http://localhost:5000/api/Room/SetAvailablility?Id=${r.id}`, { method: 'POST', headers: { 'Authorization': `Bearer ${t}` } });
    fetchData();
  };

  return (
    <>
      <Header />
      <main className="container py-3">
        <h2 className="text-white text-center fw-bold mb-4">Adminisztráció</h2>

        <div className="row g-2 mb-4 text-center">
          {[{v: movies.length, t: 'Film'}, {v: screenings.length, t: 'Vetítés'}, {v: rooms.length, t: 'Terem'}].map((s, i) => (
            <div className="col-4" key={i}>
              <div className="login-card p-2 border-bottom border-primary border-2">
                <div className="text-primary fw-bold h4 m-0">{s.v}</div>
                <small className="text-white-50">{s.t}</small>
              </div>
            </div>
          ))}
        </div>

        <div className="d-flex justify-content-between mb-3 p-2 login-card shadow-sm">
          <div className="btn-group btn-group-sm">
            {['movies', 'screenings', 'rooms'].map(t => (
              <button key={t} className={`btn ${activeTab === t ? 'btn-primary' : 'btn-outline-light'}`} onClick={() => setActiveTab(t)}>{t.toUpperCase()}</button>
            ))}
          </div>
          <button className="btn btn-success btn-sm px-3" onClick={() => setForm({ active: true, type: activeTab.slice(0,-1), mode: 'add', data: {} })}>+ Új</button>
        </div>

        <div className="row g-3">
          <div className={form.active ? "col-lg-7" : "col-12"}>
            <div className="login-card p-0 overflow-hidden border-top border-primary border-2">
              <table className="table table-dark table-sm table-hover align-middle mb-0 text-center" style={{fontSize: '0.85rem'}}>
                <thead className="table-primary text-dark">
                  <tr>
                    {activeTab === 'movies' && (<><th>Kép</th><th>Cím</th><th>Hossz</th><th>Műveletek</th></>)}
                    {activeTab === 'screenings' && (<><th>Film</th><th>Terem</th><th>Időpont</th><th>Műveletek</th></>)}
                    {activeTab === 'rooms' && (<><th>Név</th><th>Fő</th><th>Állapot</th><th>Műveletek</th></>)}
                  </tr>
                </thead>
                <tbody>
                  {activeTab === 'movies' && movies.map(m => (
                    <tr key={m.id} className={form.data.id === m.id ? "table-active" : ""}>
                      <td><img src={normalizePath(m.picturePath)} alt="f" style={{ width: '30px' }} /></td>
                      <td className="fw-bold">{m.title}</td>
                      <td>{m.length}p</td>
                      <td>
                        <button className="btn btn-primary btn-sm p-1 px-2 me-1" onClick={() => setForm({ active: true, type: 'movie', mode: 'edit', data: m })}>✎</button>
                        <button className="btn btn-danger btn-sm p-1 px-2" onClick={() => handleDelete(m.id, 'movie')}>✕</button>
                      </td>
                    </tr>
                  ))}
                  {activeTab === 'screenings' && screenings.map(s => (
                    <tr key={s.id} className={form.data.id === s.id ? "table-active" : ""}>
                      <td className="text-info">{movies.find(m => m.id === s.movieId)?.title || '...'}</td>
                      <td>{rooms.find(r => r.id === s.roomId)?.name || s.roomId}</td>
                      <td><small>{new Date(s.screeningDate).toLocaleString('hu-HU', {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}</small></td>
                      <td>
                        <button className="btn btn-primary btn-sm p-1 px-2 me-1" onClick={() => setForm({ active: true, type: 'screening', mode: 'edit', data: s })}>✎</button>
                        <button className="btn btn-danger btn-sm p-1 px-2" onClick={() => handleDelete(s.id, 'screening')}>✕</button>
                      </td>
                    </tr>
                  ))}
                  {activeTab === 'rooms' && rooms.map(r => (
                    <tr key={r.id} className={form.data.id === r.id ? "table-active" : ""}>
                      <td>{r.name}</td>
                      <td>{r.capacity}</td>
                      <td>{r.available ? '✅' : '❌'}</td>
                      <td>
                        <button className="btn btn-primary btn-sm p-1 px-2 me-1" onClick={() => setForm({ active: true, type: 'room', mode: 'edit', data: r })}>✎</button>
                        <button className="btn btn-outline-light btn-sm p-1" onClick={() => toggleRoom(r)}>⇄</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {form.active && (
            <div className="col-lg-5">
              <div className={`login-card p-3 border ${form.mode === 'edit' ? 'border-primary' : 'border-success'} sticky-top`} style={{top: '15px'}}>
                <h5 className="text-white mb-3 pb-2 border-bottom">{form.mode === 'edit' ? 'Szerkesztés' : 'Új hozzáadása'}</h5>
                <div className="row g-2">
                  {form.type === 'movie' && (
                    <>
                      <div className="col-12"><label className="text-white-50 small">Cím</label><input type="text" className="form-control form-control-sm bg-dark text-white" value={form.data.title || ''} onChange={e => setForm({...form, data: {...form.data, title: e.target.value}})} /></div>
                      <div className="col-6"><label className="text-white-50 small">Perc</label><input type="number" className="form-control form-control-sm bg-dark text-white" value={form.data.length || ''} onChange={e => setForm({...form, data: {...form.data, length: parseInt(e.target.value)}})} /></div>
                      <div className="col-6"><label className="text-white-50 small">Kép</label><input type="text" className="form-control form-control-sm bg-dark text-white" value={form.data.picturePath || ''} onChange={e => setForm({...form, data: {...form.data, picturePath: e.target.value}})} /></div>
                    </>
                  )}
                  {form.type === 'screening' && (
                    <>
                      <div className="col-12"><label className="text-white-50 small">Film</label><select className="form-select form-select-sm bg-dark text-white" value={form.data.movieId || ''} onChange={e => setForm({...form, data: {...form.data, movieId: parseInt(e.target.value)}})}><option value="">Válassz...</option>{movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}</select></div>
                      <div className="col-12"><label className="text-white-50 small">Terem</label><select className="form-select form-select-sm bg-dark text-white" value={form.data.roomId || ''} onChange={e => setForm({...form, data: {...form.data, roomId: parseInt(e.target.value)}})}><option value="">Válassz...</option>{rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select></div>
                      <div className="col-6"><label className="text-white-50 small">Dátum</label><input type="datetime-local" className="form-control form-control-sm bg-dark text-white" value={form.data.screeningDate || ''} onChange={e => setForm({...form, data: {...form.data, screeningDate: e.target.value}})} /></div>
                      <div className="col-6"><label className="text-white-50 small">Ár</label><input type="number" className="form-control form-control-sm bg-dark text-white" value={form.data.price || ''} onChange={e => setForm({...form, data: {...form.data, price: parseInt(e.target.value)}})} /></div>
                    </>
                  )}
                  {form.type === 'room' && (
                    <>
                      <div className="col-12"><label className="text-white-50 small">Név</label><input type="text" className="form-control form-control-sm bg-dark text-white" value={form.data.name || ''} onChange={e => setForm({...form, data: {...form.data, name: e.target.value}})} /></div>
                      <div className="col-12"><label className="text-white-50 small">Kapacitás</label><input type="number" className="form-control form-control-sm bg-dark text-white" value={form.data.capacity || ''} onChange={e => setForm({...form, data: {...form.data, capacity: parseInt(e.target.value)}})} /></div>
                    </>
                  )}
                </div>
                <div className="mt-4 d-flex gap-2">
                  <button className={`btn ${form.mode === 'edit' ? 'btn-primary' : 'btn-success'} btn-sm w-100`} onClick={handleSubmit}>MENTÉS</button>
                  <button className="btn btn-outline-secondary btn-sm w-100" onClick={() => setForm({ active: false, type: null, mode: 'add', data: {} })}>MÉGSE</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Admin;