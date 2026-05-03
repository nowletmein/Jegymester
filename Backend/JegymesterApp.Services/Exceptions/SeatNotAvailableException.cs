using System;
using System.Collections.Generic;
using System.Text;

namespace JegymesterApp.Services.Exceptions {
    public class SeatNotAvailableException : Exception {
        public SeatNotAvailableException(string message) : base(message) {
        }
    }
}
