using HomeChef.Server.Models.DTOs;

namespace HomeChef.Server.Services
{
    public interface IRecipeService
    {
        Task<List<RecipeSearchResultDTO>> SearchRecipesAsync(string searchTerm);
    }
}
