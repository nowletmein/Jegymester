using JegymesterApp.DataContext.Context;
using JegymesterApp.DataContext.Dtos;
using JegymesterApp.DataContext.Entites;
using JegymesterApp.Services;
using JegymesterApp.Services.Exceptions;
using Microsoft.EntityFrameworkCore;
namespace JegymesterApp.Services
{
    public interface ITicketService
    {
        Task<int> Create(TicketCreateDto ticketCreateDto, int? userId);
        Task<int> VerifyTicket(int ticketId);
        Task<TicketDto> Get(int ticketId);
    }
    public class TicketService : ITicketService
    {
        private readonly JegymesterDbContext _context;

        public TicketService(JegymesterDbContext context)
        {
            _context = context;
        }
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
            return new TicketDto
            {
                ScreeningId = ticket.ScreeningId,
                CreatorId = ticket.UserId,
                CreatorName = ticket.User.Name,
                Phone = ticket.Phone,
                Email = ticket.Email,
            };
            
        }

        public async Task<int> VerifyTicket(int ticketId)
        {
            var ticket = _context.Tickets.FirstOrDefault(x => x.Id == ticketId);
            if (ticket == null) 
            {
                throw new TicketNotFoundException($"There is no ticket with this ID: {ticketId}");
            }
            
            ticket.isVerified = true;
            
            return ticket.Id;
        }
    }
}
