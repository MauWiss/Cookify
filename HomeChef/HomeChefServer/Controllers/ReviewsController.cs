using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.Security.Claims;
using HomeChefServer.DTOs;

namespace HomeChefServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ReviewsController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("{recipeId}")]
        public IActionResult GetReviews(int recipeId)
        {
            var reviews = new List<ReviewDTO>();
            ReviewDTO myReview = null;

            int? userId = null;
            if (User.Identity.IsAuthenticated)
            {
                var userClaim = User.FindFirst("UserId");
                if (userClaim != null)
                    userId = int.Parse(userClaim.Value);
            }

            using var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            using var cmd = new SqlCommand("sp_GetReviewsByRecipeId", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@RecipeId", recipeId);

            conn.Open();
            using var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                var review = new ReviewDTO
                {
                    ReviewId = (int)reader["ReviewId"],
                    UserId = (int)reader["UserId"],
                    Username = reader["Username"].ToString(),
                    ReviewText = reader["ReviewText"].ToString(),
                    CreatedAt = (DateTime)reader["CreatedAt"]
                };

                reviews.Add(review);

                if (userId.HasValue && review.UserId == userId.Value)
                    myReview = review;
            }

            return Ok(new { reviews, myReview });
        }

        [Authorize]
        [HttpPost("{recipeId}")]
        public IActionResult AddReview(int recipeId, [FromBody] string reviewText)
        {
            var userClaim = User.FindFirst("UserId");
            var usernameClaim = User.FindFirst("Username"); // שליפת שם המשתמש

            if (userClaim == null || usernameClaim == null)
                return Unauthorized("UserId or Username claim not found.");

            var userId = int.Parse(userClaim.Value);
            var username = usernameClaim.Value; // שמור את שם המשתמש במשתנה

            using var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            conn.Open();

            // Check if review already exists
            using (var checkCmd = new SqlCommand("SELECT COUNT(*) FROM Reviews WHERE RecipeId = @RecipeId AND UserId = @UserId", conn))
            {
                checkCmd.Parameters.AddWithValue("@RecipeId", recipeId);
                checkCmd.Parameters.AddWithValue("@UserId", userId);
                int exists = (int)checkCmd.ExecuteScalar();
                if (exists > 0)
                    return BadRequest("You already submitted a review for this recipe.");
            }

            // Insert review
            using var cmd = new SqlCommand("sp_AddReview", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@RecipeId", recipeId);
            cmd.Parameters.AddWithValue("@UserId", userId);
            cmd.Parameters.AddWithValue("@ReviewText", reviewText);
            cmd.Parameters.AddWithValue("@Username", username);  
            cmd.ExecuteNonQuery();


            return Ok(new { Message = "Review added successfully", Username = username }); // הוסף את שם המשתמש לתשובה
        }


        [Authorize]
        [HttpPut("{reviewId}")]
        public IActionResult UpdateReview(int reviewId, [FromBody] string reviewText)
        {
            var userClaim = User.FindFirst("UserId");
            if (userClaim == null)
                return Unauthorized("UserId claim not found.");

            var userId = int.Parse(userClaim.Value);

            using var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            using var cmd = new SqlCommand("sp_UpdateReview", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@ReviewId", reviewId);
            cmd.Parameters.AddWithValue("@UserId", userId);
            cmd.Parameters.AddWithValue("@ReviewText", reviewText);

            conn.Open();
            int rowsAffected = cmd.ExecuteNonQuery();

            if (rowsAffected == 0)
                return NotFound("Review not found or unauthorized.");

            return Ok("Review updated successfully");
        }

        [Authorize]
        [HttpDelete("{reviewId}")]
        public IActionResult DeleteReview(int reviewId)
        {
            var userClaim = User.FindFirst("UserId");
            if (userClaim == null)
                return Unauthorized("UserId claim not found.");

            var userId = int.Parse(userClaim.Value);

            using var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            using var cmd = new SqlCommand("sp_DeleteReview", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@ReviewId", reviewId);
            cmd.Parameters.AddWithValue("@UserId", userId);

            conn.Open();
            int rowsAffected = cmd.ExecuteNonQuery();

            if (rowsAffected == 0)
                return NotFound("Review not found or unauthorized.");

            return Ok("Review deleted successfully");
        }
    }
}
