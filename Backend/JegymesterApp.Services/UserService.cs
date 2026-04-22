using JegymesterApp.DataContext.Context;
using JegymesterApp.DataContext.Dtos;
using JegymesterApp.DataContext.Entites;
using JegymesterApp.Services.Exceptions;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Crypto.Generators;
using System;
using System.Collections.Generic;
using System.Text;
using BCrypt.Net;

namespace JegymesterApp.Services
{
    public interface IUserService
    {
        Task<UserDto> Register(UserCreateDto userCreateDto);
        Task<UserDto> Get(int userId);
        Task<int> Delete(int userId);
        Task<int> Edit(int userId, UserEditDto userCreateDto);
        Task<UserDto> Login(string email, string password);
        Task<List<RoleDto>> GetRoles();
        Task<int> CreateRole(RoleCreateDto roleCreateDto);
        Task<int> AddRoleToUser(int roleId, int userId);
    }
    public class UserService : IUserService
    {
        private readonly JegymesterDbContext _context;
        public UserService(JegymesterDbContext context) {
            _context = context;
        }
        public object? GetDefault(Type type) {
            if (type.IsValueType) {
                return Activator.CreateInstance(type);
            }
            return null;
        }
        private User MapToUser(UserCreateDto dto) {
            return new User {
                Name = dto.Name,
                Email = dto.Email,
                Phone = dto.Phone,
                Password = dto.Password 
            };
        }

        private RoleDto MapToRoleDto(Role role) {
            return new RoleDto { Id= role.Id , Name=role.Name };
        }

        private Role MapToRole(RoleCreateDto role) {
            return new Role {Name = role.Name};
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
                    Price = s.Price,
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
                    Price= t.Screening.Price,
                    // Add other Ticket properties here
                }).ToList() ?? new List<TicketDto>()
            };
        }
        public async Task<UserDto> Register(UserCreateDto userCreateDto)
        {
            if(await _context.Users.AnyAsync(x => x.Email == userCreateDto.Email)) {
                throw new UserAlreadyExistsException("User with this email adress already existis");
            }

            var user = MapToUser(userCreateDto);
            if (!user.Roles.Any()) {
                user.Roles.Add(await DefaultCustomerRoleAsync());
            }
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return MapToUserDto(user);
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

        public async Task<int> Edit(int userId, UserEditDto userEditDto) {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == userId);

            if (user == null) {
                throw new UserNotFoundException("User not found with Id: " + userId);
            }

            
            var properties = typeof(UserEditDto).GetProperties();

            foreach (var prop in properties) {
                var newValue = prop.GetValue(userEditDto);

                
                bool skipUpdate = newValue switch {
                    null => true,
                    string s when string.IsNullOrWhiteSpace(s) || s == "string" => true,
                    var val when val.Equals(GetDefault(prop.PropertyType)) => true,
                    _ => false
                };

                if (!skipUpdate) {
                    var targetProperty = user.GetType().GetProperty(prop.Name);

                    if (targetProperty != null && targetProperty.CanWrite) {
                        targetProperty.SetValue(user, newValue);
                    }
                }
            }

            await _context.SaveChangesAsync();
            return user.Id;
        }

        public async Task<UserDto> Get(int userId)
        {
            var user = await _context.Users.Include(x => x.Tickets).Include(x => x.ShopingCart).FirstOrDefaultAsync(x =>x.Id == userId);
            if (user == null) {
                throw new UserNotFoundException("User not found with Id:" + userId);
            }
            return MapToUserDto(user);
            
        }

        public async Task<UserDto> Login(string email, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.Password)) {
                throw new UserNotFoundException("Bad email or password");
            }
            return MapToUserDto(user);
        }
        private async Task<Role> DefaultCustomerRoleAsync() {
            var UserRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "User");
            if (UserRole == null) {
                UserRole = new Role { Name = "User" };
                await _context.Roles.AddAsync(UserRole);
                await _context.SaveChangesAsync();
            }
            return UserRole;
        }
        public async Task<List<RoleDto>> GetRoles() {
            var roles = await _context.Roles.ToListAsync();
            var roleDto = new List<RoleDto>();
            foreach (var role in roles) {
                roleDto.Add(MapToRoleDto(role));
            }
            return roleDto;
        }

        public async Task<int> CreateRole(RoleCreateDto roleCreateDto) {
            var role = MapToRole(roleCreateDto);
            await _context.Roles.AddAsync(role);
            await _context.SaveChangesAsync();
            return role.Id;
        }
        public async Task<int> AddRoleToUser(int roleId, int userId) {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == userId);
            var role = await _context.Roles.FirstOrDefaultAsync(x => x.Id == roleId);
            if (user == null || role == null) {
                throw new UserNotFoundException("User Or Role does not exists with this Id:" + userId);
            }

            user.Roles.Add(role);
            return 0;
        }
    }
}
