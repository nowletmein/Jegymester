using JegymesterApp.DataContext.Context;
using JegymesterApp.DataContext.Dtos;
using JegymesterApp.DataContext.Entites;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace JegymesterApp.Services
{
    public interface IScreeningService
    {
        Task<List<WeeklyScheduleDto>> GetWeekly();
        Task<ScreeningDto> Get(int Id);
    }
    public class ScreeningService : IScreeningService
    {
        private readonly JegymesterDbContext _context;

        public ScreeningService(JegymesterDbContext context)
        {
            _context = context;
        }
        public async Task<ScreeningDto> Get(int Id)
        {
            /*   public int Id { get; set; }
        public int ScreeningId { get; set; }   
        public int? UserId { get; set; }
        public string? UserName { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public DateTime PurchaseDate { get; set; }
        public bool IsCancelled { get; set; }
        public bool IsVerified { get; set; }*/
            var screening = await _context.Screenings
        .Where(x => x.Id == Id)
        .Select(s => new ScreeningDto
        {
            Id = s.Id,
            MovieId = s.MovieId,
            ScreeningDate = s.ScreeningDate,
            RoomId = s.RoomId,
            // Mapping the nested Tickets to TicketDtos
            TicketDtos = s.Tickets.Select(t => new TicketDto
            {
                Id = t.Id,
                ScreeningId = t.ScreeningId,
                UserId = t.UserId,
                UserName = t.User.Name,
                Phone = t.Phone,
                Email = t.Email,
                PurchaseDate = t.PurchaseDate,
                IsCancelled = t.IsCancelled,
                IsVerified = t.isVerified

            }).ToList()
        }).FirstOrDefaultAsync();
           
            return screening;
        }

        public async Task<List<WeeklyScheduleDto>> GetWeekly()
        {
            var today = DateTime.Today;

            // Get Monday of the current week
            int diff = (7 + (today.DayOfWeek - DayOfWeek.Monday)) % 7;
            var startOfWeek = today.AddDays(-1 * diff).Date;

            // End of week (Sunday)
            var endOfWeek = startOfWeek.AddDays(7);
            var screenings = await _context.Screenings
            .Where(s => s.ScreeningDate >= startOfWeek && s.ScreeningDate < endOfWeek)
            .Include(s => s.Tickets) 
            .ToListAsync();

            return screenings
            .GroupBy(s => s.ScreeningDate.DayOfWeek)
            .OrderBy(g => (int)g.Key == 0 ? 7 : (int)g.Key) // Custom sort so Monday is first, Sunday last
            .Select(g => new WeeklyScheduleDto
            {
                Day = g.Key.ToString(),
                Screenings = g.Select(s => new ScreeningDto
                {
                    Id = s.Id,
                    MovieId = s.MovieId,
                    ScreeningDate = s.ScreeningDate,
                    RoomId = s.RoomId
                }).ToList()
            })
            .ToList();
        }
    }
}
