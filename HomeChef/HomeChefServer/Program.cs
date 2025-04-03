using Microsoft.EntityFrameworkCore;
using HomeChefServer.Data; // במידה והמודל שלך נמצא בתיקייה הזו

var builder = WebApplication.CreateBuilder(args);

// הוספת DbContext למסד הנתונים
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// הוספת Controllers
builder.Services.AddControllers();

var app = builder.Build();

// מיפוי Controllers והפעלת האפליקציה
app.MapControllers();

app.Run();
