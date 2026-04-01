using System;
using System.Collections.Generic;
using System.Text;

namespace JegymesterApp.Services.Exceptions
{
    public class TicketNotFoundException:Exception
    {
        public TicketNotFoundException(string message) : base(message) {
        
        }
    }
}
