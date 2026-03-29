import React from 'react';
import '../Components/style/comp.css';
import Header from './header.js';
import Footer from './footer.js';


function App() {
  const movies = [
    { id: 4, title: 'Film Címe 1' },
    { id: 5, title: 'Film Címe 2' },
    { id: 6, title: 'Film Címe 3' },
    { id: 7, title: 'Film Címe 4' },
    { id: 8, title: 'Film Címe 5' },
    { id: 9, title: 'Film Címe 6' },
    { id: 10, title: 'Film Címe 7' },
    { id: 11, title: 'Film Címe 8' },
  ];

  return (
    <div className="App">
      <Header />

      <main className="container main-content">
        <div className="carousel-header mx-auto text-center py-4">
          <h1 className="text-light">Legfrissebb megjelenések</h1>
        </div>

        <div id="carouselExampleInterval" className="carousel slide mx-auto" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active" data-bs-interval="1000">
              <img src="../../content_img/1.png" className="d-block w-100" style={{ height: '400px' }} alt="Slide 1" />
            </div>
            <div className="carousel-item" data-bs-interval="2000">
              <img src="../../content_img/2.jpg" className="d-block w-100" style={{ height: '400px' }} alt="Slide 2" />
            </div>
            <div className="carousel-item">
              <img src="../../content_img/3.png" className="d-block w-100" style={{ height: '400px' }} alt="Slide 3" />
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        <div className="container popular-movies my-5">
          <h2 className="text-light mb-4 text-center">Népszerű filmek</h2>
          <div className="row g-4 justify-content-center">
            {movies.map(movie => (
              <div key={movie.id} className="col-md-3">
                <div className="card bg-dark text-white h-100">
                  <img src={`./content_img/${movie.id}.jpg`} className="card-img-top" alt={movie.title} />
                  <div className="card-body">
                    <h5 className="card-title">{movie.title}</h5>
                    <p className="card-text">Rövid leírás a filmről.</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;