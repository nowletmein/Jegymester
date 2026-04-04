using JegymesterApp.DataContext.Context;
using JegymesterApp.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add the database service
builder.Services.AddDbContext<JegymesterDbContext>(options =>
    options.UseSqlServer(@"Server=(localdb)\mssqllocaldb;Database=JegymesterDB;Trusted_Connection=True;TrustServerCertificate=true"));

builder.Services.AddControllers();
builder.Services.AddScoped<ITicketService, TicketService>();
builder.Services.AddScoped<IMovieService, MovieService>();
builder.Services.AddScoped<IScreeningService, ScreeningService>();

//Swagger
builder.Services.AddEndpointsApiExplorer(); 
builder.Services.AddSwaggerGen();

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
        options.RoutePrefix = string.Empty; 
    });
}


app.MapControllers();
app.Run();