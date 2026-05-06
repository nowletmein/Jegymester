import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import '../Components/style/comp.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/Movies/GetAll');
        if (response.ok) {
          const data = await response.json();
          setMovies(data);
        }
      } catch (err) {
        console.error('Hiba a kereső adatainak lekérésekor:', err);
      }
    };
    fetchMovies();
  }, []);

  const normalizePicturePath = (path) => {
    if (!path) return 'https://placehold.co/40x60/1a1a2e/4fc3f7?text=Film';
    return path.replace('/Frontend/my-app/public', '');
  };

  const filteredMovies = movies
    .filter(movie => movie.title && movie.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((movie, index, self) => index === self.findIndex((m) => m.title === movie.title));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header>
      <div className="top-nav">
        <div className="container-fluid px-5">
          <div className="row align-items-center">
            <div className="col-md-4">
              <Link to="/">
                <div className="brand-logo mb-3" style={{ textAlign: 'left', fontSize: '1.5rem', textDecoration: 'none' }}>
                  JEGY<span className="text-white">MESTER</span>
                </div>
              </Link>
            </div>
            
            <div className="col-md-8 d-flex justify-content-end align-items-center gap-4">
              <Link to="/movies" className="nav-link">
                <i className="fas fa-map-marker-alt me-2"></i> Mozi kiválasztása
              </Link>

              <div className="d-flex align-items-center gap-3">
                {/* ADMIN ÉS FIÓK KEZELÉSE */}
                {!user?.isGuest ? (
                  <>
                    <Link to="/admin" className="nav-link text-warning fw-bold">
                      <i className="fas fa-user-shield me-2"></i> Admin
                    </Link>
                    <Link to="/profile" className="nav-link">
                      <i className="fas fa-user-circle me-2"></i> Fiókom
                    </Link>
                    <button onClick={handleLogout} className="btn btn-sm btn-outline-danger ms-2">
                      Kilépés
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="nav-link me-2">
                      <i className="fas fa-user me-2"></i> Belépés
                    </Link>
                    <span className="text-secondary">|</span>
                    <Link to="/register" className="nav-link ms-2">Regisztráció</Link>
                  </>
                )}
              </div>

              <div className="input-group w-25 position-relative">
                <input 
                  type="text" 
                  className="form-control search-box" 
                  placeholder="Keresés..." 
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsDropdownVisible(true);
                  }}
                  onFocus={() => setIsDropdownVisible(true)}
                  onBlur={() => setTimeout(() => setIsDropdownVisible(false), 200)} 
                />
                <span className="input-group-text search-box">
                  <i className="fas fa-search text-white"></i>
                </span>

                {searchTerm && isDropdownVisible && (
                  <div 
                    className="position-absolute w-100 bg-dark border border-secondary rounded shadow-lg" 
                    style={{ 
                      top: '100%', 
                      left: 0, 
                      zIndex: 1050, 
                      maxHeight: '400px',
                      overflowY: 'auto',
                      marginTop: '5px' 
                    }}
                  >
                    {filteredMovies.length > 0 ? (
                      filteredMovies.map(movie => (
                        <Link 
                          to={`/movie/${movie.id}`} 
                          key={movie.id}
                          className="d-flex align-items-center gap-3 p-3 text-decoration-none text-white border-bottom border-secondary dropdown-item-hover"
                          onClick={() => {
                            setSearchTerm('');
                            setIsDropdownVisible(false);
                          }}
                        >
                          <img 
                            src={normalizePicturePath(movie.picturePath)} 
                            alt={movie.title} 
                            style={{ width: '50px', height: '75px', objectFit: 'cover', borderRadius: '6px' }} 
                          />
                          <span className="fw-bold" style={{ fontSize: '16px' }}>{movie.title}</span>
                        </Link>
                      ))
                    ) : (
                      <div className="p-3 text-center text-white-50" style={{ fontSize: '15px' }}>
                        Nincs találat.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav className="navbar navbar-expand-lg main-nav">
        <div className="container-fluid px-5">
          <div className="navbar-nav w-100 justify-content-center">
            <Link className="nav-link" to="/movies">Műsoron</Link>
            <Link className="nav-link" to="/">Ajánlatok</Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;