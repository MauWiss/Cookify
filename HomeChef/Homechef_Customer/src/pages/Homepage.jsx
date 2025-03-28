import { useEffect, useState } from "react";

export default function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    // נתוני דמו עם תמונות שנבדקו
    const dummyRecipes = [
      {
        id: 1,
        title: "Spaghetti Bolognese",
        category: "Pasta",
        image:
          "https://images.immediate.co.uk/production/volatile/sites/30/2018/07/RedPepperAnchovySpaghetti-copy-1dec261.jpg",
      },
      {
        id: 2,
        title: "Avocado Toast",
        category: "Breakfast",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRc9AIvAc6dkD5GTVhVASi91F4Jc4n7AbOFhw&s",
      },
      {
        id: 3,
        title: "Vegan Buddha Bowl",
        category: "Vegan",
        image:
          "https://cdn.loveandlemons.com/wp-content/uploads/2020/06/IMG_25456.jpg",
      },
    ];
    setRecipes(dummyRecipes);
    setFiltered(dummyRecipes);
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      const f = recipes.filter((r) =>
        r.title.toLowerCase().includes(search.toLowerCase()),
      );
      setFiltered(f);
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

      {filtered.length === 0 ? (
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
                src={recipe.image}
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
