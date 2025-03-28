using System.ComponentModel.DataAnnotations;

namespace HomeChef_Server.Models
{
    public class NewRecipeIngredient
    {
        public int RecipeId { get; set; }
        public NewRecipe Recipe { get; set; }

        public int IngredientId { get; set; }
        public NewIngredient Ingredient { get; set; }

        public float? Quantity { get; set; }

        [MaxLength(50)]
        public string? Unit { get; set; }
    }
}
