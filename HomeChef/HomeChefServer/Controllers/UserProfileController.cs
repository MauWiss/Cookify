using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HomeChef.Server.Services;
using System.Data;
using System.Data.SqlClient;

[ApiController]
[Route("api/[controller]")]
public class UserProfileController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly IAuthService _authService;
    private readonly string _connectionString;

    public UserProfileController(IConfiguration configuration, IAuthService authService)
    {
        _configuration = configuration;
        _authService = authService;
        _connectionString = _configuration.GetConnectionString("DefaultConnection");
    }

    private int GetUserIdFromToken()
    {
        var userIdClaim = User.FindFirst("UserId");
        return userIdClaim != null ? int.Parse(userIdClaim.Value) : 0;
    }

    // ✅ שליפת פרופיל המשתמש המחובר
    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetProfile()
    {
        int userId = GetUserIdFromToken();
        var user = await _authService.GetUserByIdAsync(userId);

        if (user == null)
            return NotFound();

        return Ok(new
        {
            username = user.Username,
            email = user.Email,
            profilePictureBase64 = user.ProfilePictureBase64,
            bio = user.Bio,
            createdAt = user.CreatedAt
        });
    }

    // ✅ עדכון פרופיל (תמונה + תיאור)
    [HttpPut("update")]
    [Authorize]
    public IActionResult UpdateProfile([FromBody] UpdateUserProfileDTO dto)
    {
        int userId = GetUserIdFromToken();

        using SqlConnection connection = new(_connectionString);
        using SqlCommand command = new("sp_UpdateUserProfile", connection);
        command.CommandType = CommandType.StoredProcedure;

        command.Parameters.AddWithValue("@Id", userId);
        command.Parameters.AddWithValue("@ProfilePictureUrl", DBNull.Value); // לא בשימוש אצלך
        command.Parameters.AddWithValue("@Bio", dto.Bio ?? (object)DBNull.Value);

        connection.Open();
        command.ExecuteNonQuery();

        return Ok(new { message = "Profile updated successfully." });
    }

    // ✅ עדכון סיסמה
    [HttpPut("update-password")]
    [Authorize]
    public IActionResult UpdatePassword([FromBody] UpdatePasswordDTO dto)
    {
        int userId = GetUserIdFromToken();

        using SqlConnection connection = new(_connectionString);
        using SqlCommand command = new("sp_UpdatePassword", connection);
        command.CommandType = CommandType.StoredProcedure;

        command.Parameters.AddWithValue("@Id", userId);
        command.Parameters.AddWithValue("@OldPassword", dto.OldPassword);
        command.Parameters.AddWithValue("@NewPassword", dto.NewPassword);

        connection.Open();
        var result = command.ExecuteScalar();

        if (result != null && Convert.ToInt32(result) == 1)
            return Ok(new { message = "Password updated successfully." });

        return BadRequest(new { message = "Current password is incorrect." });
    }

    // ✅ העלאת תמונת פרופיל בבייס64
    [HttpPost("upload-picture-base64")]
    [Authorize]
    public async Task<IActionResult> UploadBase64(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        try
        {
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            var bytes = memoryStream.ToArray();
            var base64String = Convert.ToBase64String(bytes);

            int userId = GetUserIdFromToken();

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("UPDATE Users SET ProfilePictureBase64 = @Base64 WHERE Id = @Id", conn);

            cmd.Parameters.AddWithValue("@Base64", base64String);
            cmd.Parameters.AddWithValue("@Id", userId);

            conn.Open();
            await cmd.ExecuteNonQueryAsync();

            return Ok(new { base64 = base64String });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error saving base64 image: {ex.Message}");
        }
    }
}
