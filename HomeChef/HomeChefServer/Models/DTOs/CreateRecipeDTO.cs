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
        // לא צריך CreatedByUserId כאן כי נשלוף מהטוקן
    }
}
