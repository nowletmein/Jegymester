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
    public class ScreeningsController:Controller
    {
        private readonly IScreeningService _screeningService;
        public ScreeningsController(IScreeningService screeningService)
        {
            _screeningService = screeningService;
        }

        [HttpGet]
         public async Task<IActionResult> GetWeekly()
         {
             //return Ok(_screeningService.GetWeekly());
             throw new NotImplementedException();
         }
        [HttpGet]
        [Route("{Id}")]
        public async Task<IActionResult> Get(int Id) 
        {  
            return Ok(_screeningService.Get(Id)); 
        }
        public async Task<IActionResult> Delete(int Id)
        {
            throw new NotImplementedException();
        }
        public async Task<IActionResult> Edit(int Id)
        {
            throw new NotImplementedException();
        }
        public async Task<IActionResult> Create(ScreeningCreateDto screeningCreateDto)
        {
            throw new NotImplementedException();
        }
    }
}
