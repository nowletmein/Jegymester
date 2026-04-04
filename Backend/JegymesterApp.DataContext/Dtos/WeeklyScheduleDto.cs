using System;
using System.Collections.Generic;
using System.Text;

namespace JegymesterApp.DataContext.Dtos
{
    public class WeeklyScheduleDto
    {
        public string Day { get; set; }
        public List<ScreeningDto> Screenings { get; set; }
    }
}
