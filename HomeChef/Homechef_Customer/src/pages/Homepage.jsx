import { useEffect, useState } from "react";
import { api } from "../api";

export default function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await api.get("/NewRecipes");
        setRecipes(response.data);
        setFiltered(response.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      const filteredRecipes = recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(search.toLowerCase()),
      );
      setFiltered(filteredRecipes);
    }, 300);
    return () => clearTimeout(delay);
  }, [search, recipes]);

  return (
    <div className="space-y-6">
      <h1 className="text-center text-3xl font-bold text-gray-800 dark:text-white">
        Discover New Recipes 🍲
      </h1>

      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Search for a recipe..."
          className="w-full max-w-md rounded-md border border-gray-300 px-4 py-2 shadow focus:outline-none focus:ring focus:ring-teal-400 dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse overflow-hidden rounded-2xl bg-gray-300 dark:bg-gray-700"
            >
              <div className="h-48 w-full bg-gray-400 dark:bg-gray-600"></div>
              <div className="space-y-2 p-4">
                <div className="h-6 w-3/4 rounded bg-gray-500 dark:bg-gray-600"></div>
                <div className="h-4 rounded bg-gray-400 dark:bg-gray-500"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          No recipes found. Try another search or add a new recipe.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {filtered.map((recipe) => (
            <div
              key={recipe.id}
              className="overflow-hidden rounded-2xl bg-white shadow-lg transition hover:scale-[1.02] dark:bg-[#1d1d1d]"
            >
              <img
                src={
                  recipe.imageUrl ||
                  "https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg"
                }
                alt={recipe.title}
                className="h-48 w-full object-cover"
              />
              <div className="space-y-2 p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {recipe.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Category: {recipe.category}
                </p>
                <a
                  href={`/meal/${recipe.id}`}
                  className="mt-3 inline-block font-semibold text-indigo-500 hover:text-indigo-700"
                >
                  View Recipe →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
