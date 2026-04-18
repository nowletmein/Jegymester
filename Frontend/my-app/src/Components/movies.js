import React, { useState } from 'react';
import '../Components/style/comp.css';
import Header from './header.js';
import Footer from './footer.js';

const MOVIES = [
  {
    id: 1,
    title: "Dűne: Második rész",
    genre: "Sci-Fi / Kaland",
    duration: "166 perc",
    rating: "16",
    poster: "https://placehold.co/120x180/1a1a2e/4fc3f7?text=Dűne+2",
    schedule: {
      "2025-04-07": ["10:00", "13:30", "17:00", "20:30"],
      "2025-04-08": ["11:00", "14:30", "18:00", "21:00"],
      "2025-04-09": ["10:30", "14:00", "17:30"],
      "2025-04-10": ["12:00", "16:00", "20:00"],
      "2025-04-11": ["11:30", "15:30", "19:30"],
    },
  },
  {
    id: 2,
    title: "Kung Fu Panda 4",
    genre: "Animáció / Vígjáték",
    duration: "94 perc",
    rating: "6",
    poster: "https://placehold.co/120x180/1a1a2e/f9a825?text=KFP4",
    schedule: {
      "2025-04-07": ["09:30", "12:00", "14:30"],
      "2025-04-08": ["10:00", "12:30", "15:00"],
      "2025-04-09": ["09:00", "11:30", "14:00", "16:30"],
      "2025-04-10": ["10:30", "13:00", "15:30"],
      "2025-04-11": ["09:30", "12:00"],
    },
  },
  {
    id: 3,
    title: "Godzilla x Kong",
    genre: "Akció / Sci-Fi",
    duration: "115 perc",
    rating: "12",
    poster: "https://placehold.co/120x180/1a1a2e/e53935?text=GxK",
    schedule: {
      "2025-04-07": ["15:00", "18:30", "22:00"],
      "2025-04-08": ["16:00", "19:30"],
      "2025-04-09": ["15:30", "19:00", "22:00"],
      "2025-04-10": ["14:00", "17:30", "21:00"],
      "2025-04-11": ["16:30", "20:00"],
    },
  },
  {
    id: 4,
    title: "Civil War",
    genre: "Dráma / Thriller",
    duration: "109 perc",
    rating: "18",
    poster: "https://placehold.co/120x180/1a1a2e/78909c?text=Civil+War",
    schedule: {
      "2025-04-07": ["20:00", "22:30"],
      "2025-04-08": ["20:30"],
      "2025-04-09": ["21:00"],
      "2025-04-10": ["19:00", "21:30"],
      "2025-04-11": ["20:30"],
    },
  },
  {
    id: 5,
    title: "Ghostbusters: Frozen Empire",
    genre: "Kaland / Vígjáték",
    duration: "115 perc",
    rating: "12",
    poster: "https://placehold.co/120x180/1a1a2e/80cbc4?text=Ghostbusters",
    schedule: {
      "2025-04-07": ["11:00", "14:00"],
      "2025-04-08": ["13:00", "16:00"],
      "2025-04-09": ["12:30", "15:30", "18:30"],
      "2025-04-10": ["11:30", "14:30"],
      "2025-04-11": ["13:30", "16:30"],
    },
  },
];

const DAYS = [
  { date: "2025-04-07", label: "Hétfő", short: "04.07" },
  { date: "2025-04-08", label: "Kedd", short: "04.08" },
  { date: "2025-04-09", label: "Szerda", short: "04.09" },
  { date: "2025-04-10", label: "Csütörtök", short: "04.10" },
  { date: "2025-04-11", label: "Péntek", short: "04.11" },
];

function TicketModal({ movie, time, day, onClose }) {
  const dayInfo = DAYS.find((d) => d.date === day);

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content login-card">
          <div className="modal-body text-center p-4">
            <div className="brand-logo">
              JEGY<span className="text-white">MESTER</span>
            </div>
            <h3 className="text-white mb-2">{movie.title}</h3>
            <p className="login-text mb-2">
              {dayInfo ? `${dayInfo.label}, ${dayInfo.short}` : ""}
            </p>
            <h1 className="text-primary mb-4">{time}</h1>

            <button className="btn btn-primary w-100 mb-2">
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
  const times = movie.schedule[selectedDay] || [];

  if (times.length === 0) return null;

  return (
    <>
      <div className="login-card p-3 mb-4" style={{ maxWidth: '100%' }}>
        <div className="row g-3 align-items-center">
          <div className="col-md-2 col-sm-3">
            <img
              src={movie.poster}
              alt={movie.title}
              className="img-fluid rounded"
            />
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
            </div>

            <div className="login-text mb-2">Vetítések</div>

            <div className="d-flex flex-wrap gap-2">
              {times.map((time) => (
                <button
                  key={time}
                  className="btn btn-primary"
                  onClick={() => setModal(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {modal && (
        <TicketModal
          movie={movie}
          time={modal}
          day={selectedDay}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}

function Movies() {
  const [selectedDay, setSelectedDay] = useState(DAYS[0].date);

  const moviesForDay = MOVIES.filter(
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

        <div className="d-flex flex-wrap gap-2 mb-4">
          {DAYS.map((day) => (
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
            <p className="login-text mb-0">Erre a napra nincs elérhető vetítés.</p>
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
      </main>

      <Footer />
    </>
  );
}

export default Movies;