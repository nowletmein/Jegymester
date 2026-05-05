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
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Globalization;

namespace JegymesterApp.Services
{
    public interface IUserService
    {
        Task<string> Register(UserCreateDto userCreateDto);
        Task<UserDto> Get(int userId);
        Task<int> Delete(int userId);
        Task<int> Edit(int userId, UserEditDto userCreateDto);
        Task<string> Login(string email, string password);
        Task<List<RoleDto>> GetRoles();
        Task<int> CreateRole(RoleCreateDto roleCreateDto);
        Task<int> AddRoleToUser(int roleId, int userId);
        Task<int> AddToCart(int userId, int screeningId);
        Task<int> RemoveFromCart(int userId, int screeningId);
        Task<List<TicketDto>> GetTickets(int userId);
        Task<List<ScreeningDto>> GetShopingCart(int userId);

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
                    Price = t.Screening?.Price ?? 0,
                    // Add other Ticket properties here
                }).ToList() ?? new List<TicketDto>()
            };
        }
        public async Task<string> GenerateToken(User user) {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("MySuperSecretKeyThatIsAtLeast32CharactersLong!!ADDSFHsfgsdgksgkaowaefagnamfaklfaijg"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddDays(Convert.ToDouble(5));
            var id = await GetClaimnsIdentity(user);
            var token = new JwtSecurityToken("http://localhost:5000", "http://localhost:3000", id.Claims, expires:expires, signingCredentials:creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        public async Task<ClaimsIdentity> GetClaimnsIdentity(User user) {
            var claims = new List<Claim> {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.MobilePhone, user.Phone),
                new Claim(ClaimTypes.Sid, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.AuthTime, DateTime.Now.ToString(CultureInfo.InvariantCulture))
            };
            if ( user.Roles != null && user.Roles.Any() ) {
                claims.AddRange(user.Roles.Select(x => new Claim("roleIds", Convert.ToString(x.Id))));
                claims.AddRange(user.Roles.Select(x => new Claim(ClaimTypes.Role, x.Name)));
            }
            return new ClaimsIdentity(claims, "Token");      
        }
        public async Task<string> Register(UserCreateDto userCreateDto)
        {
            if(await _context.Users.AnyAsync(x => x.Email == userCreateDto.Email)) {
                throw new UserAlreadyExistsException("User with this email adress already existis");
            }

            var user = MapToUser(userCreateDto);
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            if (!user.Roles.Any()) {
                user.Roles.Add(await DefaultCustomerRoleAsync());
            }
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return await Login(user.Email, user.Password);
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

        public async Task<string> Login(string email, string password)
        {
            var user = await _context.Users.Include(x => x.Roles).FirstOrDefaultAsync(x => x.Email == email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.Password)) {
                throw new UserNotFoundException("Bad email or password");
            }
            //return MapToUserDto(user);
            return await GenerateToken(user);
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
            var rolesDto = new List<RoleDto>();
            var roleDto = new RoleDto();
            foreach (var role in roles) {
                 roleDto = MapToRoleDto(role);
                rolesDto.Add(roleDto);
            }
            return rolesDto;
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
            await _context.SaveChangesAsync();
            return 0;
        }
        public async Task<int> AddToCart(int userId, int screeningId) {
            var screening = await _context.Screenings.FirstOrDefaultAsync(x =>x.Id == screeningId);
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == userId);
            if (user == null || screening == null) {
                throw new ScreeningNotFoundException("Screening or User not found");
            }
            user.ShopingCart.Add(screening);
            await _context.SaveChangesAsync();
            return screening.Id;
        }
        public async Task<int> RemoveFromCart(int userId, int screeningId) {
            var user = await _context.Users.Include(x => x.ShopingCart).FirstOrDefaultAsync(x => x.Id == userId);
            if (user == null) {
                throw new UserNotFoundException("User dooes not exists With this id:"+userId);
            }
            var screening = user.ShopingCart.FirstOrDefault(x => x.Id == screeningId);
            if (screening == null || user == null) {
                throw new ScreeningNotFoundException("Screening with this Id doesent exist in this users cart Id:" + screeningId);
            }
            user.ShopingCart.Remove(screening);
            await _context.SaveChangesAsync();
            return screening.Id;

        }
        public async Task<List<ScreeningDto>> GetShopingCart(int userId) {
            var user = await _context.Users.Include(x => x.ShopingCart).FirstOrDefaultAsync(x => x.Id ==userId);

            if ( user == null ) {
                throw new UserNotFoundException("User Not Found");
            }
            var userDto = MapToUserDto(user);
            return userDto.ShopingCart.ToList();
        }
        public async Task<List<TicketDto>> GetTickets(int userId) {
            var user = await _context.Users.Include(x => x.Tickets).FirstOrDefaultAsync(x => x.Id == userId);

            if ( user == null ) {
                throw new UserNotFoundException("User Not Found");
            }
            var userDto = MapToUserDto(user);
            return userDto.Tickets.ToList();
        }
    }
}
