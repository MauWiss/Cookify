namespace HomeChef.Server.Models.DTOs
{
    public class UpdateRecipeDTO
    {
        public int RecipeId { get; set; }
        public string Title { get; set; }
        public string ImageUrl { get; set; }
        public string SourceUrl { get; set; }
        public int Servings { get; set; }
        public int CookingTime { get; set; }
        public int CategoryId { get; set; }
    }
}
