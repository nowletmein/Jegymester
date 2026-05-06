using JegymesterApp.DataContext.Context;
using JegymesterApp.DataContext.Dtos;
using JegymesterApp.DataContext.Entites;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace JegymesterApp.Services {
    public interface IRoomService {
        Task<List<RoomDto>> GetAll();
        Task<RoomDto> Get(int Id);
        Task<int> Create(RoomCreateDto roomDto);
        Task<int> Delete(int Id);
        Task<RoomDto> Edit(int Id, RoomDto roomDto);
        Task<Boolean> SetAvailablility(int Id);
        Task<int> AddTestData();
        Task<int> FillRoomWithSeats(int seatNum, int roomId);
    }
    public class RoomService : IRoomService {

        private readonly JegymesterDbContext _context;
        public RoomService(JegymesterDbContext context) {
            _context = context;
        }
        private object? GetDefault(Type type) => type.IsValueType ? Activator.CreateInstance(type) : null;
        public RoomDto MapToRoomDto(Room room) {
            if ( room == null ) return null;

            return new RoomDto() {
                Id = room.Id,
                Available = room.Available,
                Capacity = room.Capacity,
                Name = room.Name,
                // Map the collection of Seats to SeatDtos
                Seats = room.Seats?.Select(s => MapToSeatDto(s)).ToList() ?? new List<SeatDto>()
            };
        }

        public Room MapToRoom(RoomCreateDto dto) {
            if ( dto == null ) return null;

            return new Room() {
                Name = dto.Name,
                Available = dto.Available,
                Capacity = dto.Capacity,
                // Screenings and Seats typically start as empty lists for a new Room
                Screenings = new List<Screening>(),
                Seats = new List<Seat>()
            };
        }

        // Helper method to handle individual Seat mapping
        public SeatDto MapToSeatDto(Seat seat) {
            if ( seat == null ) return null;

            return new SeatDto() {
                Id = seat.Id,
                isTaken = seat.isTaken,
                SeatNumber = seat.SeatNumber,
                RoomId = seat.RoomId
                // Add any other seat properties you have defined in SeatDto
            };
        }
        public async Task<int> AddTestData() {
            // 1. Check if data already exists to avoid duplicates
            if ( await _context.Rooms.AnyAsync(x => x.Name == "IMAX Theater") ) return 0;

            var rooms = new List<Room>
            {
                new Room { Name = "IMAX Theater", Capacity = 20, Available = true },
                new Room { Name = "Screen 1", Capacity = 15, Available = true },
                new Room { Name = "VIP Lounge", Capacity = 5, Available = true }
            };

            foreach ( var room in rooms ) {
                // 2. Generate seats based on room capacity
                for ( int i = 1; i <= room.Capacity; i++ ) {
                    room.Seats.Add(new Seat {
                        SeatNumber = i,
                        isTaken = false // Test seats should probably start as available
                    });
                }
            }

            // 3. Add to context and save
            await _context.Rooms.AddRangeAsync(rooms);
            return await _context.SaveChangesAsync();
        }

        public async Task<int> Create(RoomCreateDto roomDto) {
            var room = new Room() {
                Name = roomDto.Name,
                Available = roomDto.Available,
                Capacity = roomDto.Capacity
            };
            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();
            return room.Id;
        }

        public async Task<int> Delete(int Id) {
            var room = await _context.Rooms.FirstOrDefaultAsync(r => r.Id == Id);
            if(room == null ) {
                throw new Exception("No room found with this Id");
            }
            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();
            return 0;
        }

        public async Task<RoomDto> Edit(int Id, RoomDto roomDto) {
            // 1. Fetch the existing Room from the database
            // We don't necessarily need .Include(s => s.Seats) unless you plan 
            // to allow editing the entire seat list through this specific method.
            var room = await _context.Rooms.FirstOrDefaultAsync(x => x.Id == Id);

            if ( room == null )
                throw new Exception($"Room with Id {Id} not found");

            // 2. Get properties of the DTO to iterate through them
            var properties = typeof(RoomDto).GetProperties();

            foreach ( var prop in properties ) {
                // Skip the 'Id' and 'Seats' properties - we don't want to overwrite the primary key 
                // or the entire seat collection via this generic loop.
                if ( prop.Name == "Id" || prop.Name == "Seats" ) continue;

                var newValue = prop.GetValue(roomDto);

                // 3. Determine if we should skip the update for this property
                bool skipUpdate = newValue switch {
                    null => true,
                    string s when string.IsNullOrWhiteSpace(s) || s == "string" => true,
                    var val when val.Equals(GetDefault(prop.PropertyType)) => true,
                    _ => false
                };

                if ( !skipUpdate ) {
                    // 4. Find the matching property on the Entity and update it
                    var targetProperty = room.GetType().GetProperty(prop.Name);

                    if ( targetProperty != null && targetProperty.CanWrite ) {
                        targetProperty.SetValue(room, newValue);
                    }
                }
            }

            // 5. Persist changes
            await _context.SaveChangesAsync();

            // 6. Return the updated DTO (using your mapper)
            return MapToRoomDto(room);
        }

        public async Task<RoomDto> Get(int Id) {
            var room = await _context.Rooms.Include(r => r.Seats).FirstOrDefaultAsync(r => r.Id == Id);
            if ( room == null ) {
                throw new Exception("No room found with this Id");
            }
            return MapToRoomDto(room);
        }

        public async Task<List<RoomDto>> GetAll() {
            var rooms = await _context.Rooms
            .Include(r => r.Seats)
            .ToListAsync();

            // 2. Map the list of entities to a list of DTOs
            return rooms.Select(room => MapToRoomDto(room)).ToList();
        }

        public async Task<Boolean> SetAvailablility(int Id) {
            var room = await _context.Rooms.Include(r => r.Seats).FirstOrDefaultAsync(r => r.Id == Id);
            if ( room == null ) {
                throw new Exception("No room found with this Id");
            }
            room.Available = !room.Available;
            await _context.SaveChangesAsync();
            return room.Available;
        }
        public async Task<int> FillRoomWithSeats(int seatNum, int roomId) {
            var seatsToAdd = new List<Seat>();

            for (int i = 1; i <= seatNum; i++) {
                var seat = new Seat {
                    SeatNumber = i,
                    RoomId = roomId,
                    isTaken = false
                };
                seatsToAdd.Add(seat);
            }

            _context.Seats.AddRange(seatsToAdd);
            return await _context.SaveChangesAsync();
        }
    }
}
