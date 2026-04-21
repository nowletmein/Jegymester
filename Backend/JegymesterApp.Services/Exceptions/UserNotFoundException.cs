using System;
using System.Collections.Generic;
using System.Text;

namespace JegymesterApp.Services.Exceptions {
    public class UserNotFoundException : Exception {
        public UserNotFoundException(string message) : base(message) {

        }
    }
}
