using JegymesterApp.DataContext.Dtos;
using JegymesterApp.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;

namespace Jegymester.API.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
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
        public async Task<IActionResult> Register([FromBody] UserCreateDto userCreateDto) {
            var result = await _userService.Register(userCreateDto);
            return Ok(result);
        }
        [HttpGet]
        [Route("{Id}")]
        public async Task<IActionResult> Get(int Id) {
            var result = await _userService.Get(Id);
            return Ok(result);
        }
        [HttpDelete]
        [Route("{Id}")]
        public async Task<IActionResult> Delete(int Id) {
            var result = await _userService.Delete(Id);
            return Ok(result);
        }
        [HttpPatch]
        [Route("{Id}")]
        public async Task<IActionResult> Edit(int Id, [FromBody] UserEditDto userEditDto) {
            var result = await _userService.Edit(Id, userEditDto);
            return Ok(result);
        }
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] UserCreateDto userCreateDto) {
            var result = await _userService.Login(userCreateDto.Email, userCreateDto.Password);
            return Ok(result);
        }
        [HttpGet]
        public async Task<IActionResult> GetRoles() {
            var result = _userService.GetRoles();
            return Ok(result);
        }
        [HttpPut]
        public async Task<IActionResult> CreateRole([FromBody] RoleCreateDto roleCreateDto) {
            var result = _userService.CreateRole(roleCreateDto);
            return Ok(result);
        }
        [HttpPut]
        [Route("{userId}/{roleId}")]
        public async Task<IActionResult> AddRoleToUser(int userId, int roleId) {
            var result = await _userService.AddRoleToUser(roleId, userId);
            return Ok(result);
        }
        [HttpPost]
        [Route("{userId}/{screeningId}")]
        public async Task<IActionResult> AddToCart(int userId, int screeningId) {
            var result = await _userService.AddToCart(userId, screeningId);
            return Ok(result);
        }
        [HttpDelete]
        [Route("{userId}/{screeningId}")]
        public async Task<IActionResult> RemoveFromCart(int userId, int screeningId){
            var result = await _userService.RemoveFromCart(userId, screeningId);
            return Ok(result);
        }
    }
}
