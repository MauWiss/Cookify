using HomeChef.Server.Models.DTOs;
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
        public async Task<ActionResult<IEnumerable<PagedRecipeDTO>>> GetRecipesPaged(int pageNumber = 1, int pageSize = 10)
        {
            List<PagedRecipeDTO> recipes = new List<PagedRecipeDTO>();

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
                recipes.Add(new PagedRecipeDTO
                {
                    Id = (int)reader["Id"],
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
        // חיפוש מתכונים לפי מילה
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<RecipeSearchResultDTO>>> SearchRecipes([FromQuery] string term)
        {
            List<RecipeSearchResultDTO> results = new();

            using SqlConnection conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            await conn.OpenAsync();

            using SqlCommand cmd = new SqlCommand("sp_SearchRecipes", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@SearchTerm", term);

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                results.Add(new RecipeSearchResultDTO
                {
                    RecipeId = (int)reader["RecipeId"],
                    Title = reader["Title"].ToString(),
                    ImageUrl = reader["ImageUrl"].ToString(),
                    CategoryName = reader["CategoryName"].ToString()
                });
            }

            return Ok(results);
        }
        [HttpPost("add")]
        public async Task<IActionResult> AddRecipe(CreateRecipeDTO recipe)

        {
            // שליפת מזהה המשתמש מתוך הטוקן (JWT)
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
                return Unauthorized("User ID not found in token.");

            int userId = int.Parse(userIdClaim.Value);

            int newRecipeId;

            using var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            await conn.OpenAsync();

            // שלב ראשון: יצירת המתכון עצמו
            using (var cmd = new SqlCommand("sp_AddRecipe", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@Title", recipe.Title);
                cmd.Parameters.AddWithValue("@ImageUrl", recipe.ImageUrl);
                cmd.Parameters.AddWithValue("@SourceUrl", recipe.SourceUrl);
                cmd.Parameters.AddWithValue("@Servings", recipe.Servings);
                cmd.Parameters.AddWithValue("@CookingTime", recipe.CookingTime);
                cmd.Parameters.AddWithValue("@CategoryId", recipe.CategoryId);
                cmd.Parameters.AddWithValue("@CreatedByUserId", userId);

                using var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    newRecipeId = Convert.ToInt32(reader["NewRecipeId"]);
                }
                else
                {
                    return StatusCode(500, "Failed to create recipe.");
                }
            }

            // שלב שני: הוספת מרכיבים למתכון
            foreach (var ingredient in recipe.Ingredients)
            {
                using var cmd = new SqlCommand("sp_AddIngredientToRecipe", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@RecipeId", newRecipeId);
                cmd.Parameters.AddWithValue("@IngredientName", ingredient.Name);
                cmd.Parameters.AddWithValue("@Quantity", ingredient.Quantity);
                cmd.Parameters.AddWithValue("@Unit", ingredient.Unit);

                await cmd.ExecuteNonQueryAsync();
            }

            return Ok(new { Id = newRecipeId });
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

        [HttpPost("{id}/favorite")]
        public async Task<IActionResult> AddToFavorites(int id)
        {
            // חילוץ מזהה המשתמש מתוך ה־JWT
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
                return Unauthorized("User ID not found in token.");

            int userId = int.Parse(userIdClaim.Value);

            using var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            await conn.OpenAsync();

            using var cmd = new SqlCommand("sp_AddToFavorites", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@UserId", userId);
            cmd.Parameters.AddWithValue("@RecipeId", id);

            await cmd.ExecuteNonQueryAsync();

            return Ok(new { Message = $"Recipe {id} added to favorites." });
        }

        // כאן אני שולף את כל המועדפים של המשתמש

        [HttpGet("favorites")]
        public async Task<ActionResult<IEnumerable<FavoriteRecipeDTO>>> GetFavorites()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
                return Unauthorized("User ID not found in token.");

            int userId = int.Parse(userIdClaim.Value);
            var favorites = new List<FavoriteRecipeDTO>();

            using var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            await conn.OpenAsync();

            using var cmd = new SqlCommand("sp_GetFavoritesByUserId", conn)
            {
                CommandType = CommandType.StoredProcedure
            };
            cmd.Parameters.AddWithValue("@UserId", userId);

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                favorites.Add(new FavoriteRecipeDTO
                {
                    RecipeId = (int)reader["RecipeId"],
                    Title = reader["Title"].ToString(),
                    ImageUrl = reader["ImageUrl"].ToString(),
                    CategoryName = reader["CategoryName"].ToString()
                });
            }

            return Ok(favorites);
        }
        [HttpDelete("{id}/favorite")]
        public async Task<IActionResult> RemoveFromFavorites(int id)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
                return Unauthorized("User ID not found in token.");

            int userId = int.Parse(userIdClaim.Value);

            using var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            await conn.OpenAsync();

            using var cmd = new SqlCommand("sp_RemoveFromFavorites", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@UserId", userId);
            cmd.Parameters.AddWithValue("@RecipeId", id);

            await cmd.ExecuteNonQueryAsync();

            return Ok(new { Message = $"Recipe {id} removed from favorites." });
        }

        [HttpGet("my-recipes")]
        public async Task<ActionResult<IEnumerable<PagedRecipeDTO>>> GetMyRecipes()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
                return Unauthorized("User ID not found in token.");

            int userId = int.Parse(userIdClaim.Value);
            var recipes = new List<PagedRecipeDTO>();

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
                recipes.Add(new PagedRecipeDTO
                {
                    Id = (int)reader["Id"],
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

            // 🔒 בדיקה: האם המשתמש הוא יוצר המתכון
            using var checkCmd = new SqlCommand("SELECT CreatedByUserId FROM NewRecipes WHERE Id = @RecipeId", conn);
            checkCmd.Parameters.AddWithValue("@RecipeId", recipe.RecipeId);

            var creatorIdObj = await checkCmd.ExecuteScalarAsync();
            if (creatorIdObj == null)
                return NotFound("Recipe not found.");

            int creatorId = (int)creatorIdObj;
            if (creatorId != userId)
                return Forbid("You are not allowed to edit this recipe.");

            // ✏️ אם הבדיקה עברה – נמשיך לעדכן
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

            await cmd.ExecuteNonQueryAsync();

            return Ok(new { Message = $"Recipe {recipe.RecipeId} updated successfully." });
        }



    }
}
