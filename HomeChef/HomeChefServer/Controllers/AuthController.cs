using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using HomeChefServer.Data;
using System.Data;

namespace HomeChefServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register(string username, string email, string passwordHash)
        {
            try
            {
                var resultParam = new SqlParameter
                {
                    ParameterName = "@NewUserId",
                    SqlDbType = SqlDbType.Int,
                    Direction = ParameterDirection.Output
                };

                await _context.Database.ExecuteSqlRawAsync(
                    "EXEC sp_RegisterUser @Username, @Email, @PasswordHash",
                    new SqlParameter("@Username", username),
                    new SqlParameter("@Email", email),
                    new SqlParameter("@PasswordHash", passwordHash)
                );

                return Ok(new { message = "Registration successful." });
            }
            catch (SqlException ex)
            {
                if (ex.Message.Contains("Email already exists"))
                    return BadRequest("Email already exists.");
                return StatusCode(500, "Database error: " + ex.Message);
            }
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(string email, string passwordHash)
        {
            var users = await _context.Users
                .FromSqlRaw("EXEC sp_LoginUser @Email, @PasswordHash",
                    new SqlParameter("@Email", email),
                    new SqlParameter("@PasswordHash", passwordHash))
                .ToListAsync();

            if (users.Count == 0)
                return Unauthorized("Invalid credentials.");

            return Ok(users.First());
        }
    }
}
