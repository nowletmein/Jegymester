using System;
using System.Collections.Generic;
using System.Text;

namespace JegymesterApp.DataContext.Entites
{
    public class Room
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool available { get; set; }
        public ICollection<Screening> Screenings { get; set; } = new List<Screening>();

    }
}
