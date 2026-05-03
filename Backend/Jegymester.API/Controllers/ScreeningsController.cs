using JegymesterApp.DataContext.Dtos;
using JegymesterApp.Services;
using JegymesterApp.Services.Exceptions;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;

namespace Jegymester.API.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class ScreeningsController:ControllerBase
    {
        private readonly IScreeningService _screeningService;
        public ScreeningsController(IScreeningService screeningService)
        {
            _screeningService = screeningService;
        }

        [HttpGet]
         public async Task<IActionResult> GetWeekly()
         {
             return Ok(await _screeningService.GetWeekly()); 
         }
        
        [HttpGet]
        [Route("{Id}")]
        public async Task<IActionResult> Get(int Id) 
        {
             var result = await _screeningService.Get(Id);
             return Ok(result);  
        }

        [HttpDelete]
        [Route("{Id}")]
        public async Task<IActionResult> Delete(int Id)
        {   
             var result = await _screeningService.Delete(Id);
             return Ok(result);
        }

        [HttpPut]
        [Route("{Id}")]
        public async Task<IActionResult> Edit(int Id, [FromBody] ScreeningCreateDto screeningCreateDto)
        {
            var result = await _screeningService.Edit(Id, screeningCreateDto);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ScreeningCreateDto screeningCreateDto)
        {
            var result = await _screeningService.Create(screeningCreateDto);
            return Ok(result);
            
        }
        [HttpPost]
        public async Task<IActionResult> AddTestData() {
            var result = await _screeningService.AddTestData();
            return Ok(result);
        }
        //TODO SCREENING CHECK ENDPOINT IF ROOM IS AVAILABLE
        //TODO SCREENING GET ALL SEAT
        [HttpGet]
        public async Task<IActionResult> GetRoomUnavailableScreenings() {
            var result = await _screeningService.GetRoomUnavailableScreenings();
            return Ok(result);
        }

        [HttpGet]
        [Route("{Id}")]
        public async Task<IActionResult> GetSeats(int Id) {  
            var result = await _screeningService.GetSeats(Id);
            return Ok(result);
        }
    }
}