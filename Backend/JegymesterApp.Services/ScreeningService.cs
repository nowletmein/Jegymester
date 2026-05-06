using JegymesterApp.DataContext.Context;
using JegymesterApp.DataContext.Dtos;
using JegymesterApp.DataContext.Entites;
using JegymesterApp.Services.Exceptions;
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
        Task<int> Create(ScreeningCreateDto screeningCreateDto);
        Task<int> Delete(int Id);
        Task<ScreeningDto> Edit(int Id, ScreeningCreateDto screeningCreateDto);
        Task<int> AddTestData();
        Task<List<ScreeningDto>> GetRoomUnavailableScreenings();
        Task<List<SeatDto>> GetSeats(int Id);
    }
    public class ScreeningService : IScreeningService {
        private readonly JegymesterDbContext _context;
        public object? GetDefault(Type type) {
            if ( type.IsValueType ) {
                return Activator.CreateInstance(type);
            }
            return null;
        }

        public ScreeningService(JegymesterDbContext context) {
            _context = context;
        }
        public ScreeningDto MapToScreeningDto(Screening screening) {
            var screeningDto = new ScreeningDto() {
                Id = screening.Id,
                MovieId = screening.MovieId,
                // Optional: Add MovieTitle to the ScreeningDto itself if needed
                MovieTitle = screening.Movie?.Title ?? "Ismeretlen",
                ScreeningDate = screening.ScreeningDate,
                Price = screening.Price,
                RoomId = screening.RoomId,
                TicketDtos = screening.Tickets?.Select(t => new TicketDto {
                    Id = t.Id,
                    ScreeningId = t.ScreeningId,
                    UserId = t.UserId,
                    UserName = t.User?.Name,
                    Phone = t.Phone,
                    Email = t.Email,
                    PurchaseDate = t.PurchaseDate,
                    IsCancelled = t.IsCancelled,
                    IsVerified = t.IsVerified,
                    SeatNumber = t.SeatNumber,
                    // Use the screening object already passed in to avoid null references
                    MovieTitle = screening.Movie?.Title ?? "Ismeretlen"
                }).ToList() ?? new List<TicketDto>()
            };
            return screeningDto;
        }
        public Screening MapToScreening(ScreeningCreateDto screeningCreateDto) {
            var screening = new Screening() {
                MovieId = screeningCreateDto.MovieId,
                RoomId = screeningCreateDto.RoomId,
                ScreeningDate = screeningCreateDto.ScreeningDate,
                Price = screeningCreateDto.Price
            };
            return screening;
        }
        public SeatDto MapToSeatDto(Seat seat) {
            var seatDto = new SeatDto() {
                Id = seat.Id,
                isTaken=seat.isTaken,
                RoomId=seat.RoomId,
                SeatNumber = seat.SeatNumber
            };
            return seatDto;
        }
        public Screening MapToScreening(ScreeningDto screeningDto) {
            
            if ( screeningDto == null ) return null;


            return new Screening() {
                Id = screeningDto.Id,
                MovieId = screeningDto.MovieId,
                RoomId = screeningDto.RoomId,
                ScreeningDate = screeningDto.ScreeningDate,
                Price=screeningDto.Price,
                Tickets = screeningDto.TicketDtos?.Select(t => new Ticket() {
                    Id = t.Id,
                    Email = t.Email,
                    IsCancelled = t.IsCancelled,
                    IsVerified = t.IsVerified, 
                    Phone = t.Phone,
                    PurchaseDate = t.PurchaseDate,
                    ScreeningId = t.ScreeningId,
                    UserId = t.UserId
                }).ToList() ?? new List<Ticket>()
            };


        }

        public async Task<ScreeningDto> Get(int Id) {
              
            var screening = await _context.Screenings.FirstOrDefaultAsync(x => x.Id == Id);
            if(screening == null)
            {
                throw new ScreeningNotFoundException("Screening Not Found");
            }
            return MapToScreeningDto(screening);
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
            .Include(s => s.Movie)   // THIS WAS MISSING
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
                throw new ScreeningAlreadyExists("Screening already Exists with this date, Movie and roomId");
            }

            await _context.Screenings.AddAsync(screening);
            await _context.SaveChangesAsync();
            
            return screening.Id;
        }

        public async Task<int> Delete(int Id) {
            var screening = await _context.Screenings.FirstOrDefaultAsync(x => x.Id == Id);
            if ( screening == null ) throw new ScreeningNotFoundException($"Screening Not Found with {Id}");
            
            _context.Screenings.Remove(screening);
            await _context.SaveChangesAsync();
            return 0;
        }

        public async Task<ScreeningDto> Edit(int Id, ScreeningCreateDto screeningCreateDto) {

            
            var screening = await _context.Screenings.FirstOrDefaultAsync(x => x.Id == Id);

            if ( screening == null ) {
               
                throw new ScreeningNotFoundException("Screening not found");
            }

            
            var properties = typeof(ScreeningCreateDto).GetProperties();

            foreach ( var prop in properties ) {
                var newValue = prop.GetValue(screeningCreateDto);

                
                bool skipUpdate = newValue switch {
                    null => true,
                    string s when string.IsNullOrWhiteSpace(s) => true,
                    
                    var val when val.Equals(GetDefault(prop.PropertyType)) => true,
                    _ => false
                };

                if ( !skipUpdate ) {
                    var targetProperty = screening.GetType().GetProperty(prop.Name);

                    if ( targetProperty != null && targetProperty.CanWrite ) {
                        targetProperty.SetValue(screening, newValue);
                    }
                }
            }

            await _context.SaveChangesAsync();
            return MapToScreeningDto(screening);
        }

        public async Task<int> AddTestData() {
            var movies = await _context.Movies.ToListAsync();
            if ( !movies.Any() ) return 0;
            var rooms = await _context.Rooms.ToListAsync();
            // 1. Ensure we have at least 5 Rooms to assign to screenings
            if ( rooms.Count < 5) {
                for ( int i = 1; i <= 5; i++ ) {
                    _context.Rooms.Add(new Room { Name = $"Hall {i}", Capacity = 100, Available=true });
                }
                await _context.SaveChangesAsync();
            }

            
            var screenings = new List<Screening>();

            // 2. Generate 5 screenings per movie across the week
            foreach ( var movie in movies ) {
                var movieIndex = movies.IndexOf(movie);

                for ( int day = 0; day < 5; day++ ) {
                    screenings.Add(new Screening {
                        MovieId = movie.Id,
                        Price=2500,
                        RoomId = rooms[movieIndex % rooms.Count].Id, 
                        ScreeningDate = DateTime.Today.AddDays(day).AddHours(14 + movieIndex),
                        
                    });
                }
            }

            _context.Screenings.AddRange(screenings);
            return await _context.SaveChangesAsync();
        }

        public async Task<List<ScreeningDto>> GetRoomUnavailableScreenings() {
            var screenings = await _context.Screenings.Where(x => x.Room.Available == false).ToListAsync();
            var screeningsDto = new List<ScreeningDto>();

            if(screenings == null ) {  return screeningsDto; }

            foreach ( var screening in screenings ) {
                screeningsDto.Add(MapToScreeningDto( screening ));
            }
            return screeningsDto;
            
        }

        public async Task<List<SeatDto>> GetSeats(int Id) {
            var screening = await _context.Screenings.Include(x => x.Room).ThenInclude(x => x.Seats).FirstOrDefaultAsync(x => x.Id == Id);
            if(screening == null ) {
                throw new ScreeningNotFoundException("screening not found");
            }
            var seats = screening.Room.Seats.ToList();
            var seatsDto = new List<SeatDto>();
            foreach ( var seat in seats ) {
                seatsDto.Add(MapToSeatDto(seat));
            }

            return seatsDto;
        }
    }
}

