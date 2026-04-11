using JegymesterApp.DataContext.Context;
using JegymesterApp.DataContext.Dtos;
using JegymesterApp.DataContext.Entites;
using JegymesterApp.Services.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace JegymesterApp.Services
{
    public interface ITicketService
    {
        Task<int> Create(TicketCreateDto ticketCreateDto, int? userId);
        Task<int> Verify(int ticketId);
        Task<TicketDto> Get(int ticketId);
        Task<int> Delete(int ticketId);
    }
    public class TicketService : ITicketService
    {
        private readonly JegymesterDbContext _context;

        public TicketService(JegymesterDbContext context)
        {
            _context = context;
        }
        public TicketDto MapToTickeDto(Ticket ticket) {
            var ticketDto = new TicketDto() {
                Id = ticket.Id,
                Email = ticket.Email,
                IsCancelled = ticket.IsCancelled,
                IsVerified = ticket.IsVerified,
                Phone = ticket.Phone,
                PurchaseDate = ticket.PurchaseDate,
                ScreeningId = ticket.ScreeningId,
                UserId = ticket.UserId,
                UserName = ticket.User?.Name
            };
            return ticketDto;
        }
        public Ticket MapToTicket(TicketDto ticketDto) {
            var ticket = new Ticket() {
                Id = ticketDto.Id,
                Email = ticketDto.Email,
                IsCancelled =ticketDto.IsCancelled,
                IsVerified=ticketDto.IsVerified,
                Phone=ticketDto.Phone,
                PurchaseDate=ticketDto.PurchaseDate,
                ScreeningId=ticketDto.ScreeningId,
                UserId=ticketDto.UserId
            };
            return ticket;
        }
        /*public Ticket MapToTicket(TicketCreateDto ticketCreateDto) {
            var ticket = new Ticket() {
                ScreeningId = ticketCreateDto.ScreeningId,
                UserId = userId,
                Phone = ticketCreateDto.Phone,
                Email = ticketCreateDto.Email,
                PurchaseDate = DateTime.Now,
            };
        }*/
        public async Task<int> Create(TicketCreateDto ticketCreateDto, int? userId)
        {
            var ticket = new Ticket
            {
                ScreeningId = ticketCreateDto.ScreeningId,
                UserId = userId,
                Phone = ticketCreateDto.Phone,
                Email = ticketCreateDto.Email,
                PurchaseDate = DateTime.Now,
                

            };
            await _context.Tickets.AddAsync(ticket);
            await _context.SaveChangesAsync();
            /*
             *  public int Id { get; set; }
                public int ScreeningId { get; set; }//vetítés amihez tartozik a Ticket
                public Screening Screening { get; set; }
                public int? UserId { get; set; }//Tulajdonos Felhasználója a Ticketnek (Lehet guest is) 
                public User? User { get; set; }
                public string Phone { get; set; }
                public string Email { get; set; }
                public DateTime PurchaseDate { get; set; }
                public bool IsCancelled { get; set; } = false;
                public bool isVerified { get; set; } = false; 
             */
            return ticket.Id;
        }

        public async Task<int> Delete(int ticketId)
        {
            var ticket = await _context.Tickets.FirstOrDefaultAsync(x => x.Id == ticketId);
            if (ticket == null)
            {
                throw new TicketNotFoundException($"There is no ticket with this ID: {ticketId}");
            }
            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();
            return 0;
        }

        public async Task<TicketDto> Get(int ticketId)
        {
            var ticket = _context.Tickets.FirstOrDefault(x => x.Id == ticketId);
            if (ticket == null) {
                throw new TicketNotFoundException($"There is no ticket with this ID: {ticketId}");
            }
            /*  public int ScreeningId { get; set; }
                public int? CreatorId { get; set; }
                public string? CreatorName { get; set; }
                public string Phone { get; set; }
                public string Email { get; set; }*/
            return MapToTickeDto(ticket);
            
        }

        public async Task<int> Verify(int ticketId)
        {
            var ticket = _context.Tickets.FirstOrDefault(x => x.Id == ticketId);
            if (ticket == null) 
            {
                throw new TicketNotFoundException($"There is no ticket with this ID: {ticketId}");
            }
            
            ticket.IsVerified = true;
            await _context.SaveChangesAsync();
            return ticket.Id;
        }
    }
}
