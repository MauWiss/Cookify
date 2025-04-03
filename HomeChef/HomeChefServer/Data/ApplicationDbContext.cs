using HomeChefServer.Controllers.Models;
using HomeChefServer.Models;
using Microsoft.EntityFrameworkCore;

namespace HomeChefServer.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<NewRecipe> NewRecipes { get; set; }
    }
}
