import React, { useEffect, useState } from 'react';

function SeatSelection({
  screeningId,
  ticketPrice = 2500,
  maxSelectable = 6,
  onSelectionChange,
}) {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSeats = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(
          `http://localhost:5000/api/Screenings/GetSeats/${screeningId}`,
          {
            headers: {
              accept: '*/*',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        if (!response.ok) {
          throw new Error('Nem sikerült lekérni a székeket.');
        }

        const data = await response.json();
        setSeats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (screeningId) {
      loadSeats();
    }
  }, [screeningId]);

  const handleSeatClick = (seat) => {
    if (seat.isTaken) return;

    const alreadySelected = selectedSeats.some((s) => s.id === seat.id);

    let updatedSeats;

    if (alreadySelected) {
      updatedSeats = selectedSeats.filter((s) => s.id !== seat.id);
    } else {
      if (selectedSeats.length >= maxSelectable) return;
      updatedSeats = [...selectedSeats, seat];
    }

    setSelectedSeats(updatedSeats);

    if (onSelectionChange) {
      onSelectionChange(updatedSeats);
    }
  };

  const totalPrice = selectedSeats.length * ticketPrice;

  const rows = [];
  const seatsPerRow = 10;

  for (let i = 0; i < seats.length; i += seatsPerRow) {
    rows.push(seats.slice(i, i + seatsPerRow));
  }

  if (loading) {
    return (
      <div className="login-card p-4" style={{ maxWidth: '100%' }}>
        <h3 className="text-white mb-4">Helyválasztás</h3>
        <p className="login-text mb-0">Székek betöltése...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="login-card p-4" style={{ maxWidth: '100%' }}>
        <h3 className="text-white mb-4">Helyválasztás</h3>
        <p className="text-danger mb-0">{error}</p>
      </div>
    );
  }

  return (
    <div className="login-card p-4" style={{ maxWidth: '100%' }}>
      <h3 className="text-white mb-4">Helyválasztás</h3>

      <div className="screen-wrapper mb-4">
        <div className="screen-arc" />
        <div className="screen-label">VÁSZON</div>
      </div>

      <div className="cinema-room mb-4">
        {rows.map((rowSeats, rowIndex) => {
          const midpoint = Math.ceil(rowSeats.length / 2);
          const leftSeats = rowSeats.slice(0, midpoint);
          const rightSeats = rowSeats.slice(midpoint);

          return (
            <div key={rowIndex} className="seat-row-modern">
              <div className="row-label-modern">{rowIndex + 1}</div>

              <div className="seat-group-modern">
                {leftSeats.map((seat) => {
                  const isSelected = selectedSeats.some((s) => s.id === seat.id);

                  let className = 'seat-btn-modern';
                  if (seat.isTaken) className += ' occupied';
                  if (isSelected) className += ' selected';

                  return (
                    <button
                      key={seat.id}
                      type="button"
                      className={className}
                      disabled={seat.isTaken}
                      onClick={() => handleSeatClick(seat)}
                      title={`Szék ${seat.seatNumber}`}
                    >
                      {seat.seatNumber}
                    </button>
                  );
                })}
              </div>

              <div className="aisle-modern" />

              <div className="seat-group-modern">
                {rightSeats.map((seat) => {
                  const isSelected = selectedSeats.some((s) => s.id === seat.id);

                  let className = 'seat-btn-modern';
                  if (seat.isTaken) className += ' occupied';
                  if (isSelected) className += ' selected';

                  return (
                    <button
                      key={seat.id}
                      type="button"
                      className={className}
                      disabled={seat.isTaken}
                      onClick={() => handleSeatClick(seat)}
                      title={`Szék ${seat.seatNumber}`}
                    >
                      {seat.seatNumber}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4 col-6">
          <div className="legend-item-modern">
            <div className="legend-box-modern available" />
            <span className="login-text">Szabad</span>
          </div>
        </div>

        <div className="col-md-4 col-6">
          <div className="legend-item-modern">
            <div className="legend-box-modern selected" />
            <span className="login-text">Kiválasztott</span>
          </div>
        </div>

        <div className="col-md-4 col-6">
          <div className="legend-item-modern">
            <div className="legend-box-modern occupied" />
            <span className="login-text">Foglalt</span>
          </div>
        </div>
      </div>

      <div className="p-3 border border-secondary rounded">
        <p className="text-white mb-2">
          <strong>Kiválasztott helyek:</strong>{' '}
          {selectedSeats.length > 0
            ? selectedSeats.map((seat) => seat.seatNumber).join(', ')
            : 'Nincs kiválasztva'}
        </p>

        







<p className="text-white mb-2">
  <strong className="text-white">Darabszám:</strong> {selectedSeats.length}
</p>

<p className="text-white mb-2">
  <strong className="text-white">Jegyár:</strong> {ticketPrice} Ft / fő
</p>

<p className="text-white mb-0">
  <strong className="text-white">Fizetendő:</strong> {totalPrice} Ft
</p>





        
      </div>
    </div>
  );
}

export default SeatSelection;