using Microsoft.EntityFrameworkCore;
using HomeChef_Server.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HomeChef_Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<NewRecipe> NewRecipes { get; set; }
        public DbSet<NewIngredient> NewIngredients { get; set; }
        public DbSet<NewRecipeIngredient> NewRecipeIngredients { get; set; }
        public DbSet<NewFavorite> NewFavorites { get; set; }
    }
}
