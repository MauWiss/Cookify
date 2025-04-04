using HomeChef.Server.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;

namespace HomeChefServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecipesController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public RecipesController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // שליפה מדורגת של מתכונים
        [HttpGet("paged")]
        public async Task<ActionResult<IEnumerable<PagedRecipeDTO>>> GetRecipesPaged(int pageNumber = 1, int pageSize = 10)
        {
            List<PagedRecipeDTO> recipes = new List<PagedRecipeDTO>();

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
                recipes.Add(new PagedRecipeDTO
                {
                    Id = (int)reader["Id"],
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
