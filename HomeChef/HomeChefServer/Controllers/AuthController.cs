using HomeChef.Server.Models.DTOs;
using HomeChef.Server.Services;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using System.Security.Cryptography;


namespace HomeChefServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IConfiguration _configuration;

        public AuthController(IAuthService authService, IConfiguration configuration)
        {
            _authService = authService;
            _configuration = configuration;
        }

        // התחברות
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDTO login)
        {
            var user = await _authService.ValidateUserAsync(login.Email, login.PasswordHash);

            if (user == null)
                return Unauthorized("Email or password is incorrect.");

            if (!user.IsActive)
                return Unauthorized("User is not active.");

            var token = _authService.GenerateJwtToken(user);
            return Ok(new { token });
        }
        // מתודה להצפנת הסיסמה
        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserDTO register)
        {
            try
            {
                var hashedPassword = HashPassword(register.PasswordHash);

                using var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
                await conn.OpenAsync();

                using var cmd = new SqlCommand("sp_RegisterUser", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@Username", register.Username);
                cmd.Parameters.AddWithValue("@Email", register.Email);
                cmd.Parameters.AddWithValue("@PasswordHash", hashedPassword);

                var returnValue = cmd.Parameters.Add("@ReturnValue", SqlDbType.Int);
                returnValue.Direction = ParameterDirection.ReturnValue;

                await cmd.ExecuteNonQueryAsync();
                int result = (int)returnValue.Value;

                if (result == -1)
                    return Conflict("A user with this email already exists.");

                if (result != 1)
                    return StatusCode(500, "Unknown error during registration.");

                // שליפה מחדש לפי אימייל בלבד
                // במקום ValidateUserAsync...
                var newUser = await _authService.GetUserByEmailAsync(register.Email);
                if (newUser == null)
                    return StatusCode(500, "User created but could not be retrieved.");

                var token = _authService.GenerateJwtToken(newUser);
                return Ok(new { token });


            }
            catch (SqlException ex)
            {
                return StatusCode(500, $"Database error: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Unexpected error: {ex.Message}");
            }
        }
    }
}

