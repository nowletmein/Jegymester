using System;
using System.Collections.Generic;
using System.Text;

namespace JegymesterApp.DataContext.Dtos {
    public class RoleDto {
        public int Id { get; set; }
        public string Name { get; set; }
    }
    public class RoleCreateDto {
        public string Name { get; set; }
    }
}
