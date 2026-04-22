import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000/api';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('Összes');

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/Movies/Get/${id}`);
        if (!response.ok) throw new Error('Nincs adat');
        
        const data = await response.json();
        // ITT KÜLDJÜK ÁT AZ OKOS FÜGGVÉNYEN:
        setMovie(mapBackendDataToFrontend(data)); 
      } catch (err) {
        console.error("Hiba:", err);
        setError(true);
      } finally {
        // EZ KAPCSOLJA KI A TÖLTŐKÉPERNYŐT:
        setLoading(false); 
      }
    };

    fetchMovie();
  }, [id]);

  const mapBackendDataToFrontend = (data) => {
    const showtimesMap = new Map();
    
    // --- VETÍTÉSEK FELDOLGOZÁSA ÉS DUPLIKÁCIÓ SZŰRÉSE ---
    if (data.screeningDtos && Array.isArray(data.screeningDtos)) {
      data.screeningDtos.forEach(screening => {
        const dateObj = new Date(screening.screeningDate);
        const dateKey = dateObj.toISOString().split('T')[0];
        
        // Napok inicializálása
        if (!showtimesMap.has(dateKey)) {
          const days = ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat'];
          showtimesMap.set(dateKey, {
            dayName: days[dateObj.getDay()],
            dateStr: `${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')}.`,
            sessions: []
          });
        }
        
        // Időpont formázása ("14:30")
        const timeStr = dateObj.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' });
        
        // Dinamikus típus beállítás (ha a terem nevében benne van az IMAX)
        let typeStr = '2D';
        if (screening.roomName && screening.roomName.toUpperCase().includes('IMAX')) {
            typeStr = 'IMAX';
        }
        if (screening.roomName && screening.roomName.toUpperCase().includes('3D')) {
            typeStr = '3D';
        }

        const currentDay = showtimesMap.get(dateKey);
        
        // Okos szűrő: Megnézzük, van-e már ilyen időpont és típus ezen a napon
        const isDuplicate = currentDay.sessions.some(session => 
            session.time === timeStr && session.type === typeStr
        );

        // Csak akkor mentjük el, ha még nincs ilyen gomb
        if (!isDuplicate) {
          currentDay.sessions.push({
            id: screening.id,
            time: timeStr, 
            type: typeStr, 
            lang: 'HU',
            roomId: screening.roomId // 2. EZT A SORT ADD HOZZÁ
          });
        }
      });
    }

    // --- FILM ADATAINAK ÖSSZEÁLLÍTÁSA ---
    return {
      ...data,
      title: data.title || "Ismeretlen Cím",
      posterUrl: data.picturePath ? data.picturePath.replace('/Frontend/my-app/public', '') : "",
      description: data.description || "Nincs elérhető leírás.",
      director: data.director || "Ismeretlen",
      rating: data.rating,
      duration: data.length ? `${data.length} perc` : "-",
      ageRating: data.pg || "12",
      
      // Időpontok sorba rendezése, hogy szépen jelenjenek meg (pl. 14:00, 16:00)
      showtimes: Array.from(showtimesMap.values()).map(day => {
          day.sessions.sort((a, b) => a.time.localeCompare(b.time));
          return day;
      })
    };
  };

  // --- TÖLTŐKÉPERNYŐ ÉS HIBAKEZELÉS ---
  if (loading) return <div className="loading" style={{ textAlign: 'center', padding: '50px', color: 'white' }}>Betöltés...</div>;
  
  if (error || !movie) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
        <h2>Egyelőre nincsenek feltöltve adatok a szerverre.</h2>
        <p>Nézz vissza később!</p>
      </div>
    );
  }
  
  const allTypes = ['Összes', ...new Set(movie.showtimes.flatMap(day => day.sessions.map(s => s.type)))];

  // --- MEGJELENÍTÉS (HTML/JSX) ---
  return (
    <div className="movie-card">
      {/* Plakát */}
      <a href={movie.trailerUrl || "#"} target="_blank" rel="noreferrer" className="poster-trailer-link">
        <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
      </a>

      <div className="movie-info">
        <div className="title-wrapper">
          <h1>{movie.title}</h1>
        </div>

        {/* Adatok (Hossz, Korhatár, Értékelés) */}
        <div className="metadata">
          <span className="meta-tag meta-duration">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '5px'}}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            {movie.duration}
          </span>
          <span className={`meta-tag meta-age age-${movie.ageRating}`}>{movie.ageRating}+</span>
          {movie.rating && <span className="meta-tag meta-rating">⭐ IMDb: {movie.rating}</span>}
        </div>

        {/* Stáb (Szereplők eltávolítva) */}
        <div className="crew-info">
          <p><strong>Rendező:</strong> {movie.director}</p>
        </div>

        {/* Leírás */}
        <p className="description">{movie.description}</p>

        {/* Vetítések szekció */}
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
            <p style={{ color: '#777', padding: '20px 0' }}>Ehhez a filmhez jelenleg nincsenek aktív vetítések.</p>
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
                        className="time-btn"
                        // ÁTIRÁNYÍTÁS A PURCHASE OLDALRA:
                        onClick={() => navigate('/purchase', {
                          state: {
                            movie: {
                              title: movie.title,
                              genre: movie.director, // A purchase.js ezt használja a rendezőhöz
                              duration: movie.duration,
                              rating: movie.ageRating
                            },
                            screening: {
                              screeningId: session.id,
                              time: session.time,
                              roomId: session.roomId
                            },
                            day: `${day.dayName} (${day.dateStr})`
                          }
                        })}
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