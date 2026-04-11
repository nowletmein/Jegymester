using System;
using System.Collections.Generic;
using System.Text;
using JegymesterApp.DataContext.Context;
using JegymesterApp.DataContext.Dtos;
using JegymesterApp.DataContext.Entites;
using JegymesterApp.Services;
using JegymesterApp.Services.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace Jegymester.API.Controllers {

    [ApiController]
    [Route("api/[controller]/[action]")]

    public class MoviesController : ControllerBase {
        private readonly IMovieService _movieService;
        public MoviesController(IMovieService movieService) {
            _movieService = movieService;
        }

        // GET: api/Movies   egy listába vissza adja az összes tárolt filmet
        [HttpGet]
        public async Task<IActionResult> GetAll() {
            var movies = await _movieService.GetAll();
            return Ok(movies);
        }
        // GET: api/TodoItems/5
        // <snippet_GetByID>
        [HttpGet]
        [Route("{userId}")]
        public async Task<IActionResult> Get(int Id) {
            try {
                var movie = await _movieService.Get(Id);
                return Ok(movie);
            } catch (MovieNotFoundException ex) {
                return NotFound(ex.Message); 
            }
        }
        //TODO Movie adatok változtatása | Movie létrehozás | Movie törlés
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] MovieCreateDto movieCreateDto) {
            try {
                var result = await _movieService.Create(movieCreateDto);
                return Ok(result);
            } catch (MovieAlreadyExistsException ex) { 
                return BadRequest(ex.Message);
            }
            
        }
        [HttpPost]
        [Route("{userId}")]
        public async Task<IActionResult> Delete(int Id) {
            try {
                var result = await _movieService.Delete(Id);
                return Ok(result);
            } catch (MovieNotFoundException ex) { 
                return NotFound(ex.Message);
            }
            
        }
        [HttpPost]
        [Route("{userId}")]
        public async Task<IActionResult> Edit([FromBody] MovieCreateDto movieCreateDto, int Id) {
            try {
                var result = await _movieService.Edit(movieCreateDto, Id);
                return Ok(result);
            } catch ( MovieNotFoundException ex ) {
                return NotFound(ex.Message);
            }
        }
    }
}