using System;
using System.Collections.Generic;
using System.Text;
using JegymesterApp.DataContext.Entites;

namespace JegymesterApp.DataContext.Entites
{
    public class Movie
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }//opcionális: film leírása
        public string Director { get; set; }
        public string? Rateing { get; set; } //opcionális: értékelés
        public string PG {  get; set; } //korhatár besorolás
        public int Length { get; set; } //integer: film hossza percben
    }
}
