using System;
using System.Collections.Generic;
using System.Text;

namespace JegymesterApp.DataContext.Dtos {
    public class SeatDto {
        public int Id { get; set; }
        public int SeatNumber { get; set; }
        public int RoomId { get; set; }
        public bool isTaken { get; set; } = true;
    }
}
