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
    public class TicketsController: ControllerBase
    {
        private readonly ITicketService _ticketService;
        public TicketsController(ITicketService ticketService) {
            _ticketService = ticketService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TicketCreateDto ticketCreateDto)
        {
            var result = await _ticketService.Create(ticketCreateDto);
            return Ok(result);
        }

        [HttpPost]
        [Route("{ticketId}")]
        public async Task<IActionResult> VerifyTicket(int ticketId)
        {
            try
            {
                var result = await _ticketService.Verify(ticketId);
                return Ok(result);
            } 
            catch (TicketNotFoundException Tex)
            {
                return NotFound(Tex.Message);
            }

        }
        [HttpGet]
        [Route("{ticketId}")]
        public async Task<IActionResult> Get(int ticketId) {
            try
            {
                var result = await _ticketService.Get(ticketId);
                return Ok(result);
            }
            catch (TicketNotFoundException Tex)
            {
                return NotFound(Tex.Message);
            }
           
        }
        [HttpPost]
        public async Task<IActionResult> Delete(int ticketId)
        {
            try
            {
                var result = await _ticketService.Delete(ticketId);
                return Ok(result);
            }
            catch (TicketNotFoundException Tex) {
                return NotFound(Tex.Message);
            }
            
        }
    }
}
