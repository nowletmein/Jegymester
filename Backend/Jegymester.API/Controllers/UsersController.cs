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
        public async Task<IActionResult> Edit(int Id, UserEditDto userEditDto) {
            var result = await _userService.Edit(Id, userEditDto);
            return Ok(result);
        }


    }
}
