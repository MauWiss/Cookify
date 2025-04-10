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
      <div className="mt-20 flex flex-col items-center justify-center text-center text-xl text-red-600 dark:text-red-400">
        <h2 className="mb-2 text-3xl font-bold">404</h2>
        <p>{error}</p>
        <button
          className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          onClick={() => navigate("/")}
        >
          Go Home
        </button>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="mt-20 text-center text-xl text-gray-500 dark:text-gray-300">
        Loading recipe...
      </div>
    );
  }

  return (
    <div className="mx-auto mt-10 max-w-5xl rounded-3xl bg-white p-8 shadow-2xl transition dark:bg-gray-900 dark:shadow-gray-800">
      <button
        className="mb-6 text-blue-600 hover:underline dark:text-blue-400"
        onClick={() => navigate(-1)}
      >
        ← Back to Recipes
      </button>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full rounded-2xl shadow-md transition hover:scale-105"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {recipe.title}
          </h1>

          <div className="space-y-1 text-gray-600 dark:text-gray-300">
            <p>
              <strong>By:</strong> {recipe.publisher || "Unknown"}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(recipe.createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>Cuisine:</strong> {recipe.cuisine}
            </p>
            <p>
              <strong>Cooking Time:</strong> {recipe.cookingTime} minutes
            </p>
            <p>
              <strong>Servings:</strong> {recipe.servings}
            </p>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {recipe.vegetarian && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900 dark:text-green-200">
                Vegetarian
              </span>
            )}
            {recipe.vegan && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900 dark:text-amber-200">
                Vegan
              </span>
            )}
            {recipe.glutenFree && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                Gluten Free
              </span>
            )}
          </div>

          {recipe.sourceUrl && (
            <a
              href={recipe.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              View Original ↗
            </a>
          )}
        </div>
      </div>

      <div className="mt-10 space-y-6">
        <div className="prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold">Summary</h2>
          <div dangerouslySetInnerHTML={{ __html: recipe.summary }} />
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold">Instructions</h2>
          <pre className="whitespace-pre-wrap rounded-xl bg-gray-100 p-5 text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-100">
            {recipe.instructionsText}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default RecipeProfilePage;
