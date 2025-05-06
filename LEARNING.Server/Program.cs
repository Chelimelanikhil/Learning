using LEARNING.Server.Interfaces;
using LEARNING.Server.Managers;
using LEARNING.Server.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using LEARNING.Server.Models;


var builder = WebApplication.CreateBuilder(args);

// Bind connection strings
ConnectionString connectionString = new ConnectionString();
builder.Configuration.GetSection("ConnectionStrings").Bind(connectionString);

// Add services
builder.Services.AddScoped<IUsersMgr, UsersMgr>();
builder.Services.AddSingleton<JwtHelper>();
builder.Services.AddScoped<ICustomEmailService, EmailService>();
builder.Services.AddMemoryCache();


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 🔐 JWT Authentication Setup
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true, // 🔥 Enforces expiration validation
            ClockSkew = TimeSpan.Zero, // 🔥 No 5 min grace period (default was 5 mins)
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])
            )
        };
    });


builder.Services.AddAuthorization();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 🔐 Enable authentication and authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();
