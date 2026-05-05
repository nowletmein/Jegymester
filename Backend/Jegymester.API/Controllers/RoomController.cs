using JegymesterApp.DataContext.Dtos;
using JegymesterApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;

namespace Jegymester.API.Controllers {
    [ApiController]
    [Route("api/[controller]/[action]")]
    [Authorize(Roles = "Admin")]
    public class RoomController : ControllerBase  {
        private readonly IRoomService _roomService;

        public RoomController(IRoomService roomService) {
            _roomService = roomService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() {
            var result = await _roomService.GetAll();
            return Ok(result);
        }
        [HttpGet]
        public async Task<IActionResult> Get(int Id) {
            var result = await _roomService.Get(Id);
            return Ok(result);
        }
        [HttpPost]
        public async Task<IActionResult> Create(RoomCreateDto roomDto) {
            var result = await _roomService.Create(roomDto);
            return Ok(result);
        }
        [HttpDelete]
        public async Task<IActionResult> Delete(int Id) {
            var result = await _roomService.Delete(Id);
            return Ok(result);
        }
        [HttpPost]
        public async Task<IActionResult> Edit(int Id, RoomDto roomDto) {
            var result = await _roomService.Edit(Id, roomDto);
            return Ok(result);
        }
        [HttpPost]
        public async Task<IActionResult> SetAvailablility(int Id) {
            var result = await _roomService.SetAvailablility(Id);
            return Ok(result);
        }
        [HttpPost]
        public async Task<IActionResult> AddTestData() {
            var result = await _roomService.AddTestData();
            return Ok(result);
        }
    }
}
