import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import confetti from "canvas-confetti"; // ✅ חדש!
import api from "../api/api";

export default function EditRecipeModal({
  recipeId,
  onClose,
  onRecipeUpdated,
}) {
  const [open, setOpen] = useState(true);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [servings, setServings] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (open) {
      api.get("/categories").then((res) => setCategories(res.data));
      api.get(`/recipes/${recipeId}`).then((res) => {
        const r = res.data;
        setTitle(r.title);
        setImageUrl(r.imageUrl);
        setSourceUrl(r.sourceUrl);
        setServings(r.servings);
        setCookingTime(r.cookingTime);
        setCategoryId(r.categoryId);
        setIngredients(r.ingredients);
      });
    }
  }, [open, recipeId]);

  const handleIngredientChange = (index, field, value) => {
    setIngredients((prev) =>
      prev.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing)),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = {
        recipeId,
        title,
        imageUrl,
        sourceUrl,
        servings: parseInt(servings),
        cookingTime: parseInt(cookingTime),
        categoryId: parseInt(categoryId),
        ingredients,
      };

      await api.put("/myrecipes/update", updated);

      // 🎉 אפקט קונפטי
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });

      // ✅ Toast
      toast.success("🎉 Recipe updated successfully!", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });

      setOpen(false);
      onRecipeUpdated();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update recipe", {
        position: "top-center",
        theme: "colored",
      });
    }
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
          <Dialog.Title className="mb-4 text-xl font-bold dark:text-white">
            Edit Recipe
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
              required
              placeholder="Title"
            />
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
              required
              placeholder="Image URL"
            />
            <input
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              className="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
              placeholder="Source URL (optional)"
            />
            <input
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              type="number"
              min="1"
              className="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
              required
              placeholder="Servings"
            />
            <input
              value={cookingTime}
              onChange={(e) => setCookingTime(e.target.value)}
              type="number"
              min="1"
              className="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
              required
              placeholder="Cooking Time (min)"
            />
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
              required
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2">
                <input
                  value={ingredient.name}
                  onChange={(e) =>
                    handleIngredientChange(index, "name", e.target.value)
                  }
                  className="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
                  placeholder="Ingredient Name"
                  required
                />
                <input
                  value={ingredient.quantity}
                  onChange={(e) =>
                    handleIngredientChange(index, "quantity", e.target.value)
                  }
                  type="number"
                  className="w-1/4 rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
                  placeholder="Qty"
                  required
                />
                <input
                  value={ingredient.unit}
                  onChange={(e) =>
                    handleIngredientChange(index, "unit", e.target.value)
                  }
                  className="w-1/4 rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
                  placeholder="Unit"
                  required
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                setIngredients((prev) => [
                  ...prev,
                  { name: "", quantity: "", unit: "" },
                ])
              }
              className="text-sm text-blue-600 hover:underline"
            >
              + Add Ingredient
            </button>

            <button
              type="submit"
              className="w-full rounded bg-yellow-600 py-2 text-white hover:bg-yellow-700"
            >
              Save Changes
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
