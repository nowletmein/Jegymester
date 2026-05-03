using System;
using System.Collections.Generic;
using System.Text;

namespace JegymesterApp.DataContext.Entites
{
    public class Room
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool Available { get; set; } = true;
        public int Capacity { get; set; }
        public ICollection<Screening> Screenings { get; set; } = new List<Screening>();

        public ICollection<Seat> Seats { get; set; } = new List<Seat>();

    }
}
