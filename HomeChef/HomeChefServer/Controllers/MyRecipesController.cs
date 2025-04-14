using HomeChef.Server.Models.DTOs;
using HomeChefServer.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.Text.Json;


namespace HomeChefServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MyRecipesController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public MyRecipesController(IConfiguration configuration)
        {
            _configuration = configuration;
        }


        [HttpGet("my-recipes")]
        public async Task<ActionResult<IEnumerable<RecipeDTO>>> GetMyRecipes()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
                return Unauthorized("User ID not found in token.");

            int userId = int.Parse(userIdClaim.Value);
            var recipes = new List<RecipeDTO>();

            using var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            await conn.OpenAsync();

            using var cmd = new SqlCommand("sp_GetMyRecipes", conn)
            {
                CommandType = CommandType.StoredProcedure
            };
            cmd.Parameters.AddWithValue("@UserId", userId);

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                recipes.Add(new RecipeDTO
                {
                    RecipeId = (int)reader["Id"],
                    Title = reader["Title"].ToString(),
                    ImageUrl = reader["ImageUrl"].ToString(),
                    SourceUrl = reader["SourceUrl"].ToString(),
                    Servings = (int)reader["Servings"],
                    CookingTime = (int)reader["CookingTime"],
                    CategoryName = reader["CategoryName"].ToString()
                });
            }

            return Ok(recipes);
        }


        [HttpPost("add")]
        public async Task<IActionResult> AddRecipe([FromBody] CreateRecipeDTO recipe)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
                return Unauthorized("User ID not found in token.");

            int userId = int.Parse(userIdClaim.Value);

            using var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            await conn.OpenAsync();

            using var cmd = new SqlCommand("sp_AddRecipe", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            // 🧾 פרמטרים בסיסיים
            cmd.Parameters.AddWithValue("@Title", recipe.Title);
            cmd.Parameters.AddWithValue("@ImageUrl", recipe.ImageUrl);
            cmd.Parameters.AddWithValue("@SourceUrl", recipe.SourceUrl);
            cmd.Parameters.AddWithValue("@Servings", recipe.Servings);
            cmd.Parameters.AddWithValue("@CookingTime", recipe.CookingTime);
            cmd.Parameters.AddWithValue("@CategoryId", recipe.CategoryId);
            cmd.Parameters.AddWithValue("@InstructionsText", recipe.InstructionsText ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@Summary", recipe.Summary ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@Cuisine", recipe.Cuisine ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@Vegetarian", recipe.Vegetarian);
            cmd.Parameters.AddWithValue("@Vegan", recipe.Vegan);
            cmd.Parameters.AddWithValue("@GlutenFree", recipe.GlutenFree);
            cmd.Parameters.AddWithValue("@CreatedByUserId", userId);

            // 🍅 Table-Valued Parameter (TVP) למצרכים
            var ingredientsTable = new DataTable();
            ingredientsTable.Columns.Add("IngredientId", typeof(int));
            ingredientsTable.Columns.Add("Quantity", typeof(decimal));
            ingredientsTable.Columns.Add("Unit", typeof(string));

            foreach (var ing in recipe.Ingredients)
            {
                ingredientsTable.Rows.Add(ing.IngredientId, ing.Quantity, ing.Unit);
            }

            var ingredientsParam = cmd.Parameters.AddWithValue("@Ingredients", ingredientsTable);
            ingredientsParam.SqlDbType = SqlDbType.Structured;
            ingredientsParam.TypeName = "dbo.IngredientTableType";

            await cmd.ExecuteNonQueryAsync();
            return Ok(new { Message = "Recipe added successfully!" });
        }

        // עריכת מתכון 

        [HttpPut("update")]
        public async Task<IActionResult> UpdateRecipe([FromBody] UpdateRecipeDTO recipe)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
                return Unauthorized("User ID not found in token.");

            int userId = int.Parse(userIdClaim.Value);

            using var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            await conn.OpenAsync();

            // בדיקה האם המשתמש הוא יוצר המתכון
            using var checkCmd = new SqlCommand("SELECT CreatedByUserId FROM NewRecipes WHERE Id = @RecipeId", conn);
            checkCmd.Parameters.AddWithValue("@RecipeId", recipe.RecipeId);

            var creatorIdObj = await checkCmd.ExecuteScalarAsync();
            if (creatorIdObj == null)
                return NotFound("Recipe not found.");

            if ((int)creatorIdObj != userId)
                return Forbid("You are not allowed to edit this recipe.");

            var ingredientsJson = JsonSerializer.Serialize(recipe.Ingredients);

            using var cmd = new SqlCommand("sp_UpdateRecipe", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@RecipeId", recipe.RecipeId);
            cmd.Parameters.AddWithValue("@Title", recipe.Title);
            cmd.Parameters.AddWithValue("@ImageUrl", recipe.ImageUrl);
            cmd.Parameters.AddWithValue("@SourceUrl", recipe.SourceUrl);
            cmd.Parameters.AddWithValue("@Servings", recipe.Servings);
            cmd.Parameters.AddWithValue("@CookingTime", recipe.CookingTime);
            cmd.Parameters.AddWithValue("@CategoryId", recipe.CategoryId);
            cmd.Parameters.AddWithValue("@UserId", userId);
            cmd.Parameters.AddWithValue("@IngredientsJson", ingredientsJson);

            await cmd.ExecuteNonQueryAsync();

            return Ok(new { Message = $"Recipe {recipe.RecipeId} updated successfully." });
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecipe(int id)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null) return Unauthorized();
            int userId = int.Parse(userIdClaim.Value);

            using var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            await conn.OpenAsync();

            using var checkCmd = new SqlCommand("SELECT CreatedByUserId FROM NewRecipes WHERE Id = @RecipeId", conn);
            checkCmd.Parameters.AddWithValue("@RecipeId", id);

            var creatorIdObj = await checkCmd.ExecuteScalarAsync();
            if (creatorIdObj == null) return NotFound("Recipe not found.");
            if ((int)creatorIdObj != userId) return Forbid("You cannot delete this recipe.");

            using var cmd = new SqlCommand("sp_DeleteRecipe", conn)
            {
                CommandType = CommandType.StoredProcedure
            };
            cmd.Parameters.AddWithValue("@RecipeId", id);

            await cmd.ExecuteNonQueryAsync();
            return Ok(new { Message = $"Recipe {id} deleted successfully." });
        }
    }
}
