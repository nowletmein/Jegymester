using JegymesterApp.DataContext.Context;
using JegymesterApp.DataContext.Dtos;
using JegymesterApp.DataContext.Entites;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using JegymesterApp.Services.Exceptions;

namespace JegymesterApp.Services
{
    public interface IMovieService
    {
        Task<List<MovieDto>> GetAll();
        Task<MovieDto> Get(int Id);
    }
    public class MovieService : IMovieService
    {
        private readonly JegymesterDbContext _context;

        public MovieService(JegymesterDbContext context)
        {
            _context = context;
        }

        public async Task<MovieDto> Get(int Id)
        {
            var movie = await _context.Movies.Include(m => m.Screenings).Where(x => x.Id == Id)
            .Select(movie => new MovieDto
            {
                Id = movie.Id,
                Title = movie.Title,
                Description = movie.Description,
                Director = movie.Director,
                Rateing = movie.Rateing,
                PG = movie.PG,
                Length = movie.Length,
                PicturePath = movie.PicturePath,
            
                ScreeningDtos = movie.Screenings.Select(s => new ScreeningDto
                {
                    Id = s.Id,
                    ScreeningDate = s.ScreeningDate,
                    RoomId = s.Room.Id
                }).ToList()
            }).FirstOrDefaultAsync();
            
            if (movie == null){
                throw new MovieNotFoundException("Movie Not Found");
            }

            return movie;
        }

        public async Task<List<MovieDto>> GetAll()
        {
         return await _context.Movies
         .Include(m => m.Screenings).ThenInclude(s => s.Room) 
         .Select(movie => new MovieDto
         {
             Id = movie.Id,
             Title = movie.Title,
             Description = movie.Description,
             Director = movie.Director,
             Rateing = movie.Rateing,
             PG = movie.PG,
             Length = movie.Length,
             PicturePath = movie.PicturePath,
             ScreeningDtos = movie.Screenings.Select(s => new ScreeningDto
             {
                 Id = s.Id,
                 ScreeningDate = s.ScreeningDate,
                 RoomId = s.Room.Id 
             }).ToList()
         })
        .ToListAsync();

        }
    }
}
