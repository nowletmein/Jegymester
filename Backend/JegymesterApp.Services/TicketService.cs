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
        Task<int> Create(TicketCreateDto ticketCreateDto);
        Task<int> Verify(int ticketId);
        Task<TicketDto> Get(int ticketId);
        Task<int> Delete(int ticketId);
        Task<int> Cancel(int ticketId, int? userId);
        Task<int> CashierCreate(int screeningId, string uEmail, string uPhone, int seatNumber);
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
                RoomName=ticket.Screening.Room.Name,
                SeatNumber=ticket.SeatNumber,
                Phone = ticket.Phone,
                PurchaseDate = ticket.PurchaseDate,
                ScreeningId = ticket.ScreeningId,
                UserId = ticket.UserId,
                UserName = ticket.User?.Name,
                Price=ticket.Screening.Price,
            };
            return ticketDto;
        }
        public Ticket MapToTicket(TicketDto ticketDto) {
            var ticket = new Ticket() {
                Id = ticketDto.Id,
                SeatNumber=ticketDto.SeatNumber,
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
        public async Task<int> Create(TicketCreateDto ticketCreateDto)
        {
            var ticket = new Ticket
            {
                ScreeningId = ticketCreateDto.ScreeningId,
                UserId = ticketCreateDto.UserId > 0 ? ticketCreateDto.UserId : null,
                Phone = ticketCreateDto.Phone,
                Email = ticketCreateDto.Email,
                PurchaseDate = DateTime.Now,
                SeatNumber = ticketCreateDto.SeatNumber

            };
            //var seat = await _context.Seats.FirstOrDefaultAsync(x => x.SeatNumber == ticket.SeatNumber && x.RoomId == ticket.Screening.RoomId);
            //var seat = await _context.Seats.FirstOrDefaultAsync(x => x.SeatNumber == ticket.SeatNumber && x.RoomId == ticketCreateDto.RoomId);


            var screening = await _context.Screenings.FirstOrDefaultAsync(s => s.Id == ticketCreateDto.ScreeningId);

            if (screening == null) throw new Exception("Screening not found");

            var seat = await _context.Seats.FirstOrDefaultAsync(x => x.SeatNumber == ticket.SeatNumber && x.RoomId == screening.RoomId);





            if (seat == null || seat.isTaken == true ) {
                throw new SeatNotAvailableException("Seat not available");
            }
            seat.isTaken = true;
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
            var ticket = await _context.Tickets.Include(x => x.Screening).FirstOrDefaultAsync(x => x.Id == ticketId);
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
            var ticket = await _context.Tickets.FirstOrDefaultAsync(x => x.Id == ticketId);
            if (ticket == null) 
            {
                throw new TicketNotFoundException($"There is no ticket with this ID: {ticketId}");
            }
            
            ticket.IsVerified = true;
            await _context.SaveChangesAsync();
            return ticket.Id;
        }

        public async Task<int> Cancel(int ticketId, int? userId)
        {
            var ticket = await _context.Tickets.Include(x => x.Screening).FirstOrDefaultAsync(x => x.Id == ticketId);
            
            if (ticket == null) { 
                throw new TicketNotFoundException("No ticket with this id found");
            }
            if (userId != null) {
                if (ticket.UserId != userId) {
                    throw new TicketNotFoundException("This user doesent have a ticket with this Id Y cant delete other users tickets");
                }
            }
            var timeUntilScreening = ticket.Screening.ScreeningDate - DateTime.Now;

            if (timeUntilScreening.TotalHours < 4)
            {
                throw new InvalidOperationException("Már nem lehet a jegyet lemondani");
            }
            var seat = await _context.Seats.FirstOrDefaultAsync(x => x.SeatNumber == ticket.SeatNumber && x.RoomId == ticket.Screening.RoomId);
            if ( seat == null ) {
                throw new InvalidOperationException("This Ticket does not contain a Seat");
            }
            seat.isTaken = false;
            ticket.IsCancelled = true;
            await _context.SaveChangesAsync();
            return ticket.Id;
        }
        public async Task<int> CashierCreate(int screeningId, string uEmail, string uPhone, int seatNumber) {
            var screening = await _context.Screenings.FirstOrDefaultAsync(s => s.Id == screeningId);
            if (screening == null) {
                throw new ScreeningNotFoundException("A keresett vetítés nem található.");
            }

            var isSeatTaken = await _context.Tickets.AnyAsync(t =>
                t.ScreeningId == screeningId &&
                t.SeatNumber == seatNumber &&
                !t.IsCancelled);

            if (isSeatTaken) {
                throw new Exception("Ez a szék már foglalt!");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == uEmail);

            var ticket = new Ticket() {
                Email = uEmail,
                Phone = uPhone,
                SeatNumber = seatNumber,
                ScreeningId = screeningId,
                UserId = user?.Id,
                IsCancelled = false,
                IsVerified = true,
                PurchaseDate = DateTime.Now
            };

            await _context.Tickets.AddAsync(ticket);
            await _context.SaveChangesAsync();
            return ticket.Id;
        }
    }
}
