import { useState, useEffect } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import * as Dialog from "@radix-ui/react-dialog";
import confetti from "canvas-confetti";

export default function AddRecipeWizard({ onRecipeAdded }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [servings, setServings] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [ingredients, setIngredients] = useState([
    { name: "", quantity: "", unit: "" },
  ]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (open) {
      api.get("/categories").then((res) => setCategories(res.data));
    }
  }, [open]);

  useEffect(() => {
    if (imageUrl) {
      setPreview(imageUrl);
    }
  }, [imageUrl]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

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
      await api.post("/myrecipes/add", newRecipe);
      toast.success("🎉 Recipe added successfully!");
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setOpen(false);
      onRecipeAdded();
    } catch (err) {
      toast.error("Failed to add recipe");
      console.error(err);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        + Add Recipe
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[90vh] w-[92vw] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-white p-6 shadow-lg ring-1 ring-black/10 dark:bg-[#1f1f1f] dark:ring-white/10">
          <Dialog.Close asChild>
            <button className="absolute right-4 top-4 text-xl text-gray-400 hover:text-gray-600 dark:hover:text-white">
              ×
            </button>
          </Dialog.Close>

          <Dialog.Title className="mb-4 text-center text-2xl font-bold text-gray-800 dark:text-white">
            🧾 Add New Recipe
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                  required
                  className="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
                />
                <input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Image URL"
                  required
                  className="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
                />
                {preview && (
                  <div className="mt-2 flex justify-center">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-64 w-full rounded-lg border object-contain dark:border-gray-700"
                    />
                  </div>
                )}
                <input
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="Source URL (optional)"
                  className="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
                />
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    value={servings}
                    onChange={(e) => setServings(e.target.value)}
                    type="number"
                    placeholder="Servings"
                    required
                    className="rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    value={cookingTime}
                    onChange={(e) => setCookingTime(e.target.value)}
                    type="number"
                    placeholder="Cooking Time (min)"
                    required
                    className="rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  className="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </>
            )}

            {step === 3 && (
              <>
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      value={ingredient.name}
                      onChange={(e) =>
                        setIngredients((prev) =>
                          prev.map((ing, i) =>
                            i === index
                              ? { ...ing, name: e.target.value }
                              : ing,
                          ),
                        )
                      }
                      placeholder="Ingredient"
                      required
                      className="flex-1 rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
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
                      placeholder="Qty"
                      required
                      className="w-1/4 rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
                    />
                    <input
                      value={ingredient.unit}
                      onChange={(e) =>
                        setIngredients((prev) =>
                          prev.map((ing, i) =>
                            i === index
                              ? { ...ing, unit: e.target.value }
                              : ing,
                          ),
                        )
                      }
                      placeholder="Unit"
                      required
                      className="w-1/4 rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(index)}
                      className="rounded-full bg-red-500 px-2 text-white hover:bg-red-600"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="text-sm text-blue-600 hover:underline"
                >
                  + Add Ingredient
                </button>
              </>
            )}

            <div className="mt-6 flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center gap-1 rounded-md bg-gray-200 px-3 py-1 text-sm text-gray-800 shadow-sm transition hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                >
                  ← Back
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  className="ml-auto rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                  Add Recipe
                </button>
              )}
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
