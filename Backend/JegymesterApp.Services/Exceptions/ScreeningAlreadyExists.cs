namespace JegymesterApp.Services.Exceptions {
    [Serializable]
    public class ScreeningAlreadyExists : Exception {
        public ScreeningAlreadyExists() {
        }

        public ScreeningAlreadyExists(string? message) : base(message) {
        }

        public ScreeningAlreadyExists(string? message, Exception? innerException) : base(message, innerException) {
        }
    }
} 
