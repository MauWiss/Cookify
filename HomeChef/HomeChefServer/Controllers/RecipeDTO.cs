namespace HomeChefServer.Controllers
{
    public class RecipeDTO
    {
        public int RecipeId { get; set; }       // מזהה המתכון
        public string Title { get; set; }       // שם המתכון
        public string ImageUrl { get; set; }    // URL לתמונה של המתכון
        public string CategoryName { get; set; } // שם הקטגוריה של המתכון
        public int CookingTime { get; set; }    // זמן הכנה במינוטים
        public int Servings { get; set; }       // מספר מנות שהמתכון משרת
    }

}
