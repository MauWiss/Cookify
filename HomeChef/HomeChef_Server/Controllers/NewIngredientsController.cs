using HomeChef_Server.Data;
using HomeChef_Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HomeChef_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NewIngredientsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NewIngredientsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<NewIngredient>>> GetIngredients() =>
            await _context.NewIngredients.ToListAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<NewIngredient>> GetIngredient(int id)
        {
            var ingredient = await _context.NewIngredients.FindAsync(id);
            return ingredient == null ? NotFound() : Ok(ingredient);
        }

        [HttpPost]
        public async Task<ActionResult<NewIngredient>> PostIngredient(NewIngredient ingredient)
        {
            _context.NewIngredients.Add(ingredient);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetIngredient), new { id = ingredient.Id }, ingredient);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutIngredient(int id, NewIngredient ingredient)
        {
            if (id != ingredient.Id) return BadRequest();
            _context.Entry(ingredient).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIngredient(int id)
        {
            var ingredient = await _context.NewIngredients.FindAsync(id);
            if (ingredient == null) return NotFound();
            _context.NewIngredients.Remove(ingredient);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
