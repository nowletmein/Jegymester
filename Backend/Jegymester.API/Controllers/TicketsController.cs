using JegymesterApp.DataContext.Dtos;
using JegymesterApp.Services;
using JegymesterApp.Services.Exceptions;
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
    public class TicketsController: ControllerBase
    {
        private readonly ITicketService _ticketService;
        public TicketsController(ITicketService ticketService) {
            _ticketService = ticketService;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Create([FromBody] TicketCreateDto ticketCreateDto) {
            var result = await _ticketService.Create(ticketCreateDto);
            //TODO check if seat awailable and if we have space
            return Ok(result);
        }

        [HttpPatch]
        [Route("{ticketId}")]
        [Authorize(Roles = "Admin,Cashier")]
        public async Task<IActionResult> VerifyTicket(int ticketId) {
            var result = await _ticketService.Verify(ticketId);
            return Ok(result);
        }

        [HttpGet]
        [Route("{ticketId}")]
        [Authorize(Roles = "Admin,Cashier")]
        public async Task<IActionResult> Get(int ticketId) {
            var result = await _ticketService.Get(ticketId);
            return Ok(result);
        }
        [HttpDelete]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int ticketId) {
            var result = await _ticketService.Delete(ticketId);
            return Ok(result);
        }
        [HttpPatch]
        [Route("{ticketId}")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> CancelSelfTicket(int ticketId) {
            var userId = int.Parse(User.Claims.First(x => x.Type == "NameIdentifier").Value);
            var result = await _ticketService.Cancel(ticketId, userId);
            return Ok(result);
        }
        
        [HttpPost]
        [Route("{screeningId}/{uEmail}/{uPhone}/{seatNumber}")]
        [Authorize(Roles ="Cashier")]
        public async Task<IActionResult> CashierCreate(int screeningId, string uEmail, string uPhone, int seatNumber) {
            var result = await _ticketService.CashierCreate(screeningId, uEmail, uPhone, seatNumber);
            return Ok(result);
        }
        [HttpPatch]
        [Route("{ticketId}")]
        [Authorize(Roles = "Admin,Cashier")]
        public async Task<IActionResult> Cancel(int ticketId) {
            
            var result = await _ticketService.Cancel(ticketId, null);
            return Ok(result);
        }
    }
}
