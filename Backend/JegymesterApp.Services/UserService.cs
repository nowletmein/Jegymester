using JegymesterApp.DataContext.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace JegymesterApp.Services
{
    public interface IUserService
    {
        Task<int> Create(TicketCreateDto ticketCreateDto);
        Task<TicketDto> Get(int ticketId);
        Task<int> Delete(int ticketId);
        Task<int> Edit();
        Task<int> Login(string email, string password);
    }
    public class UserService : IUserService
    {
        public Task<int> Create(TicketCreateDto ticketCreateDto)
        {
            throw new NotImplementedException();
        }

        public Task<int> Delete(int ticketId)
        {
            throw new NotImplementedException();
        }

        public Task<int> Edit()
        {
            throw new NotImplementedException();
        }

        public Task<TicketDto> Get(int ticketId)
        {
            throw new NotImplementedException();
        }

        public Task<int> Login(string email, string password)
        {
            throw new NotImplementedException();
        }
    }
}
