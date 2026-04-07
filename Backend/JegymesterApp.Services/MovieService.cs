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
        Task<int> Create(MovieCreateDto movieCreateDto);
        Task<int> Delete(int Id);

        Task<MovieDto> Edit(MovieCreateDto movieCreateDto, int Id);
    }
    public class MovieService : IMovieService
    {
        private readonly JegymesterDbContext _context;
        private object? GetDefault(Type type) => type.IsValueType ? Activator.CreateInstance(type) : null;
        public MovieService(JegymesterDbContext context){
            _context = context;
        }
        public Movie MapToMovie(MovieDto movieDto){

              var movie = new Movie() {
                  Title = movieDto.Title,
                  Description = movieDto.Description,
                  Director = movieDto.Director,
                  Length = movieDto.Length,
                  PG = movieDto.PG,
                  PicturePath = movieDto.PicturePath,
                  Rating = movieDto.Rating
              };
              return movie;
        }
        public Movie MapToMovie(MovieCreateDto movieCreateDto) {
              var movie = new Movie() {
                  Title = movieCreateDto.Title,
                  Description = movieCreateDto.Description,
                  Director = movieCreateDto.Director,
                  Length = movieCreateDto.Length,
                  PG = movieCreateDto.PG,
                  PicturePath = movieCreateDto.PicturePath,
                  Rating = movieCreateDto.Rating
              };
              return movie;
        }
        public MovieDto MapToDto(Movie movie){

              var movieDto = new MovieDto() {
                  Id = movie.Id,
                  Title = movie.Title,
                  Description = movie.Description,
                  Director = movie.Director,
                  Rating = movie.Rating,
                  PG = movie.PG,
                  Length = movie.Length,
                  PicturePath = movie.PicturePath,

                  ScreeningDtos = movie.Screenings.Select(s => new ScreeningDto {
                      Id = s.Id,
                      ScreeningDate = s.ScreeningDate,
                      RoomId = s.Room.Id
                  }).ToList()
              };
              return movieDto;
        }
        public async Task<int> Create(MovieCreateDto movieCreateDto){
                /*  public int Id { get; set; }
                    public string Title { get; set; }
                    public string? PicturePath { get; set; }
                    public string? Description { get; set; }
                    public string Director { get; set; }
                    public string? Rateing { get; set; }
                    public string PG { get; set; }
                    public int Length { get; set; }
                    public ICollection<ScreeningDto> ScreeningDtos { get; set; } = new List<ScreeningDto>();*/
              if(await _context.Movies.AnyAsync(x => x.Title == movieCreateDto.Title && x.Director == movieCreateDto.Director)){
                  throw new MovieAlreadyExistsException("Movie With this name and director already exists");
              }

              var movie = MapToMovie(movieCreateDto);
              await _context.Movies.AddAsync(movie);
              await _context.SaveChangesAsync();
              return movie.Id;
        }

        public async Task<int> Delete(int Id){

              var movie = _context.Movies.FirstOrDefault(x => x.Id == Id);
              if(movie == null){
                  throw new MovieNotFoundException("Movie With This Id Doesent Exists");
              }
              _context.Movies.Remove(movie);
              await _context.SaveChangesAsync();
              return 0;
            
        }

        

        public async Task<MovieDto> Get(int Id){

             var movie = await _context.Movies.Include(m => m.Screenings).Where(x => x.Id == Id)
             .Select(movie => MapToDto(movie)).FirstOrDefaultAsync();
            
             if (movie == null){
                 throw new MovieNotFoundException("Movie Not Found");
             }

             return movie;
        }

        public async Task<List<MovieDto>> GetAll(){

             return await _context.Movies
             .Include(m => m.Screenings).ThenInclude(s => s.Room) 
             .Select(movie => MapToDto(movie))
             .ToListAsync();

        }

        public async Task<MovieDto> Edit(MovieCreateDto movieCreateDto, int Id)
        {
            /*
             *  public string Title { get; set; } = string.Empty;
                public string? PicturePath { get; set; }
                public string? Description { get; set; } 
                public string Director { get; set; } = string.Empty;
                public string? Rateing { get; set; } 
                public string PG { get; set; } = string.Empty; 
                public int Length { get; set; } 
             */
            
             var movie = await _context.Movies.FirstOrDefaultAsync(x => x.Id == Id);

             if ( movie == null ) throw new MovieNotFoundException("Movie not found");

             var properties = typeof(MovieCreateDto).GetProperties();

             foreach ( var prop in properties ) {
                  var newValue = prop.GetValue(movieCreateDto);

                    // This switch handles nulls, empty strings/whitespace, and default values (like 0)
                  bool skipUpdate = newValue switch {
                        null => true,
                        string s when string.IsNullOrWhiteSpace(s) => true,
                        var val when val.Equals(GetDefault(prop.PropertyType)) => true,
                        _ => false
                  };

                    if ( !skipUpdate ) {

                        var targetProperty = movie.GetType().GetProperty(prop.Name);

                        if ( targetProperty != null && targetProperty.CanWrite ) {

                            targetProperty.SetValue(movie, newValue);
                        }
                    }
                }

             await _context.SaveChangesAsync();
             return MapToDto(movie);
        }   
        
    }
}
