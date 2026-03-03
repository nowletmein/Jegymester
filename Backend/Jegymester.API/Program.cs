using JegymesterApp.DataContext.Context;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add the database service
builder.Services.AddDbContext<JegymesterDbContext>(options =>
    options.UseSqlServer(@"Server=(localdb)\mssqllocaldb;Database=JegymesterDB;Trusted_Connection=True;TrustServerCertificate=true"));

builder.Services.AddControllers();
var app = builder.Build();

app.MapControllers();
app.Run();