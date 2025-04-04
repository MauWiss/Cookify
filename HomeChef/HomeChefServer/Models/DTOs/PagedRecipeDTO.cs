namespace HomeChef.Server.Models.DTOs
{
    public class PagedRecipeDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string ImageUrl { get; set; }
        public string SourceUrl { get; set; }
        public int Servings { get; set; }
        public int CookingTime { get; set; }
        public string CategoryName { get; set; }
    }
}
