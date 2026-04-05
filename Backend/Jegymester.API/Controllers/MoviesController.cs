using System;
using System.Collections.Generic;
using System.Text;
using JegymesterApp.DataContext.Context;
using JegymesterApp.DataContext.Dtos;
using JegymesterApp.DataContext.Entites;
using JegymesterApp.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace Jegymester.API.Controllers
{

    [ApiController]
    [Route("api/[controller]/[action]")]

    public class MoviesController : ControllerBase
    {
        private readonly IMovieService _movieService;
        public MoviesController(IMovieService movieService)
        {
            _movieService = movieService;
        }

        // GET: api/Movies   egy listába vissza adja az összes tárolt filmet
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var movies = await _movieService.GetAll();
            return Ok(movies);
        }
        // GET: api/TodoItems/5
        // <snippet_GetByID>
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int Id)
        {
            var movie = await _movieService.Get(Id);
            return Ok(movie);
        }
        //TODO Movie adatok változtatása | Movie létrehozás | Movie törlés
        [HttpPost]
        public async Task<IActionResult> Create(MovieCreateDto movieCreateDto)
        {
            throw new NotImplementedException();
        }
        [HttpPost]
        public async Task<IActionResult> Delete(int Id) 
        {
            throw new NotImplementedException();
        }
        [HttpPost]
        public async Task<IActionResult> Edit(MovieCreateDto movieCreateDto, int Id)
        {
            throw new NotImplementedException();
        }
    }
}
