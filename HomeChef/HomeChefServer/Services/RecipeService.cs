using HomeChef.Server.Models.DTOs;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace HomeChef.Server.Services
{
    public class RecipeService : IRecipeService
    {
        private readonly IConfiguration _configuration;

        public RecipeService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<List<RecipeSearchResultDTO>> SearchRecipesAsync(string searchTerm)
        {
            var results = new List<RecipeSearchResultDTO>();

            using var conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            await conn.OpenAsync();

            using var cmd = new SqlCommand("sp_SearchRecipes", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@SearchTerm", searchTerm);

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                results.Add(new RecipeSearchResultDTO
                {
                    RecipeId = (int)reader["RecipeId"],
                    Title = reader["Title"].ToString(),
                    ImageUrl = reader["ImageUrl"].ToString(),
                    CategoryName = reader["CategoryName"].ToString()
                });
            }

            return results;
        }
    }
}
