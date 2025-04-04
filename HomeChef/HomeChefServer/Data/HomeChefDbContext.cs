using HomeChefServer.Controllers;
using HomeChefServer.Models;
using Microsoft.EntityFrameworkCore;

namespace HomeChefServer.Data
{
    public class HomeChefDbContext : DbContext
    {
        public HomeChefDbContext(DbContextOptions<HomeChefDbContext> options) : base(options)
        {
        }

    
    }
}
