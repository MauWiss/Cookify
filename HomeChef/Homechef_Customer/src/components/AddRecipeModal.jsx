import { useState, useEffect } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import * as Dialog from "@radix-ui/react-dialog";

export default function AddRecipeModal({ onRecipeAdded }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [servings, setServings] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [ingredients, setIngredients] = useState([
    { name: "", quantity: "", unit: "" },
  ]);
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  useEffect(() => {
    if (open) fetchCategories();
  }, [open]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newRecipe = {
        title,
        imageUrl,
        sourceUrl,
        servings: parseInt(servings),
        cookingTime: parseInt(cookingTime),
        categoryId: parseInt(categoryId),
        ingredients,
      };

      // שלב ראשון: הוספת המתכון
      const res = await api.post("/myrecipes/add", newRecipe);

      // שלב שני: הוספת המצרכים
      const newRecipeId = res.data.id;
      for (let ingredient of ingredients) {
        const ingredientData = {
          name: ingredient.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
        };

        await api.post(`/myrecipes/${newRecipeId}/ingredients`, ingredientData);
      }

      toast.success("Recipe added! 🥗");
      setOpen(false);
      onRecipeAdded();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add recipe");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
        + Add Recipe
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
          <Dialog.Title className="mb-4 text-xl font-bold dark:text-white">
            Add New Recipe
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
              placeholder="Title"
              required
            />
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
              placeholder="Image URL"
              required
            />
            <input
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              className="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
              placeholder="Source URL"
            />
            <input
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              type="number"
              min="1"
              className="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
              placeholder="Servings"
              required
            />
            <input
              value={cookingTime}
              onChange={(e) => setCookingTime(e.target.value)}
              type="number"
              min="1"
              className="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
              placeholder="Cooking Time (min)"
              required
            />
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Display Ingredients Fields */}
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2">
                <input
                  value={ingredient.name}
                  onChange={(e) =>
                    setIngredients((prev) =>
                      prev.map((ing, i) =>
                        i === index ? { ...ing, name: e.target.value } : ing,
                      ),
                    )
                  }
                  className="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
                  placeholder="Ingredient Name"
                  required
                />
                <input
                  value={ingredient.quantity}
                  onChange={(e) =>
                    setIngredients((prev) =>
                      prev.map((ing, i) =>
                        i === index
                          ? { ...ing, quantity: e.target.value }
                          : ing,
                      ),
                    )
                  }
                  type="number"
                  className="w-1/4 rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
                  placeholder="Quantity"
                  required
                />
                <input
                  value={ingredient.unit}
                  onChange={(e) =>
                    setIngredients((prev) =>
                      prev.map((ing, i) =>
                        i === index ? { ...ing, unit: e.target.value } : ing,
                      ),
                    )
                  }
                  className="w-1/4 rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
                  placeholder="Unit"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(index)}
                  className="rounded-full bg-red-500 px-2 py-1 text-white"
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddIngredient}
              className="text-blue-500"
            >
              + Add Ingredient
            </button>

            <button
              type="submit"
              className="w-full rounded bg-green-600 py-2 text-white hover:bg-green-700"
            >
              Add Recipe
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
