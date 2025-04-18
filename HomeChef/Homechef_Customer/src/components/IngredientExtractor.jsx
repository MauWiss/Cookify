// src/components/IngredientExtractor.jsx
import React, { useState } from "react";
import { extractIngredients } from "../api/api"; // ✅ using shared api

const IngredientExtractor = ({ summary, instructions }) => {
  const [ingredients, setIngredients] = useState("");
  const [loading, setLoading] = useState(false);
  const [servings, setServings] = useState(4); // default to 4

  const handleExtract = async () => {
    setLoading(true);
    try {
      const response = await extractIngredients(summary, instructions, servings);
      setIngredients(response.data.ingredients);
    } catch (error) {
      console.error("Error extracting ingredients:", error);
      setIngredients("Failed to extract ingredients.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium dark:text-white">
          Number of servings:
        </label>
        <input
          type="number"
          min={1}
          max={20}
          value={servings}
          onChange={(e) => setServings(Number(e.target.value))}
          className="w-24 rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
      </div>

      <button
        onClick={handleExtract}
        className="rounded-lg bg-primary px-4 py-2 text-white transition hover:bg-primary-dark"
      >
        {loading ? "Extracting..." : "Get Ingredients"}
      </button>

      {ingredients && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Extracted Ingredients</h3>
          <textarea
            className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            rows={24}
            readOnly
            value={ingredients}
          />
        </div>
      )}
    </div>
  );
};

export default IngredientExtractor;
