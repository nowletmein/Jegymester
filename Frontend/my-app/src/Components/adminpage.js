import React, { useState } from 'react';
import '../Components/style/comp.css';
import Header from './header.js';
import Footer from './footer.js';

const initialMovies = [
  {
    id: 1,
    title: 'Dűne: Második rész',
    genre: 'Sci-Fi / Kaland',
    description: 'Paul Atreides útja folytatódik az Arrakis sivatagában.',
    duration: '166 perc',
    rating: '16',
  },
  {
    id: 2,
    title: 'Kung Fu Panda 4',
    genre: 'Animáció / Vígjáték',
    description: 'Po új kihívásokkal és ellenfelekkel találja szembe magát.',
    duration: '94 perc',
    rating: '6',
  },
];

const initialScreenings = [
  {
    id: 1,
    movieTitle: 'Dűne: Második rész',
    date: '2025-04-07',
    time: '17:00',
    hall: '1-es terem',
  },
  {
    id: 2,
    movieTitle: 'Kung Fu Panda 4',
    date: '2025-04-08',
    time: '12:30',
    hall: '2-es terem',
  },
];

function Admin() {
  const [movies, setMovies] = useState(initialMovies);
  const [screenings, setScreenings] = useState(initialScreenings);

  const [movieForm, setMovieForm] = useState({
    title: '',
    genre: '',
    description: '',
    duration: '',
    rating: '',
  });

  const [screeningForm, setScreeningForm] = useState({
    movieTitle: '',
    date: '',
    time: '',
    hall: '',
  });

  const [editingMovieId, setEditingMovieId] = useState(null);
  const [editingScreeningId, setEditingScreeningId] = useState(null);

  const handleMovieChange = (e) => {
    const { name, value } = e.target;
    setMovieForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleScreeningChange = (e) => {
    const { name, value } = e.target;
    setScreeningForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMovieSubmit = (e) => {
    e.preventDefault();

    if (!movieForm.title || !movieForm.genre || !movieForm.duration || !movieForm.rating) {
      alert('Kérlek töltsd ki a kötelező mezőket a filmnél.');
      return;
    }

    if (editingMovieId) {
      setMovies((prev) =>
        prev.map((movie) =>
          movie.id === editingMovieId ? { ...movie, ...movieForm } : movie
        )
      );
      setEditingMovieId(null);
    } else {
      const newMovie = {
        id: Date.now(),
        ...movieForm,
      };
      setMovies((prev) => [...prev, newMovie]);
    }

    setMovieForm({
      title: '',
      genre: '',
      description: '',
      duration: '',
      rating: '',
    });
  };

  const handleScreeningSubmit = (e) => {
    e.preventDefault();

    if (!screeningForm.movieTitle || !screeningForm.date || !screeningForm.time || !screeningForm.hall) {
      alert('Kérlek töltsd ki a kötelező mezőket a vetítésnél.');
      return;
    }

    if (editingScreeningId) {
      setScreenings((prev) =>
        prev.map((screening) =>
          screening.id === editingScreeningId
            ? { ...screening, ...screeningForm }
            : screening
        )
      );
      setEditingScreeningId(null);
    } else {
      const newScreening = {
        id: Date.now(),
        ...screeningForm,
      };
      setScreenings((prev) => [...prev, newScreening]);
    }

    setScreeningForm({
      movieTitle: '',
      date: '',
      time: '',
      hall: '',
    });
  };

  const handleEditMovie = (movie) => {
    setMovieForm({
      title: movie.title,
      genre: movie.genre,
      description: movie.description,
      duration: movie.duration,
      rating: movie.rating,
    });
    setEditingMovieId(movie.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteMovie = (id, title) => {
    const hasScreening = screenings.some((screening) => screening.movieTitle === title);

    if (hasScreening) {
      alert('Ez a film nem törölhető, mert tartozik hozzá aktív vetítés.');
      return;
    }

    setMovies((prev) => prev.filter((movie) => movie.id !== id));
  };

  const handleEditScreening = (screening) => {
    setScreeningForm({
      movieTitle: screening.movieTitle,
      date: screening.date,
      time: screening.time,
      hall: screening.hall,
    });
    setEditingScreeningId(screening.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteScreening = (id) => {
    setScreenings((prev) => prev.filter((screening) => screening.id !== id));
  };

  return (
    <>
      <Header />

      <main className="container py-5">
        <div className="mb-4">
          <h1 className="text-white fw-bold">Adminisztrációs felület</h1>
          <p className="login-text mb-0">
            Filmek és vetítések kezelése adminisztrátori jogosultsággal.
          </p>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="login-card p-4 text-center" style={{ maxWidth: '100%' }}>
              <div className="brand-logo">{movies.length}</div>
              <p className="text-white mb-0">Rögzített film</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="login-card p-4 text-center" style={{ maxWidth: '100%' }}>
              <div className="brand-logo">{screenings.length}</div>
              <p className="text-white mb-0">Aktív vetítés</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="login-card p-4 text-center" style={{ maxWidth: '100%' }}>
              <div className="brand-logo">ADMIN</div>
              <p className="text-white mb-0">Legmagasabb jogosultsági szint</p>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-6">
            <div className="login-card p-4" style={{ maxWidth: '100%' }}>
              <h3 className="text-white mb-4">
                {editingMovieId ? 'Film módosítása' : 'Új film felvétele'}
              </h3>

              <form onSubmit={handleMovieSubmit}>
                <div className="mb-3">
                  <label className="form-label text-white">Film címe</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={movieForm.title}
                    onChange={handleMovieChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-white">Műfaj</label>
                  <input
                    type="text"
                    name="genre"
                    className="form-control"
                    value={movieForm.genre}
                    onChange={handleMovieChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-white">Leírás</label>
                  <textarea
                    name="description"
                    className="form-control"
                    rows="4"
                    value={movieForm.description}
                    onChange={handleMovieChange}
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-white">Játékidő</label>
                    <input
                      type="text"
                      name="duration"
                      className="form-control"
                      placeholder="pl. 120 perc"
                      value={movieForm.duration}
                      onChange={handleMovieChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label text-white">Korhatár</label>
                    <input
                      type="text"
                      name="rating"
                      className="form-control"
                      placeholder="pl. 12"
                      value={movieForm.rating}
                      onChange={handleMovieChange}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  {editingMovieId ? 'Film mentése' : 'Film hozzáadása'}
                </button>
              </form>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="login-card p-4" style={{ maxWidth: '100%' }}>
              <h3 className="text-white mb-4">
                {editingScreeningId ? 'Vetítés módosítása' : 'Új vetítés létrehozása'}
              </h3>

              <form onSubmit={handleScreeningSubmit}>
                <div className="mb-3">
                  <label className="form-label text-white">Film címe</label>
                  <select
                    name="movieTitle"
                    className="form-control"
                    value={screeningForm.movieTitle}
                    onChange={handleScreeningChange}
                  >
                    <option value="">Válassz filmet</option>
                    {movies.map((movie) => (
                      <option key={movie.id} value={movie.title}>
                        {movie.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-white">Dátum</label>
                    <input
                      type="date"
                      name="date"
                      className="form-control"
                      value={screeningForm.date}
                      onChange={handleScreeningChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label text-white">Időpont</label>
                    <input
                      type="time"
                      name="time"
                      className="form-control"
                      value={screeningForm.time}
                      onChange={handleScreeningChange}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label text-white">Moziterem</label>
                  <input
                    type="text"
                    name="hall"
                    className="form-control"
                    placeholder="pl. 3-as terem"
                    value={screeningForm.hall}
                    onChange={handleScreeningChange}
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  {editingScreeningId ? 'Vetítés mentése' : 'Vetítés hozzáadása'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="row g-4 mt-1">
          <div className="col-lg-6">
            <div className="login-card p-4" style={{ maxWidth: '100%' }}>
              <h3 className="text-white mb-4">Filmek kezelése</h3>

              {movies.length === 0 ? (
                <p className="login-text mb-0">Nincs rögzített film.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-dark table-bordered align-middle">
                    <thead>
                      <tr>
                        <th>Cím</th>
                        <th>Műfaj</th>
                        <th>Játékidő</th>
                        <th>Korhatár</th>
                        <th>Műveletek</th>
                      </tr>
                    </thead>
                    <tbody>
                      {movies.map((movie) => (
                        <tr key={movie.id}>
                          <td>{movie.title}</td>
                          <td>{movie.genre}</td>
                          <td>{movie.duration}</td>
                          <td>{movie.rating}+</td>
                          <td>
                            <div className="d-flex gap-2 flex-wrap">
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleEditMovie(movie)}
                              >
                                Módosítás
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteMovie(movie.id, movie.title)}
                              >
                                Törlés
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-6">
            <div className="login-card p-4" style={{ maxWidth: '100%' }}>
              <h3 className="text-white mb-4">Vetítések kezelése</h3>

              {screenings.length === 0 ? (
                <p className="login-text mb-0">Nincs rögzített vetítés.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-dark table-bordered align-middle">
                    <thead>
                      <tr>
                        <th>Film</th>
                        <th>Dátum</th>
                        <th>Idő</th>
                        <th>Terem</th>
                        <th>Műveletek</th>
                      </tr>
                    </thead>
                    <tbody>
                      {screenings.map((screening) => (
                        <tr key={screening.id}>
                          <td>{screening.movieTitle}</td>
                          <td>{screening.date}</td>
                          <td>{screening.time}</td>
                          <td>{screening.hall}</td>
                          <td>
                            <div className="d-flex gap-2 flex-wrap">
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleEditScreening(screening)}
                              >
                                Módosítás
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteScreening(screening.id)}
                              >
                                Törlés
                              </button>
                            </div>
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

export default Admin;