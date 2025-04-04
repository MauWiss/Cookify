using Microsoft.EntityFrameworkCore;
using HomeChefServer.Data;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;

var builder = WebApplication.CreateBuilder(args);

//COnnection  
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

//  Controllers
builder.Services.AddControllers();

// Health Checks
builder.Services.AddHealthChecks()
    .AddSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
/*
 //https://localhost:5007/health
 //https://localhost:7019/health
 */


var app = builder.Build();

//  Controllers Mapping
app.MapControllers();

// מיפוי בדיקת בריאות למסד הנתונים
app.MapHealthChecks("/health");

app.Run();
