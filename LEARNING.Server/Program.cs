using LEARNING.Server.Interfaces;
using LEARNING.Server.Managers;
using LEARNING.Server.Models;

var builder = WebApplication.CreateBuilder(args);
ConnectionString connectionString = new ConnectionString();
builder.Configuration.GetSection("ConnectionStrings").Bind(connectionString);


// Add services to the container.
builder.Services.AddScoped<IUsersMgr, UsersMgr>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
