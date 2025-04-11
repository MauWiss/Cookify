using HomeChef.Server.Models.DTOs;
using HomeChefServer.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.Text.Json;

[Route("api/[controller]")]
[ApiController]
public class RatingsController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public RatingsController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    // הוספת דירוג למתכון
    [HttpPost]
    public async Task<ActionResult> AddRating([FromBody] RatingDTO ratingDto)
    {
        // בדיקה אם המשתמש מחובר
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
        if (userIdClaim == null)
        {
            return Unauthorized("User not logged in.");
        }

        // קבלת מזהה המשתמש מה-Claim
        int userId = int.Parse(userIdClaim.Value);
        ratingDto.UserId = userId;

        using var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
        await conn.OpenAsync();

        using var cmd = new SqlCommand("sp_AddRecipeRating", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@RecipeId", ratingDto.RecipeId);
        cmd.Parameters.AddWithValue("@UserId", ratingDto.UserId);
        cmd.Parameters.AddWithValue("@Rating", ratingDto.Rating);

        await cmd.ExecuteNonQueryAsync();

        // חישוב ממוצע הדירוגים והעדכון בטבלת המתכונים
        await UpdateRecipeRating(ratingDto.RecipeId);

        return Ok();
    }

    // עדכון דירוג למתכון
    [HttpPut]
    public async Task<ActionResult> UpdateRating([FromBody] RatingDTO ratingDto)
    {
        // בדיקה אם המשתמש מחובר
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
        if (userIdClaim == null)
        {
            return Unauthorized("User not logged in.");
        }

        // קבלת מזהה המשתמש מה-Claim
        int userId = int.Parse(userIdClaim.Value);
        ratingDto.UserId = userId;

        using var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
        await conn.OpenAsync();

        using var cmd = new SqlCommand("sp_UpdateRecipeRating", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@RecipeId", ratingDto.RecipeId);
        cmd.Parameters.AddWithValue("@UserId", ratingDto.UserId);
        cmd.Parameters.AddWithValue("@Rating", ratingDto.Rating);

        await cmd.ExecuteNonQueryAsync();

        // חישוב ממוצע הדירוגים והעדכון בטבלת המתכונים
        await UpdateRecipeRating(ratingDto.RecipeId);

        return Ok();
    }

    // מחיקת דירוג למתכון
    [HttpDelete]
    public async Task<ActionResult> DeleteRating([FromBody] RatingDTO ratingDto)
    {
        // בדיקה אם המשתמש מחובר
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
        if (userIdClaim == null)
        {
            return Unauthorized("User not logged in.");
        }

        // קבלת מזהה המשתמש מה-Claim
        int userId = int.Parse(userIdClaim.Value);
        ratingDto.UserId = userId;

        using var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
        await conn.OpenAsync();

        using var cmd = new SqlCommand("sp_DeleteRecipeRating", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@RecipeId", ratingDto.RecipeId);
        cmd.Parameters.AddWithValue("@UserId", ratingDto.UserId);

        await cmd.ExecuteNonQueryAsync();

        // חישוב ממוצע הדירוגים והעדכון בטבלת המתכונים
        await UpdateRecipeRating(ratingDto.RecipeId);

        return Ok();
    }

    // שליפת דירוג ממוצע ומספר הדירוגים
    [HttpGet("{recipeId}")]
    public async Task<ActionResult<RatingDTO>> GetRatingDetails(int recipeId)
    {
        var rating = new RatingDTO();

        using var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
        await conn.OpenAsync();

        using var cmd = new SqlCommand("sp_GetRecipeRatingDetails", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@RecipeId", recipeId);

        using var reader = await cmd.ExecuteReaderAsync();
        if (await reader.ReadAsync())
        {
            rating.AverageRating = reader["AverageRating"] != DBNull.Value ? (double?)reader["AverageRating"] : null;
            rating.RatingCount = (int)reader["RatingCount"];
        }

        return Ok(rating);
    }

    // פונקציה לעדכון דירוג ממוצע ומספר הדירוגים בטבלת המתכון
    private async Task UpdateRecipeRating(int recipeId)
    {
        using var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
        await conn.OpenAsync();

        // חישוב ממוצע הדירוגים
        using var cmd = new SqlCommand("sp_UpdateRecipeRating", conn)
        {
            CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@RecipeId", recipeId);

        await cmd.ExecuteNonQueryAsync();
    }
}
