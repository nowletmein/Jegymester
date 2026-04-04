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
        public string? Rateing { get; set; }
        public string PG { get; set; }
        public int Length { get; set; }
        public ICollection<ScreeningDto> ScreeningDtos { get; set; } = new List<ScreeningDto>();
    }
}
