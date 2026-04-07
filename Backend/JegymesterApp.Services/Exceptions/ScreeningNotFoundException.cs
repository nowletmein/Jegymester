using System;
using System.Collections.Generic;
using System.Text;

namespace JegymesterApp.Services.Exceptions
{
    public class ScreeningNotFoundException:Exception
    {
       

        public ScreeningNotFoundException(string message) : base(message)
        {

        }
    }
}
