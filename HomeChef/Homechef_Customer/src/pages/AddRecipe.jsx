import { useState } from "react";

export default function AddRecipe() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleIngredientChange = (index, value) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const addIngredientField = () => setIngredients([...ingredients, ""]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ title, category, ingredients, image });
    // TODO: send to backend
  };

  return (
    <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow dark:bg-gray-900">
      <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
        Add a New Recipe 🍽️
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            type="text"
            className="mt-1 w-full rounded-md border bg-gray-50 px-4 py-2 dark:bg-gray-800 dark:text-white"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
          <select
            className="mt-1 w-full rounded-md border bg-gray-50 px-4 py-2 dark:bg-gray-800 dark:text-white"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select category</option>
            <option value="Pasta">Pasta</option>
            <option value="Salad">Salad</option>
            <option value="Dessert">Dessert</option>
            <option value="Vegan">Vegan</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Ingredients
          </label>
          {ingredients.map((item, idx) => (
            <input
              key={idx}
              type="text"
              className="mb-2 mt-1 w-full rounded-md border bg-gray-50 px-4 py-2 dark:bg-gray-800 dark:text-white"
              value={item}
              onChange={(e) => handleIngredientChange(idx, e.target.value)}
              required
            />
          ))}
          <button
            type="button"
            onClick={addIngredientField}
            className="text-sm text-blue-600 hover:underline"
          >
            + Add another ingredient
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Image
          </label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 h-40 rounded object-cover"
            />
          )}
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 py-2 text-white transition hover:bg-blue-700"
        >
          Submit Recipe
        </button>
      </form>
    </div>
  );
}
