using Microsoft.EntityFrameworkCore;
using HomeChefServer.Data;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;

var builder = WebApplication.CreateBuilder(args);

// חיבור למסד נתונים
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// הוספת Controllers
builder.Services.AddControllers();

// הוספת Health Checks
builder.Services.AddHealthChecks()
    .AddSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));

var app = builder.Build();

// מיפוי Controllers
app.MapControllers();

// מיפוי בדיקת בריאות למסד הנתונים
app.MapHealthChecks("/health");

app.Run();
