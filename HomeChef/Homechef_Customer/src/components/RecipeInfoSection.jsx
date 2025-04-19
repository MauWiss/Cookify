import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import RecipeRatingBlock from "../components/RecipeRatingBlock";
import IngredientExtractor from "../components/IngredientExtractor";
import {
  FaUser,
  FaCalendarAlt,
  FaGlobe,
  FaClock,
  FaUtensils,
} from "react-icons/fa";

const RecipeInfoSection = ({ recipe, ratingSummary }) => {
  const navigate = useNavigate();
  

  return (
    <>
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-text shadow-sm transition hover:bg-muted dark:border-border-dark dark:bg-card-dark dark:text-text-dark dark:hover:bg-muted-dark"
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
        <div className="space-y-5 rounded-3xl bg-profile p-6 shadow-md dark:bg-profile-dark">
          <h1 className="text-4xl font-bold text-text dark:text-text-dark">
            {recipe.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted dark:text-muted-dark">
            {recipe.publisher && (
              <div className="group relative flex items-center gap-2">
                <FaUser className="text-lg" />
                <span>{recipe.publisher}</span>
                <span className="invisible absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition group-hover:visible group-hover:opacity-100 dark:bg-gray-700">
                  Publisher
                </span>
              </div>
            )}

            <div className="group relative flex items-center gap-2">
              <FaCalendarAlt className="text-lg" />
              <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
              <span className="invisible absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition group-hover:visible group-hover:opacity-100 dark:bg-gray-700">
                Date
              </span>
            </div>

            {recipe.cookingTime > 0 && (
              <div className="group relative flex items-center gap-2">
                <FaClock className="text-lg" />
                <span>{recipe.cookingTime} min</span>
                <span className="invisible absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition group-hover:visible group-hover:opacity-100 dark:bg-gray-700">
                  Cooking Time
                </span>
              </div>
            )}

            {recipe.servings > 0 && (
              <div className="group relative flex items-center gap-2">
                <FaUtensils className="text-lg" />
                <span>{recipe.servings}</span>
                <span className="invisible absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition group-hover:visible group-hover:opacity-100 dark:bg-gray-700">
                  Servings
                </span>
              </div>
            )}
          </div>

          {/* Leave the rating as-is */}
          <RecipeRatingBlock recipeId={recipe.id} override={ratingSummary} />

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
              className="mt-6 inline-block text-sm font-medium text-primary hover:underline dark:text-primary-dark"
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
              <pre className="whitespace-pre-wrap rounded-xl border border-border bg-card p-5 text-sm text-text dark:border-border-dark dark:bg-card-dark dark:text-text-dark">
                {recipe.instructionsText}
              </pre>
            )}
          </div>
        )}
        <IngredientExtractor
          summary={recipe.summary}
          instructions={recipe.instructionsText}
        />
      </div>
    </>
  );
};

export default RecipeInfoSection;
