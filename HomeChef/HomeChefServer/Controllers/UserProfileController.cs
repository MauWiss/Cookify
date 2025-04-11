using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;

[ApiController]
[Route("api/[controller]")]
public class UserProfileController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly string _connectionString;

    public UserProfileController(IConfiguration configuration)
    {
        _configuration = configuration;
        _connectionString = _configuration.GetConnectionString("DefaultConnection");
    }

    private int GetUserIdFromToken()
    {
        var userIdClaim = User.FindFirst("id");
        return userIdClaim != null ? int.Parse(userIdClaim.Value) : 0;
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
        command.Parameters.AddWithValue("@ProfilePictureUrl", dto.ProfilePictureUrl ?? (object)DBNull.Value);
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

    // ✅ שליפת פרופיל המשתמש המחובר
    [HttpGet("me")]
    [Authorize]
    public IActionResult GetProfile()
    {
        int userId = GetUserIdFromToken();

        using SqlConnection connection = new(_connectionString);
        using SqlCommand command = new("SELECT Username, Email, ProfilePictureUrl, Bio, CreatedAt FROM Users WHERE Id = @Id", connection);

        command.Parameters.AddWithValue("@Id", userId);
        connection.Open();

        using var reader = command.ExecuteReader();
        if (reader.Read())
        {
            var user = new
            {
                Username = reader["Username"].ToString(),
                Email = reader["Email"].ToString(),
                ProfilePictureUrl = reader["ProfilePictureUrl"]?.ToString(),
                Bio = reader["Bio"]?.ToString(),
                CreatedAt = Convert.ToDateTime(reader["CreatedAt"])
            };

            return Ok(user);
        }

        return NotFound();
    }

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

            int userId = int.Parse(User.FindFirst("id")!.Value);

            using var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
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
