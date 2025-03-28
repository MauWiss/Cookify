using HomeChef_Server.Data;
using HomeChef_Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HomeChef_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NewRecipeIngredientsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NewRecipeIngredientsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<NewRecipeIngredient>>> GetAll() =>
            await _context.NewRecipeIngredients
                .Include(x => x.Recipe)
                .Include(x => x.Ingredient)
                .ToListAsync();

        [HttpPost]
        public async Task<ActionResult<NewRecipeIngredient>> Post(NewRecipeIngredient item)
        {
            _context.NewRecipeIngredients.Add(item);
            await _context.SaveChangesAsync();
            return Ok(item);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int recipeId, int ingredientId)
        {
            var item = await _context.NewRecipeIngredients
                .FirstOrDefaultAsync(x => x.RecipeId == recipeId && x.IngredientId == ingredientId);
            if (item == null) return NotFound();
            _context.NewRecipeIngredients.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
