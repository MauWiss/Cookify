import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const RecipeInfoSection = ({ recipe }) => {
  const navigate = useNavigate();

  return (
    <>
      <button
        onClick={() => navigate(-1)}
        className="bg-card dark:bg-card-dark text-text dark:text-text-dark border-border dark:border-border-dark hover:bg-muted dark:hover:bg-muted-dark mb-6 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium shadow-sm transition"
      >
        <FaArrowLeft className="text-md" />
        Back to Recipes
      </button>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {/* תמונה */}
        <div className="overflow-hidden rounded-3xl shadow-md">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="h-full w-full object-cover transition duration-300 hover:scale-105"
          />
        </div>

        {/* כרטיס פרופיל */}
        <div className="bg-profile dark:bg-profile-dark space-y-5 rounded-3xl p-6 shadow-md">
          <h1 className="text-text dark:text-text-dark text-4xl font-bold">
            {recipe.title}
          </h1>

          <div className="text-muted dark:text-muted-dark space-y-2">
            {recipe.publisher && (
              <p>
                <strong>Published by:</strong> {recipe.publisher}
              </p>
            )}
            <p>
              <strong>Date:</strong>{" "}
              {new Date(recipe.createdAt).toLocaleDateString()}
            </p>
            {recipe.cuisine && (
              <p>
                <strong>Cuisine:</strong> {recipe.cuisine}
              </p>
            )}
            {recipe.cookingTime > 0 && (
              <p>
                <strong>Cooking Time:</strong> {recipe.cookingTime} min
              </p>
            )}
            {recipe.servings > 0 && (
              <p>
                <strong>Servings:</strong> {recipe.servings}
              </p>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {recipe.vegetarian && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-900 dark:text-green-200">
                Vegetarian
              </span>
            )}
            {recipe.vegan && (
              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                Vegan
              </span>
            )}
            {recipe.glutenFree && (
              <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800 dark:bg-sky-900 dark:text-sky-200">
                Gluten Free
              </span>
            )}
          </div>

          {recipe.sourceUrl && (
            <a
              href={recipe.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary dark:text-primary-dark mt-6 inline-block text-sm font-medium hover:underline"
            >
              View Original ↗
            </a>
          )}
        </div>
      </div>

      <div className="mt-12 space-y-10">
        {recipe.summary && (
          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold">Summary</h2>
            <div dangerouslySetInnerHTML={{ __html: recipe.summary }} />
          </div>
        )}

        {recipe.instructionsText && (
          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold">Instructions</h2>
            {recipe.instructionsText.includes("<li>") ? (
              <div
                className="space-y-1"
                dangerouslySetInnerHTML={{
                  __html: recipe.instructionsText,
                }}
              />
            ) : (
              <pre className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark whitespace-pre-wrap rounded-xl border p-5 text-sm">
                {recipe.instructionsText}
              </pre>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default RecipeInfoSection;
