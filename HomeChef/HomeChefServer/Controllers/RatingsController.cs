using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.Security.Claims;

namespace HomeChefServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RatingsController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public RatingsController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [Authorize]
        [HttpPost("{recipeId}")]
        public IActionResult PostRating(int recipeId, [FromBody] int rating)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            using var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            using var cmd = new SqlCommand("sp_AddOrUpdateRating", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@RecipeId", recipeId);
            cmd.Parameters.AddWithValue("@UserId", userId);
            cmd.Parameters.AddWithValue("@Rating", rating);

            conn.Open();
            cmd.ExecuteNonQuery();
            return Ok("Rating saved");
        }

        [HttpGet("{recipeId}/average")]
        public IActionResult GetAverageRating(int recipeId)
        {
            using var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            using var cmd = new SqlCommand("sp_GetAverageRating", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@RecipeId", recipeId);

            conn.Open();
            using var reader = cmd.ExecuteReader();
            if (reader.Read())
            {
                return Ok(new
                {
                    RecipeId = recipeId,
                    AverageRating = reader.GetDouble(1),
                    TotalRatings = reader.GetInt32(2)
                });
            }

            return Ok(new { RecipeId = recipeId, AverageRating = 0.0, TotalRatings = 0 });
        }

        [Authorize]
        [HttpGet("{recipeId}/my")]
        public IActionResult GetUserRating(int recipeId)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");

                using var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
                using var cmd = new SqlCommand("sp_GetUserRatingForRecipe", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@RecipeId", recipeId);
                cmd.Parameters.AddWithValue("@UserId", userId);

                conn.Open();
                var result = cmd.ExecuteScalar();

                if (result != null && result != DBNull.Value)
                    return Ok(new { rating = Convert.ToInt32(result) });

                return Ok(new { rating = 0 });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Server error: {ex.Message}");
            }
        }

    }
}
