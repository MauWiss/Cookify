using Microsoft.AspNetCore.Mvc;
using HomeChefServer.Models.DTOs;
using HomeChef.Server.Services;
using HomeChef.Server.Models;
using System.Data;
using Dapper;
using System.Data.SqlClient;
using Dapper;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace HomeChefServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    
    public class AdminController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AdminController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            using var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            var users = await conn.QueryAsync<User>(
                "sp_GetAllUsers",
                commandType: CommandType.StoredProcedure
            );
            return Ok(users);

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecipe(int id)
        {
            using var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            await conn.OpenAsync();

            using var cmd = new SqlCommand("DELETE FROM NewRecipes WHERE Id = @Id", conn);
            cmd.Parameters.AddWithValue("@Id", id);

            var rowsAffected = await cmd.ExecuteNonQueryAsync();
            if (rowsAffected == 0) return NotFound();

            return NoContent(); // 204
        }



    }
}
