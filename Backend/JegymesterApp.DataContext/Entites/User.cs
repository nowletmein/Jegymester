using System;
using System.Collections.Generic;
using System.Text;
using JegymesterApp.DataContext.Entites;
namespace JegymesterApp.DataContext.Entites
{
    public class User
    {
        public int Id { get; set; }
        //Create Role Entity
        public List<Role> Roles { get; set; } = new List<Role>();
        public string Name { get; set; }
        public string Email { get; set; } = "";
        public string Phone { get; set; }
        public string Password { get; set; }
        public ICollection<Screening> ShopingCart { get; set; } = new List<Screening>(); //Felhasználó által kosárba rakott vetítések
        public ICollection<Ticket> PurchasedTickets { get; set; } = new List<Ticket>(); //Felhasználó által vásárolt jegyek
    }
}
