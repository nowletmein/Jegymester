using System;
using System.Collections.Generic;
using System.Text;

namespace JegymesterApp.DataContext.Dtos
{
    public class ScreeningDto
    {
        /*public int Id { get; set; }
        public int MovieId { get; set; }
        public Movie Movie { get; set; } //vetítéshez tartozó film
        public DateTime ScreeningDate {  get; set; }
        public string Room { get; set; }
        public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>(); //vetítéshez tartozó aktivált jegyek*/

        public int Id { get; set; }
        public int MovieId { get; set; }
        public DateTime ScreeningDate { get; set; }
        public int RoomId { get; set; }
        public ICollection<TicketDto>? TicketDtos { get; set; } = new List<TicketDto>();

    }
    public class ScreeningCreateDto
    {

    }
}
