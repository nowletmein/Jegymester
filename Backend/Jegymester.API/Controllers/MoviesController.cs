using System;
using System.Collections.Generic;
using System.Text;
using JegymesterApp.DataContext.Context;
using JegymesterApp.DataContext.Entites;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace Jegymester.API.Controllers
{

    [ApiController]
    [Route("api/[controller]/[action]")]

    public class MoviesController : ControllerBase
    {
        private readonly JegymesterDbContext _context;
        public MoviesController(JegymesterDbContext context)
        {
            _context = context;
        }

        // GET: api/Movies   egy listába vissza adja az összes tárolt filmet
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Movie>>> GetMovies()
        {
            return await _context.Movies.ToListAsync();
        }
        // GET: api/TodoItems/5
        // <snippet_GetByID>
        [HttpGet("{id}")]
        public async Task<ActionResult<Movie>> GetMovie(long id)
        {
            var MovieItem = await _context.Movies.FindAsync(id);

            if (MovieItem == null)
            {
                return NotFound();
            }
            
            return MovieItem;
        }
        //TODO Movie adatok változtatása | Movie létrehozás | Movie törlés



    }
}
