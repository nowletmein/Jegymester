using JegymesterApp.Services.Exceptions;

public class ExceptionHandling
{
    private readonly RequestDelegate _next;

    public ExceptionHandling(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        context.Response.StatusCode = exception switch
        {
            // All "NotFound" exceptions return 404
            MovieNotFoundException or
            ScreeningNotFoundException or
            TicketNotFoundException => StatusCodes.Status404NotFound,

            // All "AlreadyExists" exceptions return 409 (Conflict)
            MovieAlreadyExistsException or
            ScreeningAlreadyExists => StatusCodes.Status409Conflict, 

            // Default to 500 for everything else
            _ => StatusCodes.Status500InternalServerError
        };

        var result = new
        {
            error = exception.GetType().Name, 
            message = exception.Message
        };

        return context.Response.WriteAsJsonAsync(result);
    }
}