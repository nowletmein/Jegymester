import React, { useEffect, useState } from 'react';
import '../Components/style/comp.css';
import Header from './header.js';
import Footer from './footer.js';
import { Link, useNavigate } from 'react-router-dom';


/*function formatDateKey(dateString) {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}*/


var weeklymovies = fetch("http://localhost:5000/api/Screenings/GetWeekly")

//El volt csúszva egy nappal hátrafelé, így ezt módosítottam
function formatDateKey(dateString) {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('hu-HU', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function formatDayLabel(dateString) {
  const date = new Date(dateString);

  const label = date.toLocaleDateString('hu-HU', { weekday: 'long' });
  const short = date.toLocaleDateString('hu-HU', {
    month: '2-digit',
    day: '2-digit',
  });

  return {
    date: formatDateKey(dateString),
    label: label.charAt(0).toUpperCase() + label.slice(1),
    short,
  };
}

function normalizePicturePath(path) {
  if (!path) {
    return 'https://placehold.co/120x180/1a1a2e/4fc3f7?text=Film';
  }

  return path.replace('/Frontend/my-app/public', '');
}

function mapMovieFromApi(movie) {
  const schedule = {};

  if (movie.screeningDtos && Array.isArray(movie.screeningDtos)) {
    movie.screeningDtos.forEach((screening) => {
      const dayKey = formatDateKey(screening.screeningDate);
      const time = formatTime(screening.screeningDate);

      if (!schedule[dayKey]) {
        schedule[dayKey] = [];
      }

      schedule[dayKey].push({
        screeningId: screening.id,
        time: time,
        roomId: screening.roomId,
        screeningDate: screening.screeningDate,
      });
    });
  }

  return {
    id: movie.id,
    title: movie.title,
    genre: movie.director || 'Nincs megadva',
    duration: `${movie.length} perc`,
    rating: movie.pg,
    poster: normalizePicturePath(movie.picturePath),
    description: movie.description,
    score: movie.rating,
    schedule,
  };
}

function TicketModal({ movie, screening, day, onClose }) {
  const navigate = useNavigate();

  const handlePurchaseClick = () => {
    navigate('/purchase', {
      state: {
        movie: movie,
        screening: screening,
        day: day,
      },
    });
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content login-card">
          <div className="modal-body text-center p-4">
            <div className="brand-logo">
              JEGY<span className="text-white">MESTER</span>
            </div>

            <h3 className="text-white mb-2">{movie.title}</h3>
            <p className="login-text mb-2">{day}</p>
            <h1 className="text-primary mb-4">{screening.time}</h1>

            <button
              className="btn btn-primary w-100 mb-2"
              onClick={handlePurchaseClick}
            >
              Jegy vásárlása
            </button>

            <button className="btn btn-outline-light w-100" onClick={onClose}>
              Bezárás
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}






function MovieCard({ movie, selectedDay }) {
  const [modal, setModal] = useState(null);
  const screenings = movie.schedule[selectedDay] || [];

  if (screenings.length === 0) return null;

  return (
    <>
      <div className="login-card p-3 mb-4" style={{ maxWidth: '100%' }}>
        <div className="row g-3 align-items-center">
          <div className="col-md-2 col-sm-3">
		<Link to={`/movie/${movie.id}`}>
            	<img
              	src={movie.poster}
              	alt={movie.title}
              	className="img-fluid rounded"
            	/>
		</Link>
          </div>

          <div className="col-md-10 col-sm-9">
            <h3 className="text-white mb-2">{movie.title}</h3>

            <div className="d-flex flex-wrap gap-2 mb-3">
              <span className="badge text-bg-dark border border-primary text-info">
                {movie.genre}
              </span>
              <span className="badge text-bg-dark border">
                {movie.duration}
              </span>
              <span className="badge bg-danger">
                {movie.rating}+
              </span>
              <span className="badge bg-secondary">
                IMDb: {movie.score}
              </span>
            </div>

            <p className="login-text mb-2">{movie.description}</p>

            <div className="login-text mb-2">Vetítések</div>

            <div className="d-flex flex-wrap gap-2">
              {screenings.map((screening) => (
                <button
                  key={screening.screeningId}
                  className="btn btn-primary"
                  onClick={() => setModal(screening)}
                >
                  {screening.time}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {modal && (
        <TicketModal
          movie={movie}
          screening={modal}
          day={selectedDay}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}














function Movies() {
  const [selectedDay, setSelectedDay] = useState('');
  const [days, setDays] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/Movies/GetAll');

        if (!response.ok) {
          throw new Error('Nem sikerült lekérni a filmeket.');
        }

        const data = await response.json();
        const mappedMovies = data.map(mapMovieFromApi);

        setMovies(mappedMovies);

        const allDates = [];

        mappedMovies.forEach((movie) => {
          Object.keys(movie.schedule).forEach((dateKey) => {
            if (!allDates.includes(dateKey)) {
              allDates.push(dateKey);
            }
          });
        });

        allDates.sort();

        const mappedDays = allDates.map((dateKey) =>
          formatDayLabel(`${dateKey}T00:00:00`)
        );

        setDays(mappedDays);

        if (mappedDays.length > 0) {
          setSelectedDay(mappedDays[0].date);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  const moviesForDay = movies.filter(
    (movie) => (movie.schedule[selectedDay] || []).length > 0
  );

  return (
    <>
      <Header />

      <main className="container py-5">
        <div className="mb-4">
          <h1 className="text-white fw-bold">Heti műsor</h1>
          <p className="login-text">
            Válassz napot a vetítési időpontok megtekintéséhez
          </p>
        </div>

        {loading && (
          <div className="login-card p-4 text-center">
            <p className="login-text mb-0">Betöltés...</p>
          </div>
        )}

        {error && (
          <div className="login-card p-4 text-center">
            <p className="text-danger mb-0">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="d-flex flex-wrap gap-2 mb-4">
              {days.map((day) => (
                <button
                  key={day.date}
                  className={`btn ${selectedDay === day.date ? 'btn-primary' : 'btn-outline-light'}`}
                  onClick={() => setSelectedDay(day.date)}
                >
                  <div className="fw-bold">{day.label}</div>
                  <small>{day.short}</small>
                </button>
              ))}
            </div>

            {moviesForDay.length === 0 ? (
              <div className="login-card p-4 text-center">
                <p className="login-text mb-0">
                  Erre a napra nincs elérhető vetítés.
                </p>
              </div>
            ) : (
              moviesForDay.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  selectedDay={selectedDay}
                />
              ))
            )}
          </>
        )}
      </main>

      <Footer />
    </>
  );
}

export default Movies;