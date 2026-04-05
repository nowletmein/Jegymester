import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5284/api';

const MovieDetails = () => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('Összes');

  useEffect(() => {
    const fetchMovie = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      let movieId = urlParams.get('id') || 1;

      try {
        const response = await fetch(`${API_BASE_URL}/Movies/Get/${movieId}`);
        if (!response.ok) throw new Error('Nincs adat');
        
        const data = await response.json();
        setMovie(mapBackendDataToFrontend(data));
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, []);

  const mapBackendDataToFrontend = (data) => {
    const showtimesMap = new Map();
    if (data.screenings && Array.isArray(data.screenings)) {
      data.screenings.forEach(screening => {
        const dateObj = new Date(screening.screeningDate);
        const dateKey = dateObj.toISOString().split('T')[0];
        
        if (!showtimesMap.has(dateKey)) {
          const days = ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat'];
          showtimesMap.set(dateKey, {
            dayName: days[dateObj.getDay()],
            dateStr: `${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')}.`,
            sessions: []
          });
        }
        
        showtimesMap.get(dateKey).sessions.push({
          id: screening.id,
          time: dateObj.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' }),
          type: screening.room?.includes('IMAX') ? 'IMAX' : (screening.type || '2D'),
          lang: screening.lang || 'HU'
        });
      });
    }

    return {
      ...data,
      title: data.title || "Ismeretlen Cím",
      cast: data.cast ? data.cast.split(',') : ["-"],
      duration: data.length ? `${data.length} perc` : "-",
      ageRating: data.pg || "12",
      showtimes: Array.from(showtimesMap.values())
    };
  };

  if (loading) return <div className="loading">Betöltés...</div>;
  if (error || !movie) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
        <h2>Egyelőre nincsenek feltöltve adatok a szerverre.</h2>
        <p>Nézz vissza később!</p>
      </div>
    );
  }
  const allTypes = ['Összes', ...new Set(movie.showtimes.flatMap(day => day.sessions.map(s => s.type)))];

  return (
    <div className="movie-card">
      <a href={movie.trailerUrl || "#"} target="_blank" rel="noreferrer" className="poster-trailer-link">
        <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
      </a>

      <div className="movie-info">
        <div className="title-wrapper">
          <h1>{movie.title}</h1>
        </div>

        <div className="metadata">
          <span className="meta-tag meta-genre">{movie.genre}</span>
          <span className="meta-tag meta-duration">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            {movie.duration}
          </span>
          <span className={`meta-tag meta-age age-${movie.ageRating}`}>{movie.ageRating}+</span>
        </div>

        <div className="crew-info">
          <p><strong>Bemutató ideje:</strong> {movie.releaseDate || "-"}</p>
          <p><strong>Forgalmazó:</strong> {movie.distributor || "-"}</p>
          <p><strong>Rendező:</strong> {movie.director || "Ismeretlen"}</p>
          <p><strong>Szereplők:</strong> {movie.cast.join(', ')}</p>
        </div>

        <p className="description">{movie.description}</p>

        <div className="showtimes-section">
          <div className="showtimes-header">
            <h3>VETÍTÉSEK</h3>
            {movie.showtimes.length > 0 && (
              <div className="filter-bar">
                {allTypes.map(type => (
                  <button 
                    key={type}
                    className={`filter-btn ${currentFilter === type ? 'active' : ''}`}
                    onClick={() => setCurrentFilter(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>

          {movie.showtimes.length === 0 ? (
            <p style={{ color: '#777' }}>Ehhez a filmhez jelenleg nincsenek aktív vetítések.</p>
          ) : (
            movie.showtimes.map((day, idx) => {
              const filteredSessions = currentFilter === 'Összes' 
                ? day.sessions 
                : day.sessions.filter(s => s.type === currentFilter);

              if (filteredSessions.length === 0) return null;

              return (
                <div key={idx} className="showtime-day">
                  <div className="day-label">
                    <span className="day-name">{day.dayName}</span>
                    <span className="day-date">{day.dateStr}</span>
                  </div>
                  <div className="time-buttons">
                    {filteredSessions.map(session => (
                      <button 
                        key={session.id}
                        className={`time-btn ${session.lang === 'HU' ? 'bg-hu' : session.lang.includes('EN') ? 'bg-en-hu' : ''}`}
                        onClick={() => window.location.href = `jegy.html?screeningId=${session.id}`}
                      >
                        <span className="btn-time">{session.time}</span>
                        <span className="btn-type">{session.type}</span>
                        <span className="btn-lang">{session.lang}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;