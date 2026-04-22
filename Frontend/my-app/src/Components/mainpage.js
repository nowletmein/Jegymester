import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Components/style/comp.css';
import Header from './header.js';
import Footer from './footer.js';

function normalizePicturePath(path) {
  if (!path) {
    return 'https://placehold.co/1920x1080/1a1a2e/4fc3f7?text=Film+Hatter';
  }
  return path.replace('/Frontend/my-app/public', '');
}

function App() {
  const [movies, setMovies] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/Movies/GetAll`);
        if (!response.ok) throw new Error('Nincs adat');
        
        const data = await response.json();
        const mappedData = data.map(movie => ({
          ...movie,
          poster: normalizePicturePath(movie.picturePath)
        }));

        setMovies(mappedData);

        if (mappedData.length > 0) {
          setFeaturedMovie(mappedData[0]); 
        }
      } catch (err) {
        console.error("Hiba:", err);
      } finally {
        setLoading(false); 
      }
    };
    fetchMovies();
  }, []);

  return (
    <div className="App">
      <Header />

      {!loading && featuredMovie && (
        <section className="hero-section">
          <div 
            className="hero-background" 
            style={{ backgroundImage: `url(${featuredMovie.poster})` }}
          ></div>
          
          <div className="hero-overlay">
            <div className="container h-100 d-flex align-items-center">
              <div className="row w-100">
                <div className="col-lg-6 hero-content text-start">
                  <span className="badge bg-primary mb-3 px-3 py-2 text-uppercase fw-bold shadow-sm">
                    Kiemelt Ajánlat
                  </span>
                  
                  <h1 className="display-1 fw-bold text-white mb-2 main-title">
                    {featuredMovie.title}
                  </h1>
                  
                  <div className="d-flex align-items-center gap-3 mb-4 info-bar">
                    <span className="text-warning fw-bold"><i className="fas fa-star"></i> {featuredMovie.rating || '8.2'}</span>
                    <span className="text-white-50">|</span>
                    <span className="text-white fw-medium">{featuredMovie.length} perc</span>
                    <span className="badge border border-secondary text-secondary">{featuredMovie.pg}+</span>
                  </div>

                  <p className="lead text-light mb-4 hero-description">
                    {featuredMovie.description ? 
                      (featuredMovie.description.substring(0, 200) + '...') : 
                      'Fedezd fel a legújabb filmes élményeket nálunk!'}
                  </p>

                  <div className="d-flex gap-3">
                    <button 
                       className="btn btn-outline-light btn-lg px-4 glass-btn"
                       onClick={() => navigate(`/movie/${featuredMovie.id}`)}
                    >
                      Részletek
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <main className="container my-5 pt-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2 className="text-light fw-bold section-title">Aktuális műsoron</h2>
          <div className="title-line flex-grow-1 ms-4 d-none d-md-block"></div>
        </div>
        
        {loading ? (
          <div className="text-center text-light py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : (
          <div className="row g-4">
            {movies.map((movie) => (
              <div key={movie.id} className="col-lg-3 col-md-4 col-sm-6">
                <div className="card bg-dark text-white h-100 popular-card border-0 shadow">
                  <div className="card-img-container">
                    <img 
                      src={movie.poster} 
                      className="card-img-top" 
                      alt={movie.title} 
                      style={{ height: '400px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="popular-body d-flex flex-column justify-content-between p-3">
                    <div className="text-center">
                      <h5 className="card-title fw-bold mb-1 text-truncate">{movie.title}</h5>
                      <p className="card-text text-secondary small mb-2">
                        {movie.director || 'Kiemelt film'}
                      </p>
                    </div>
                    
                    <button 
                      className="btn btn-primary mt-2 mb-1 mx-auto px-4 details-button btn-sm"
                      onClick={() => navigate(`/movie/${movie.id}`)}
                    >
                      Részletek
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;