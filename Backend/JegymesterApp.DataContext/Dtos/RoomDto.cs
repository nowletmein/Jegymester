using System;
using System.Collections.Generic;
using System.Text;

namespace JegymesterApp.DataContext.Dtos
{
    public class RoomDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool Available { get; set; } 
        public int Capacity { get; set; }

        public ICollection<SeatDto> Seats { get; set; } = new List<SeatDto>();

    }
    public class RoomCreateDto {

        public string Name { get; set; }
        public bool Available { get; set; }
        public int Capacity { get; set; }
    }
}
