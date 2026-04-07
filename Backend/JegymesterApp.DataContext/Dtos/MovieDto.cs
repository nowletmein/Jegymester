using System;
using System.Collections.Generic;
using System.Text;

namespace JegymesterApp.DataContext.Dtos
{
    public class MovieDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string? PicturePath { get; set; }
        public string? Description { get; set; }
        public string Director { get; set; }
        public string? Rating { get; set; }
        public string PG { get; set; }
        public int Length { get; set; }
        public ICollection<ScreeningDto> ScreeningDtos { get; set; } = new List<ScreeningDto>();
    }
    public class MovieCreateDto
    {
        /*  public int Id { get; set; }
            public string? PicturePath { get; set; }
            public string Title { get; set; }
            public string? Description { get; set; }//opcionális: film leírása
            public string Director { get; set; }
            public string? Rateing { get; set; } //opcionális: értékelés
            public string PG {  get; set; } //korhatár besorolás
            public int Length { get; set; } //integer: film hossza percben
            public ICollection<Screening> Screenings { get; set; } = new List<Screening>();*/
        public string Title { get; set; } = string.Empty;
        public string? PicturePath { get; set; }
        public string? Description { get; set; } 
        public string Director { get; set; } = string.Empty;
        public string? Rating { get; set; } 
        public string PG { get; set; } = string.Empty; 
        public int Length { get; set; } 
    }
}
