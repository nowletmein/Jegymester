using JegymesterApp.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;

namespace Jegymester.API.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class UsersController: ControllerBase
    {
        private readonly IUserService _userService;
        public UsersController() { }
    }
}
