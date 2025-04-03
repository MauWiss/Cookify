namespace HomeChefServer.Models
{
    public class NewRecipe
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Publisher { get; set; }
        public string ImageUrl { get; set; }
        public string SourceUrl { get; set; }
        public int Servings { get; set; }
        public string CookingTime { get; set; }
        public int CategoryId { get; set; }
    }
}
