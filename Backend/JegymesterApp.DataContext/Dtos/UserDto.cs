using JegymesterApp.DataContext.Entites;
using System;
using System.Collections.Generic;
using System.Text;

namespace JegymesterApp.DataContext.Dtos
{
    public class UserDto {
        public int Id { get; set; }
        //Create Role Entity
        public string Name { get; set; }
        public string Email { get; set; } = "";
        public string Phone { get; set; }
        public ICollection<ScreeningDto> ShopingCart { get; set; } = new List<ScreeningDto>(); //Felhasználó által kosárba rakott vetítések
        public ICollection<TicketDto> Tickets { get; set; } = new List<TicketDto>();
    }
    public class UserCreateDto {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Password { get; set; }
    }
}
