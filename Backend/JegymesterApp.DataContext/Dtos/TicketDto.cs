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
        public int? CreatorId { get; set; }
        public string? CreatorName { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public DateTime PurchaseDate { get; set; }
        public bool IsCancelled { get; set; }
        public bool IsVerified { get; set; }
    }
    public class TicketCreateDto 
    {
        public int ScreeningId { get; set; }
        public int? CreatorId { get; set; }
        public string? CreatorName { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
    }
}
