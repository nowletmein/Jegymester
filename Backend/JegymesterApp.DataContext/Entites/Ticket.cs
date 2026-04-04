using JegymesterApp.DataContext.Entites;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
namespace JegymesterApp.DataContext.Entites
{
    public class Ticket
    {
        public int Id { get; set; }
        public int ScreeningId { get; set; }//vetítés amihez tartozik a Ticket
        public Screening Screening { get; set; }
        public int? UserId { get; set; }//Tulajdonos Felhasználója a Ticketnek (Lehet guest is) 
        
        [ForeignKey("UserId")]
        public User? User { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public DateTime PurchaseDate { get; set; }
        public bool IsCancelled { get; set; } = false;
        public bool isVerified { get; set; } = false; 

    }
}
