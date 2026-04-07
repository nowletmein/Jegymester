namespace JegymesterApp.Services.Exceptions
{
    [Serializable]
    public class MovieAlreadyExistsException : Exception
    {
        public MovieAlreadyExistsException()
        {
        }

        public MovieAlreadyExistsException(string? message) : base(message)
        {
        }

        public MovieAlreadyExistsException(string? message, Exception? innerException) : base(message, innerException)
        {
        }
    }
}