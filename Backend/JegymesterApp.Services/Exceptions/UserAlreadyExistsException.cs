using System;
using System.Collections.Generic;
using System.Text;

namespace JegymesterApp.Services.Exceptions {
    public class UserAlreadyExistsException: Exception {
        public UserAlreadyExistsException(string message) : base(message) {

        }
    }
}
