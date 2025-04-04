using HomeChefServer.Controllers;
using HomeChefServer.Models;
using Microsoft.EntityFrameworkCore;

namespace HomeChefServer.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

    
    }
}
