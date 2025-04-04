using HomeChef.Server.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace HomeChefServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FavoritesController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public FavoritesController(IConfiguration configuration)
        {
            _configuration = configuration;
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


        // DELETE api/<FavoritesController>/5
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
    }
}
