using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HomeChef.Server.Services;
using System.Data;
using System.Data.SqlClient;
using System.Security.Cryptography;
using System.Text;

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

    private string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(password);
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
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

    // ✅ עדכון פרופיל (Bio בלבד)
    [HttpPut("update")]
    [Authorize]
    public IActionResult UpdateProfile([FromBody] UpdateUserProfileDTO dto)
    {
        int userId = GetUserIdFromToken();

        using SqlConnection connection = new(_connectionString);
        using SqlCommand command = new("sp_UpdateUserProfile", connection);
        command.CommandType = CommandType.StoredProcedure;

        command.Parameters.AddWithValue("@Id", userId);
        command.Parameters.AddWithValue("@ProfilePictureUrl", DBNull.Value);
        command.Parameters.AddWithValue("@Bio", dto.Bio ?? (object)DBNull.Value);

        connection.Open();
        command.ExecuteNonQuery();

        return Ok(new { message = "Profile updated successfully." });
    }

    // ✅ שינוי סיסמה עם כל הבדיקות
    [HttpPut("update-password")]
    [Authorize]
    public async Task<IActionResult> UpdatePassword([FromBody] UpdatePasswordDTO dto)
    {
        int userId = GetUserIdFromToken();

        using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();

        // שליפת ההאש הקיים
        using var getCmd = new SqlCommand("SELECT PasswordHash FROM Users WHERE Id = @Id", conn);
        getCmd.Parameters.AddWithValue("@Id", userId);
        var currentHash = (string?)await getCmd.ExecuteScalarAsync();

        if (currentHash == null)
            return StatusCode(500, "User not found.");

        // בדיקה: סיסמה ישנה שגויה
        if (currentHash != HashPassword(dto.OldPassword))
            return BadRequest(new { message = "Current password is incorrect." });

        // בדיקה: סיסמה חדשה זהה לישנה
        if (HashPassword(dto.NewPassword) == currentHash)
            return BadRequest(new { message = "New password must be different from the current one." });

        // עדכון הסיסמה
        using var updateCmd = new SqlCommand("sp_UpdatePassword", conn);
        updateCmd.CommandType = CommandType.StoredProcedure;
        updateCmd.Parameters.AddWithValue("@Id", userId);
        updateCmd.Parameters.AddWithValue("@NewPassword", HashPassword(dto.NewPassword));
        await updateCmd.ExecuteNonQueryAsync();

        return Ok(new { message = "Password updated successfully." });
    }

    // ✅ העלאת תמונת פרופיל (base64)
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
