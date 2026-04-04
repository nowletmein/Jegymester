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

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #111;
    color: #e0e0e0;
    font-family: 'Barlow', sans-serif;
    min-height: 100vh;
  }

  .jm-navbar {
    background: #000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    height: 56px;
    border-bottom: 1px solid #222;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .jm-logo {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 800;
    font-size: 22px;
    letter-spacing: 1px;
    user-select: none;
  }
  .jm-logo .jegy { color: #1e88e5; }
  .jm-logo .mester { color: #fff; }

  .jm-nav-links {
    display: flex;
    gap: 24px;
    font-size: 14px;
    color: #aaa;
    list-style: none;
  }
  .jm-nav-links li { cursor: pointer; transition: color 0.2s; }
  .jm-nav-links li:hover { color: #fff; }

  .jm-subbar {
    background: #1e88e5;
    display: flex;
    justify-content: center;
    gap: 40px;
    padding: 10px 0;
  }
  .jm-subbar span {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 2px;
    color: #fff;
    cursor: pointer;
    opacity: 0.85;
    transition: opacity 0.2s;
  }
  .jm-subbar span:hover { opacity: 1; }
  .jm-subbar span.active { opacity: 1; border-bottom: 2px solid #fff; padding-bottom: 2px; }

  .jm-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 16px 60px;
  }

  .jm-page-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 32px;
    font-weight: 800;
    color: #fff;
    letter-spacing: 1px;
    margin-bottom: 4px;
  }
  .jm-page-subtitle {
    color: #777;
    font-size: 14px;
    margin-bottom: 28px;
  }

  .jm-day-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 28px;
    flex-wrap: wrap;
  }
  .jm-day-tab {
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: 6px;
    padding: 10px 22px;
    cursor: pointer;
    transition: all 0.18s;
    text-align: center;
    min-width: 90px;
  }
  .jm-day-tab:hover { border-color: #1e88e5; }
  .jm-day-tab.active {
    background: #1e88e5;
    border-color: #1e88e5;
  }
  .jm-day-tab-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    letter-spacing: 1px;
  }
  .jm-day-tab-date {
    font-size: 12px;
    color: #aaa;
    margin-top: 2px;
  }
  .jm-day-tab.active .jm-day-tab-date { color: rgba(255,255,255,0.8); }

  .jm-movie-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .jm-movie-card {
    background: #1a1a1a;
    border: 1px solid #252525;
    border-radius: 10px;
    display: flex;
    gap: 0;
    overflow: hidden;
    transition: border-color 0.2s, transform 0.15s;
  }
  .jm-movie-card:hover {
    border-color: #1e88e5;
    transform: translateY(-1px);
  }

  .jm-movie-poster {
    width: 90px;
    min-height: 130px;
    flex-shrink: 0;
    background: #222;
    overflow: hidden;
  }
  .jm-movie-poster img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .jm-movie-info {
    padding: 16px 20px;
    flex: 1;
    min-width: 0;
  }

  .jm-movie-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
    flex-wrap: wrap;
  }

  .jm-movie-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .jm-badge {
    display: inline-block;
    border-radius: 4px;
    padding: 2px 8px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    font-family: 'Barlow Condensed', sans-serif;
  }
  .jm-badge-genre {
    background: #222;
    color: #90caf9;
    border: 1px solid #1e88e5;
  }
  .jm-badge-duration {
    background: #222;
    color: #aaa;
    border: 1px solid #333;
  }
  .jm-badge-age {
    background: #e53935;
    color: #fff;
  }

  .jm-showtimes-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 2px;
    color: #555;
    text-transform: uppercase;
    margin-bottom: 8px;
    margin-top: 12px;
  }

  .jm-showtimes {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .jm-time-btn {
    background: #111;
    border: 1px solid #333;
    color: #e0e0e0;
    border-radius: 6px;
    padding: 7px 16px;
    font-size: 14px;
    font-family: 'Barlow', sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.5px;
  }
  .jm-time-btn:hover {
    background: #1e88e5;
    border-color: #1e88e5;
    color: #fff;
  }

  .jm-empty {
    text-align: center;
    padding: 60px 0;
    color: #444;
    font-size: 18px;
    font-family: 'Barlow Condensed', sans-serif;
    letter-spacing: 1px;
  }

  .jm-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
    padding: 16px;
  }
  .jm-modal {
    background: #1a1a1a;
    border: 1px solid #1e88e5;
    border-radius: 12px;
    padding: 32px;
    max-width: 420px;
    width: 100%;
    text-align: center;
  }
  .jm-modal-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 8px;
  }
  .jm-modal-sub {
    color: #888;
    font-size: 14px;
    margin-bottom: 20px;
  }
  .jm-modal-time {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 48px;
    font-weight: 800;
    color: #1e88e5;
    margin-bottom: 24px;
    letter-spacing: 2px;
  }
  .jm-modal-btn {
    background: #1e88e5;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 12px 32px;
    font-size: 15px;
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 700;
    letter-spacing: 2px;
    cursor: pointer;
    width: 100%;
    margin-bottom: 10px;
    transition: background 0.15s;
  }
  .jm-modal-btn:hover { background: #1565c0; }
  .jm-modal-close {
    background: transparent;
    color: #666;
    border: 1px solid #333;
    border-radius: 6px;
    padding: 10px 32px;
    font-size: 14px;
    font-family: 'Barlow', sans-serif;
    cursor: pointer;
    width: 100%;
    transition: color 0.15s;
  }
  .jm-modal-close:hover { color: #ccc; }
`;

function TicketModal(props) {
  const { movie, time, day, onClose } = props;
  const dayInfo = DAYS.find((d) => d.date === day);

  return (
    <div className="jm-modal-overlay" onClick={onClose}>
      <div className="jm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="jm-modal-title">{movie.title}</div>
        <div className="jm-modal-sub">
          {dayInfo ? `${dayInfo.label}, ${dayInfo.short}` : ""}
        </div>
        <div className="jm-modal-time">{time}</div>
        <button className="jm-modal-btn">JEGY VÁSÁRLÁSA</button>
        <button className="jm-modal-close" onClick={onClose}>
          Bezárás
        </button>
      </div>
    </div>
  );
}

function MovieCard(props) {
  const { movie, selectedDay } = props;
  const [modal, setModal] = useState(null);
  const times = movie.schedule[selectedDay] || [];

  if (times.length === 0) return null;

  return (
    <>
      <div className="jm-movie-card">
        <div className="jm-movie-poster">
          <img src={movie.poster} alt={movie.title} />
        </div>
        <div className="jm-movie-info">
          <div className="jm-movie-title">{movie.title}</div>
          <div className="jm-movie-meta">
            <span className="jm-badge jm-badge-genre">{movie.genre}</span>
            <span className="jm-badge jm-badge-duration">⏱ {movie.duration}</span>
            <span className="jm-badge jm-badge-age">{movie.rating}+</span>
          </div>
          <div className="jm-showtimes-label">Vetítések</div>
          <div className="jm-showtimes">
            {times.map((t) => (
              <button
                key={t}
                className="jm-time-btn"
                onClick={() => setModal(t)}
              >
                {t}
              </button>
            ))}
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

function MovieSchedule() {
  const [selectedDay, setSelectedDay] = useState(DAYS[0].date);

  const moviesForDay = MOVIES.filter(
    (m) => (m.schedule[selectedDay] || []).length > 0
  );

  return (
    <>
      <style>{styles}</style>

      <Header />

      <div className="jm-subbar">
        <span className="active">MŰSORON</span>
        <span>AJÁNLATOK</span>
      </div>

      <div className="jm-page">
        <div className="jm-page-title">Heti Műsor</div>
        <div className="jm-page-subtitle">
          Válassz napot a vetítési időpontok megtekintéséhez
        </div>

        <div className="jm-day-tabs">
          {DAYS.map((d) => (
            <div
              key={d.date}
              className={`jm-day-tab${selectedDay === d.date ? " active" : ""}`}
              onClick={() => setSelectedDay(d.date)}
            >
              <div className="jm-day-tab-label">{d.label}</div>
              <div className="jm-day-tab-date">{d.short}</div>
            </div>
          ))}
        </div>

        <div className="jm-movie-list">
          {moviesForDay.length === 0 ? (
            <div className="jm-empty">Erre a napra nincs elérhető vetítés.</div>
          ) : (
            moviesForDay.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                selectedDay={selectedDay}
              />
            ))
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default MovieSchedule;