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
    public class NewRecipesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NewRecipesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<NewRecipe>>> GetRecipes() =>
            await _context.NewRecipes
                .Include(r => r.Category)
                .Include(r => r.Ingredients)
                .ToListAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<NewRecipe>> GetRecipe(int id)
        {
            var recipe = await _context.NewRecipes
                .Include(r => r.Category)
                .Include(r => r.Ingredients)
                .FirstOrDefaultAsync(r => r.Id == id);
            return recipe == null ? NotFound() : Ok(recipe);
        }

        [HttpPost]
        public async Task<ActionResult<NewRecipe>> PostRecipe(NewRecipe recipe)
        {
            _context.NewRecipes.Add(recipe);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetRecipe), new { id = recipe.Id }, recipe);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutRecipe(int id, NewRecipe recipe)
        {
            if (id != recipe.Id) return BadRequest();
            _context.Entry(recipe).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecipe(int id)
        {
            var recipe = await _context.NewRecipes.FindAsync(id);
            if (recipe == null) return NotFound();
            _context.NewRecipes.Remove(recipe);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
