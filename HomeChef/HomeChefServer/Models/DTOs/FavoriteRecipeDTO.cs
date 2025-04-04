namespace HomeChef.Server.Models.DTOs
{
    public class FavoriteRecipeDTO
    {
        public int RecipeId { get; set; }
        public string Title { get; set; }
        public string ImageUrl { get; set; }
        public string CategoryName { get; set; }
    }
}
