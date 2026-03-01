using System;
using System.Collections.Generic;
using System.Text;

namespace JegymesterApp.DataContext.Entites
{
    internal class Screening
    {
        public int Id { get; set; }
        public int MovieId { get; set; }
        public Movie Movie { get; set; } //vetítéshez tartozó film
        public DateTime ScreeningDate {  get; set; }
        public string Room { get; set; }
        public ICollection<Ticket> tickets { get; set; } = new List<Ticket>(); //vetítéshez tartozó aktivált jegyek
    }
}
