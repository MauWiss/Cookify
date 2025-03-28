using System.ComponentModel.DataAnnotations;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HomeChef_Server.Models
{
    public class NewIngredient
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; }

        public ICollection<NewRecipeIngredient> RecipeIngredients { get; set; }
    }
}
