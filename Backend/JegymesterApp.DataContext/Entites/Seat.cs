using System;
using System.Collections.Generic;
using System.Text;

namespace JegymesterApp.DataContext.Entites {
    public class Seat {
        public int Id { get; set; }
        public int SeatNumber { get; set; }
        public int RoomId { get; set; }
        public Room? Room { get; set; }
        public bool isTaken { get; set; } = true;
        //TODO refactor Ticket createing
    }
}
