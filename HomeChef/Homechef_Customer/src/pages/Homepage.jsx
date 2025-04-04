import { useEffect, useState } from "react";
import api from "../api/api";
import { FaClock, FaUtensils } from "react-icons/fa";

export default function Homepage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await api.get(
          "/recipes/paged?pageNumber=1&pageSize=100",
        );
        setRecipes(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load recipes.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading)
    return (
      <div className="p-4 text-center text-lg text-gray-600 dark:text-gray-200">
        Loading recipes...
      </div>
    );
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 gap-6 px-6 py-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {recipes.map((recipe) => (
        <div
          key={recipe.id}
          className="overflow-hidden rounded-2xl bg-white shadow-lg transition duration-300 hover:shadow-2xl dark:bg-gray-800"
        >
          <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="h-48 w-full object-cover transition hover:opacity-90"
            />
          </a>
          <div className="space-y-2 p-4">
            <a
              href={recipe.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold transition hover:text-blue-500"
            >
              {recipe.title}
            </a>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {recipe.categoryName}
            </div>
            <div className="mt-1 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
              <span className="flex items-center gap-1">
                <FaClock /> {recipe.cookingTime} min
              </span>
              <span className="flex items-center gap-1">
                <FaUtensils /> Serves {recipe.servings}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
