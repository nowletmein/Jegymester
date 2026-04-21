using JegymesterApp.DataContext.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace JegymesterApp.Services
{
    public class UserService
    {
        public interface IUserService {
            Task<int> Create(TicketCreateDto ticketCreateDto);
            Task<TicketDto> Get(int ticketId);
            Task<int> Delete(int ticketId);
        }
    }
}
