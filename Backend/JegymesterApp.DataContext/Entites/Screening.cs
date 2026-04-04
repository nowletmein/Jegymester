using System;
using System.Collections.Generic;
using System.Text;
using JegymesterApp.DataContext.Entites;
namespace JegymesterApp.DataContext.Entites
{
    public class Screening
    {
        public int Id { get; set; }
        public int MovieId { get; set; }
        public Movie Movie { get; set; } //vetítéshez tartozó film
        public DateTime ScreeningDate {  get; set; }
        public int RoomId { get; set; } //Create room entity
        public Room Room { get; set; }
        public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>(); //vetítéshez tartozó aktivált jegyek
    }
}
