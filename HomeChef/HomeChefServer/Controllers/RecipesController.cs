using HomeChef.Server.Models.DTOs;
using HomeChefServer.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;

namespace HomeChefServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecipesController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public RecipesController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // שליפה מדורגת של מתכונים
        [HttpGet("paged")]
        public async Task<ActionResult<IEnumerable<RecipeDTO>>> GetRecipesPaged(int pageNumber = 1, int pageSize = 10)
        {
            List<RecipeDTO> recipes = new List<RecipeDTO>();

            using SqlConnection conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            await conn.OpenAsync();

            using SqlCommand cmd = new SqlCommand("sp_GetRecipesPaged", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@PageNumber", pageNumber);
            cmd.Parameters.AddWithValue("@PageSize", pageSize);

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
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<RecipeDTO>>> SearchRecipes(string term)
        {
            var recipes = new List<RecipeDTO>();

            using var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            await conn.OpenAsync();

            var cmd = new SqlCommand("sp_SearchRecipes", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@SearchTerm", term);

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                recipes.Add(new RecipeDTO
                {
                    RecipeId = (int)reader["RecipeId"],
                    Title = reader["Title"].ToString(),
                    ImageUrl = reader["ImageUrl"].ToString(),
                    SourceUrl = reader["SourceUrl"].ToString(),
                    CategoryName = reader["CategoryName"].ToString(),
                    CookingTime = reader["CookingTime"] != DBNull.Value ? (int)reader["CookingTime"] : 0,
                    Servings = reader["Servings"] != DBNull.Value ? (int)reader["Servings"] : 0
                });
            }

            return Ok(recipes);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecipe(int id)
        {
            using var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            await conn.OpenAsync();

            using var cmd = new SqlCommand("sp_DeleteRecipe", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@RecipeId", id);

            await cmd.ExecuteNonQueryAsync();
            return Ok($"Recipe {id} deleted.");
        }
       
        [HttpGet("{id}")]
        public async Task<ActionResult<FullRecipeDTO>> GetRecipeById(int id)
        {
            FullRecipeDTO recipe = null;
            var ingredients = new List<IngredientDTO>();

            using var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            await conn.OpenAsync();

            using var cmd = new SqlCommand("sp_GetRecipeById", conn)
            {
                CommandType = CommandType.StoredProcedure
            };
            cmd.Parameters.AddWithValue("@RecipeId", id);

            using var reader = await cmd.ExecuteReaderAsync();

            // קריאת פרטי המתכון
            if (await reader.ReadAsync())
            {
                recipe = new FullRecipeDTO
                {
                    Id = (int)reader["Id"],
                    Title = reader["Title"].ToString(),
                    ImageUrl = reader["ImageUrl"].ToString(),
                    SourceUrl = reader["SourceUrl"].ToString(),
                    Servings = (int)reader["Servings"],
                    CookingTime = (int)reader["CookingTime"],
                    CategoryId = (int)reader["CategoryId"],
                    CategoryName = reader["CategoryName"].ToString(),
                    Ingredients = new List<IngredientDTO>()
                };
            }

            // קריאת המרכיבים
            if (await reader.NextResultAsync())
            {
                while (await reader.ReadAsync())
                {
                    ingredients.Add(new IngredientDTO
                    {
                        Name = reader["Name"].ToString(),
                        Quantity = float.Parse(reader["Quantity"].ToString()),
                        Unit = reader["Unit"].ToString()
                    });
                }
            }

            if (recipe == null)
                return NotFound();

            recipe.Ingredients = ingredients;
            return Ok(recipe);
        }

        

 
     



    }
}
