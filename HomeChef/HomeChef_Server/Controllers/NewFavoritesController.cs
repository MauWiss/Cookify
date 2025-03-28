using HomeChef_Server.Data;
using HomeChef_Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HomeChef_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NewFavoritesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NewFavoritesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<NewFavorite>>> GetAll() =>
            await _context.NewFavorites
                .Include(f => f.User)
                .Include(f => f.Recipe)
                .ToListAsync();

        [HttpPost]
        public async Task<ActionResult<NewFavorite>> Post(NewFavorite favorite)
        {
            _context.NewFavorites.Add(favorite);
            await _context.SaveChangesAsync();
            return Ok(favorite);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int userId, int recipeId)
        {
            var fav = await _context.NewFavorites
                .FirstOrDefaultAsync(x => x.UserId == userId && x.RecipeId == recipeId);
            if (fav == null) return NotFound();
            _context.NewFavorites.Remove(fav);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
