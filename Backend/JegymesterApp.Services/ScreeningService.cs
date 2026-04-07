using JegymesterApp.DataContext.Context;
using JegymesterApp.DataContext.Dtos;
using JegymesterApp.DataContext.Entites;
using JegymesterApp.Services.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace JegymesterApp.Services {
    public interface IScreeningService {
        Task<List<WeeklyScheduleDto>> GetWeekly();
        Task<ScreeningDto> Get(int Id);
        Task<int> Create(ScreeningCreateDto screeningCreateDto);
    }
    public class ScreeningService : IScreeningService {
        private readonly JegymesterDbContext _context;

        public ScreeningService(JegymesterDbContext context) {
            _context = context;
        }
        public ScreeningDto MapToScreeningDto(Screening screening) {
            var screeningDto = new ScreeningDto() {
                Id = screening.Id,
                MovieId = screening.MovieId,
                ScreeningDate = screening.ScreeningDate,
                RoomId = screening.RoomId,
                // Mapping the nested Tickets to TicketDtos
                TicketDtos = screening.Tickets.Select(t => new TicketDto {
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
            };
            return screeningDto;
        }
        public Screening MapToScreening(ScreeningCreateDto screeningCreateDto) {
            var screening = new Screening() {
                MovieId = screeningCreateDto.MovieId,
                RoomId = screeningCreateDto.RoomId,
                ScreeningDate = screeningCreateDto.ScreeningDate
            };
            return screening;
        }

        public async Task<ScreeningDto> Get(int Id) {
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
            .Select(s => MapToScreeningDto(s)).FirstOrDefaultAsync();
            if(screening == null)
            {
                throw new ScreeningNotFoundException("Screening Not Found");
            }
            return screening;
        }

        public async Task<List<WeeklyScheduleDto>> GetWeekly() {
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
            // Sunday is 0 in C#, the end (7) to keep Monday (1) first
            .OrderBy(g => g.Key == DayOfWeek.Sunday ? 7 : (int) g.Key)
            .Select(g => new WeeklyScheduleDto {
                Day = g.Key.ToString(),
                Screenings = g.Select(s => MapToScreeningDto(s)).ToList()
            })
            .ToList();
            

        }

        public async Task<int> Create(ScreeningCreateDto screeningCreateDto) {
            
            var screening = MapToScreening(screeningCreateDto);
            
            if(_context.Screenings.Any(x => x.ScreeningDate == screeningCreateDto.ScreeningDate && x.MovieId == screeningCreateDto.MovieId && x.RoomId == screeningCreateDto.RoomId) ) {
                throw new ScreeningAlreadyExists("Egy Vetítés ezzel az időpontal filmel és szoba Id val már létezik");
            }

            await _context.Screenings.AddAsync(screening);
            await _context.SaveChangesAsync();
            
            return screening.Id;
        }
    }
}
