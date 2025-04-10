import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

const RecipeProfilePage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/recipes/profile/${id}`)
      .then((res) => setRecipe(res.data))
      .catch(() => setError("Recipe not found"));
  }, [id]);

  if (error) {
    return (
      <div className="mt-10 text-center text-xl text-red-500">{error}</div>
    );
  }

  if (!recipe) {
    return (
      <div className="mt-10 text-center text-xl text-gray-500 dark:text-gray-300">
        Loading...
      </div>
    );
  }

  return (
    <div className="mx-auto mt-10 max-w-4xl rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-900">
      <button
        className="mb-6 text-blue-600 hover:underline dark:text-blue-400"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
        {recipe.title}
      </h1>

      <img
        src={recipe.imageUrl}
        alt={recipe.title}
        className="mb-6 w-full rounded-xl shadow-md"
      />

      <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        <p>
          <strong>Published by:</strong> {recipe.publisher || "Unknown"}
        </p>
        <p>
          <strong>Created on:</strong>{" "}
          {new Date(recipe.createdAt).toLocaleDateString()}
        </p>
        <p>
          <strong>Cuisine:</strong> {recipe.cuisine}
        </p>
        <p>
          <strong>Servings:</strong> {recipe.servings}
        </p>
        <p>
          <strong>Cooking Time:</strong> {recipe.cookingTime} minutes
        </p>
        <p>
          <strong>Vegetarian:</strong> {recipe.vegetarian ? "Yes" : "No"}
        </p>
        <p>
          <strong>Vegan:</strong> {recipe.vegan ? "Yes" : "No"}
        </p>
        <p>
          <strong>Gluten Free:</strong> {recipe.glutenFree ? "Yes" : "No"}
        </p>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <h2>Summary</h2>
        <div dangerouslySetInnerHTML={{ __html: recipe.summary }} />

        <h2 className="mt-6">Instructions</h2>
        <pre className="whitespace-pre-wrap rounded bg-gray-100 p-4 text-sm dark:bg-gray-800">
          {recipe.instructionsText}
        </pre>
      </div>

      {recipe.sourceUrl && (
        <a
          href={recipe.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block text-blue-600 hover:underline dark:text-blue-400"
        >
          View Original Recipe ↗
        </a>
      )}
    </div>
  );
};

export default RecipeProfilePage;
