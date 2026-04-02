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
    public class TicketsController: ControllerBase
    {
        private readonly ITicketService _ticketService;
        public TicketsController(ITicketService ticketService) {
            _ticketService = ticketService;
        }

        [HttpPost]
        [Route("{userId}")]
        public async Task<IActionResult> Create(int? userId, [FromBody] TicketCreateDto ticketCreateDto)
        {
            var result = await _ticketService.Create(ticketCreateDto,userId);
            return Ok(result);
        }

        [HttpPost]
        [Route("{ticketId}")]
        public async Task<IActionResult> VerifyTicket(int ticketId)
        {
            var result = await _ticketService.VerifyTicket(ticketId);
            return Ok(result);
        }
        [HttpGet]
        [Route("{ticketId}")]
        public async Task<IActionResult> Get(int ticketId) {
            var result = await _ticketService.Get(ticketId);
            return Ok(result);
        }
    }
}
