using JegymesterApp.DataContext.Dtos;
using JegymesterApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;

namespace Jegymester.API.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    [Authorize]
    public class UsersController : ControllerBase {
        private readonly IUserService _userService;
        public UsersController(IUserService userService) {
            _userService = userService;
        }

        /*
           Task<UserDto> Register(UserCreateDto userCreateDto);
        Task<UserDto> Get(int userId);
        Task<int> Delete(int userId);
        Task<int> Edit(int userId, UserEditDto userCreateDto);
        Task<UserDto> Login(string email, string password);
        Task<List<RoleDto>> GetRolesAsync();
        Task<int> CreateRole(RoleCreateDto roleCreateDto);
        */
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] UserCreateDto userCreateDto) {
            var result = await _userService.Register(userCreateDto);
            return Ok(result);
        }
        [HttpGet]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> Get() {
            var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (claim == null) {
                return Unauthorized("User ID not found in token.");
            }
            var Id = int.Parse(claim.Value);
            var result = await _userService.Get(Id);
            return Ok(result);
        }
        [HttpDelete]
        [Route("{Id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int Id) {
            var result = await _userService.Delete(Id);
            return Ok(result);
        }
        [HttpPatch]
        //[Route("{Id}")]
        [Authorize]
        public async Task<IActionResult> Edit([FromBody] UserEditDto userEditDto) {
            var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (claim == null) {
                return Unauthorized("User ID not found in token.");
            }
            var Id = int.Parse(claim.Value);
            var result = await _userService.Edit(Id, userEditDto);
            return Ok(result);
        }
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] UserCreateDto userCreateDto) {
            var result = await _userService.Login(userCreateDto.Email, userCreateDto.Password);
            return Ok(result);
        }
        [HttpGet]
        [Authorize(Roles = "Admin,User")]
        
        public async Task<IActionResult> GetRoles() {
            var result = await _userService.GetRoles();
            return Ok(result);
        }
        [HttpPut]
        [Authorize(Roles = "Admin")]
       
        public async Task<IActionResult> CreateRole([FromBody] RoleCreateDto roleCreateDto) {
            var result = await _userService.CreateRole(roleCreateDto);
            return Ok(result);
        }
        [HttpPut]
        [Route("{userId}/{roleId}")]
        [Authorize(Roles = "Admin")]
        
        public async Task<IActionResult> AddRoleToUser(int userId, int roleId) {
            var result = await _userService.AddRoleToUser(roleId, userId);
            return Ok(result);
        }
        [HttpPost]
        [Route("{screeningId}")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> AddToCart(int screeningId) {
            var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (claim == null) {
                return Unauthorized("User ID not found in token.");
            }
            var userId = int.Parse(claim.Value);
            var result = await _userService.AddToCart(userId, screeningId);
            return Ok(result);
        }
        [HttpDelete]
        [Route("{screeningId}")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> RemoveFromCart(int screeningId){
            var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (claim == null) {
                return Unauthorized("User ID not found in token.");
            }
            var userId = int.Parse(claim.Value);
            var result = await _userService.RemoveFromCart(userId, screeningId);
            return Ok(result);
        }
        [HttpGet]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> GetShopingCart() {
            var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (claim == null) {
                return Unauthorized("User ID not found in token.");
            }
            var userId = int.Parse(claim.Value);
            var result = await _userService.GetShopingCart(userId);
            return Ok(result);
        }
        [HttpGet]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> GetTickets() {
            var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (claim == null) {
                return Unauthorized("User ID not found in token.");
            }
            var userId = int.Parse(claim.Value);
            var result = await _userService.GetTickets(userId);
            return Ok(result);
        }
    }
}
