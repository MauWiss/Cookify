namespace HomeChef.Server.Models.DTOs
{
    public class CreateRecipeDTO
    {
        public string Title { get; set; }
        public string ImageUrl { get; set; }
        public string SourceUrl { get; set; }
        public int Servings { get; set; }
        public int CookingTime { get; set; }
        public int CategoryId { get; set; }

        // רשימת מרכיבים שמתווספים ביחד עם המתכון







        public List<IngredientDTO> Ingredients { get; set; }
    }
}