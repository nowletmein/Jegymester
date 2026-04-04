using System;
using System.Collections.Generic;
using System.Text;
using JegymesterApp.DataContext.Context;
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

            return Ok(_movieService.GetAll());
        }
        // GET: api/TodoItems/5
        // <snippet_GetByID>
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int Id)
        {
            return Ok(_movieService.Get(Id));
        }
        //TODO Movie adatok változtatása | Movie létrehozás | Movie törlés



    }
}
