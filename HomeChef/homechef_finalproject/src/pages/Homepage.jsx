import { useState, useEffect } from "react";

const dummyRecipes = [
  {
    id: 1,
    title: "Spaghetti Bolognese",
    category: "Pasta",
    image: "https://source.unsplash.com/featured/?spaghetti",
  },
  {
    id: 2,
    title: "Chicken Caesar Salad",
    category: "Salad",
    image: "https://source.unsplash.com/featured/?salad",
  },
  {
    id: 3,
    title: "Vegan Buddha Bowl",
    category: "Vegan",
    image: "https://source.unsplash.com/featured/?bowl",
  },
];

export default function Homepage() {
  const [search, setSearch] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState(dummyRecipes);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const filtered = dummyRecipes.filter((r) =>
        r.title.toLowerCase().includes(search.toLowerCase()),
      );
      setFilteredRecipes(filtered);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <div className="space-y-6">
      <h1 className="text-center text-3xl font-bold text-gray-800 dark:text-white">
        Discover New Recipes 🍲
      </h1>

      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Search for a recipe..."
          className="w-full max-w-md rounded-md border border-gray-300 px-4 py-2 shadow focus:outline-none focus:ring focus:ring-blue-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredRecipes.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          No recipes found. Try another search or add a new recipe.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="overflow-hidden rounded-lg bg-white shadow transition hover:shadow-lg dark:bg-[#1d1d1d]"
            >
              <img
                src={recipe.image}
                alt={recipe.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {recipe.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Category: {recipe.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
