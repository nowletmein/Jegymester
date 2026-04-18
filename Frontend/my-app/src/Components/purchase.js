import React from 'react';
import '../Components/style/comp.css';
import Header from './header.js';
import Footer from './footer.js';

function Purchase() {
  return (
    <>
      <Header />

      <main className="container py-5">
        <div className="mb-4">
          <h1 className="text-white fw-bold">Jegyvásárlás</h1>
          <p className="login-text mb-0">
            Ez egy bemutató oldal a jegyvásárlási folyamat szemléltetésére.
          </p>
        </div>

        <div className="row g-4">
          <div className="col-lg-5">
            <div className="login-card p-4" style={{ maxWidth: '100%' }}>
              <h3 className="text-white mb-4">Kiválasztott vetítés</h3>

              <p className="login-text mb-2">
                <strong className="text-white">Film:</strong> Dűne: Második rész
              </p>
              <p className="login-text mb-2">
                <strong className="text-white">Műfaj:</strong> Sci-Fi / Kaland
              </p>
              <p className="login-text mb-2">
                <strong className="text-white">Játékidő:</strong> 166 perc
              </p>
              <p className="login-text mb-2">
                <strong className="text-white">Korhatár:</strong> 16+
              </p>
              <p className="login-text mb-2">
                <strong className="text-white">Nap:</strong> Hétfő, 04.07
              </p>
              <p className="login-text mb-3">
                <strong className="text-white">Időpont:</strong> 17:00
              </p>

              <hr className="border-secondary" />

              <p className="login-text mb-2">
                <strong className="text-white">Jegyár:</strong> 2500 Ft / fő
              </p>
              <p className="login-text mb-0">
                <strong className="text-white">Fizetendő:</strong> 5000 Ft
              </p>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="login-card p-4" style={{ maxWidth: '100%' }}>
              <h3 className="text-white mb-4">Vásárlási adatok</h3>

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-3">
                  <label className="form-label text-white">Teljes név</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Vásárló neve"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-white">E-mail cím</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="pelda@email.com"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-white">Telefonszám</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="+36 30 123 4567"
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-white">Darabszám</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="2"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label text-white">Szék(ek)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="pl. A10, A11"
                    />
                  </div>
                </div>

                <button type="button" className="btn btn-primary w-100">
                  Jegy megvásárlása
                </button>
              </form>

              <div className="mt-4 p-3 border border-secondary rounded">
                
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Purchase;