using JegymesterApp.DataContext.Context;
using JegymesterApp.DataContext.Dtos;
using JegymesterApp.DataContext.Entites;
using JegymesterApp.Services.Exceptions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace JegymesterApp.Services
{
    public interface IUserService
    {
        Task<int> Create(UserCreateDto userCreateDto);
        Task<UserDto> Get(int userId);
        Task<int> Delete(int userId);
        Task<int> Edit(int userId, UserDto userCreateDto);
        Task<int> Login(string email, string password);
    }
    public class UserService : IUserService
    {
        private readonly JegymesterDbContext _context;
        public UserService(JegymesterDbContext context) {
            _context = context;
        }

        private User MapToUser(UserCreateDto dto) {
            return new User {
                Name = dto.Name,
                Email = dto.Email,
                Phone = dto.Phone,
                Password = dto.Password 
            };
        }

        
        private UserDto MapToUserDto(User user) {
            return new UserDto {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Phone = user.Phone,

                // Map the collections
                ShopingCart = user.ShopingCart?.Select(s => new ScreeningDto {
                    Id = s.Id,
                    ScreeningDate = s.ScreeningDate,
                    RoomId = s.RoomId,
                    MovieId = s.MovieId
                    
                }).ToList() ?? new List<ScreeningDto>(),

                Tickets = user.Tickets?.Select(t => new TicketDto {
                    Id = t.Id,
                    Email = t.Email,
                    Phone = t.Phone,
                    IsCancelled = t.IsCancelled,
                    IsVerified  = t.IsVerified,
                    PurchaseDate = t.PurchaseDate,
                    ScreeningId = t.ScreeningId,
                    UserId = t.UserId,
                    // Add other Ticket properties here
                }).ToList() ?? new List<TicketDto>()
            };
        }
        public async Task<int> Create(UserCreateDto userCreateDto)
        {
            if(await _context.Users.AnyAsync(x => x.Email == userCreateDto.Email)) {
                throw new UserAlreadyExistsException("User with this email adress already existis");
            }
            var user = MapToUser(userCreateDto);
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user.Id;
        }

        public async Task<int> Delete(int userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == userId);
            if (user == null) {
                throw new UserNotFoundException("User was not found id:"+ userId);
            }
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return 0;
        }

        public async Task<int> Edit(int userId, UserDto userCreateDto)
        {
            throw new NotImplementedException();
        }

        public async Task<UserDto> Get(int userId)
        {
            var user = await _context.Users.Include(x => x.Tickets).Include(x => x.ShopingCart).FirstOrDefaultAsync(x =>x.Id == userId);
            if (user == null) {
                throw new UserNotFoundException("User not found with Id:" + userId);
            }
            return MapToUserDto(user);
            
        }

        public async Task<int> Login(string email, string password)
        {
            if (await _context.Users.AnyAsync(x => x.Email == email && x.Password == password)) {
            
            }
            throw new NotImplementedException();
        }
    }
}
