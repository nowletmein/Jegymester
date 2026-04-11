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
             return Ok(_screeningService.GetWeekly()); 
         }
        
        [HttpGet]
        [Route("{Id}")]
        public async Task<IActionResult> Get(int Id) 
        {
            try
            {
                var result = Ok(_screeningService.Get(Id));
                return Ok(result);
            }
            catch (ScreeningNotFoundException Scex) 
            { 
                return NotFound(Scex.Message);
            }
        }

        [HttpPost]
        [Route("{Id}")]
        public async Task<IActionResult> Delete(int Id)
        {
            try {
                var result = _screeningService.Delete(Id);
                return Ok(result);
            } catch ( ScreeningNotFoundException Scex ) {
                return NotFound(Scex.Message);
            }
            
        }

        [HttpPost]
        [Route("{Id}")]
        public async Task<IActionResult> Edit(int Id, [FromBody] ScreeningCreateDto screeningCreateDto)
        {
            try {
                var result = await _screeningService.Edit(Id, screeningCreateDto);
                return Ok(result);
            } catch ( ScreeningNotFoundException Scex ) {
                return NotFound(Scex);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ScreeningCreateDto screeningCreateDto)
        {
            try {
                var result = _screeningService.Create(screeningCreateDto);
                return Ok(result);
            } catch(ScreeningAlreadyExists ex ) {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost]
        public async Task<IActionResult> AddTestData() {
            var result = _screeningService.AddTestData();
            return Ok(result);
        }
    }
}