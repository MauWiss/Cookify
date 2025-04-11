using Microsoft.AspNetCore.Mvc;
using HomeChefServer.Models.DTOs;
using HomeChef.Server.Services;
using HomeChefServer.Models.DTOs;
using System.Data;
using Dapper;
using System.Data.SqlClient;


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

        [HttpGet("recipes")]
        public async Task<ActionResult<IEnumerable<RecipeDTO>>> GetRecipesPaged(int pageNumber = 1, int pageSize = 10)
        {
            List<RecipeDTO> recipes = new List<RecipeDTO>();

            using SqlConnection conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            await conn.OpenAsync();

            using SqlCommand cmd = new SqlCommand("sp_GetRecipesPaged", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@PageNumber", pageNumber);
            cmd.Parameters.AddWithValue("@PageSize", pageSize);

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                recipes.Add(new RecipeDTO
                {
                    RecipeId = (int)reader["Id"],
                    Title = reader["Title"].ToString(),
                    ImageUrl = reader["ImageUrl"].ToString(),
                    SourceUrl = reader["SourceUrl"].ToString(),
                    Servings = (int)reader["Servings"],
                    CookingTime = (int)reader["CookingTime"],
                    CategoryName = reader["CategoryName"].ToString()
                });
            }

            return Ok(recipes);
        }

    }
}
