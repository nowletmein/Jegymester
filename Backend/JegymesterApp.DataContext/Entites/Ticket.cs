using System;
using System.Collections.Generic;
using System.Text;

namespace JegymesterApp.DataContext.Entites
{
    internal class Ticket
    {
        public int Id { get; set; }
        public int CreatorUserId { get; set; }
        public User Creator { get; set; } // User aki indította a vásárlást (user a weboldalról/pénztáros/admin)
        public string ContactEmail { get; set; }//Email megadva HA guest / Owner User fiók hoz tartozó Email
        public string ContactPhone { get; set; }//telefon megadva HA guest / Owner User fiók hoz tartozó telefon
        public int ScreeningId { get; set; }//vetítés amihez tartozik a Ticket
        public Screening screening { get; set; }
        public int OwnerId {  get; set; }//Tulajdonos Felhasználója a Ticketnek (Lehet guest is) 
        public User Owner { get; set; }
        public DateTime PurchaseDate { get; set; }

    }
}
