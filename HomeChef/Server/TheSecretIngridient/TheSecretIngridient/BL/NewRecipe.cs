public class NewRecipe
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Publisher { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string SourceUrl { get; set; } = string.Empty;
    public int Servings { get; set; }
    public int CookingTime { get; set; }
    public int CategoryId { get; set; }
}
