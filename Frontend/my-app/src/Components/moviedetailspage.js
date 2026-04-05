import React from 'react';
import MovieDetails from './moviedetails.js';
import Header from './header.js';
import Footer from './footer.js';

const MovieDetailsPage = () => {
  return (
    <div className="page-wrapper">
      <Header />

      <main className="main-content">
        <div id="movie-content" className="movie-details">
          <MovieDetails />
        </div>
      </main>

      <Footer />

    </div>
  );
};

export default MovieDetailsPage;