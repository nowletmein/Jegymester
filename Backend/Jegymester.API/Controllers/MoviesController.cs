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
        [Route("{movieId}")]
        public async Task<IActionResult> Get(int movieId) {
            var movie = await _movieService.Get(movieId);
            return Ok(movie);
         
        }
        //TODO Movie adatok változtatása | Movie létrehozás | Movie törlés
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] MovieCreateDto movieCreateDto) {
             var result = await _movieService.Create(movieCreateDto);
             return Ok(result);
        }

        [HttpDelete]
        [Route("{movieId}")]
        public async Task<IActionResult> Delete(int movieId) {
            var result = await _movieService.Delete(movieId);
            return Ok(result);
        }

        [HttpPut]
        [Route("{movieId}")]
        public async Task<IActionResult> Edit([FromBody] MovieCreateDto movieCreateDto, int movieId) {
            var result = await _movieService.Edit(movieCreateDto, movieId);
            return Ok(result);
        }
        [HttpPost]
        public async Task<IActionResult> AddTestData() {
            var result = await _movieService.AddTestData();
            return Ok(result);
        }
    }
}