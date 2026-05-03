using JegymesterApp.DataContext.Entites;
using System;
using System.Collections.Generic;
using System.Text;

namespace JegymesterApp.DataContext.Dtos
{
    public class TicketDto
    {
        public int Id { get; set; }
        public int ScreeningId { get; set; }   
        public int Price { get; set; }
        public int? UserId { get; set; }
        public string? UserName { get; set; }
        public string RoomName { get; set; }
        public int SeatNumber { get; set; }
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime PurchaseDate { get; set; }
        public bool IsCancelled { get; set; }
        public bool IsVerified { get; set; }
    }
    public class TicketCreateDto 
    {
        public int ScreeningId { get; set; }
        public int? UserId { get; set; }

        public int SeatNumber { get; set; }
        
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}
