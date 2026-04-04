using System;
using System.Collections.Generic;
using System.Text;

namespace JegymesterApp.Services.Exceptions
{
    public class MovieNotFoundException: Exception
    {
        public MovieNotFoundException(string message) : base(message)
        {

        }
    }
}
