using System;
using System.Collections.Generic;
using System.Text;

namespace JegymesterApp.DataContext.Entites
{
    internal class User
    {
        public int Id { get; set; }
        public string Role { get; set; } = "User";
        public string Name { get; set; }
        public string Email { get; set; } = "";
        public string Password { get; set; }
        public ICollection<Screening> ShopingCart { get; set; } = new List<Screening>(); //Felhasználó által kosárba rakott vetítések
        public ICollection<Ticket> PurchasedTickets { get; set; } = new List<Ticket>(); //Felhasználó által vásárolt jegyek
    }
}
