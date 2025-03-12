import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Homepage";
import Favorites from "./pages/Favorites";
import MyRecipes from "./pages/MyRecipes";
import AddRecipe from "./pages/AddRecipe";
import Meal from "./pages/Meal";
import EditRecipe from "./pages/EditRecipe";
import Cooks from "./pages/Cooks";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      {/* Sidebar */}
      <div className="flex min-h-screen">
        <div className="w-64 space-y-6 bg-gray-800 p-6 text-white">
          <h1 className="text-3xl font-bold text-yellow-500">HomeChef 🍽️</h1>
          <nav className="space-y-4">
            <Link to="/" className="block text-lg hover:text-yellow-400">
              Home
            </Link>
            <Link
              to="/favorites"
              className="block text-lg hover:text-yellow-400"
            >
              Favorites
            </Link>
            <Link
              to="/my-recipes"
              className="block text-lg hover:text-yellow-400"
            >
              My Recipes
            </Link>
            <Link
              to="/add-recipe"
              className="block text-lg hover:text-yellow-400"
            >
              Add Recipe
            </Link>
            <Link to="/cooks" className="block text-lg hover:text-yellow-400">
              Cooks
            </Link>
            <Link to="/login" className="block text-lg hover:text-yellow-400">
              Login
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-50 p-8">
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-green-600 to-green-400 py-20 text-center text-white">
            <h2 className="mb-4 text-5xl font-extrabold">
              Join the Best Cooking Community
            </h2>
            <p className="mb-6 text-lg">
              Discover amazing recipes, share your own, and cook like a pro!
            </p>
            <button className="rounded-lg bg-white px-6 py-3 text-green-600 shadow-lg transition hover:bg-gray-100">
              Get Started
            </button>
          </section>

          {/* Recipes Section */}
          <section className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Example Recipe Card */}
            <div className="overflow-hidden rounded-lg bg-white shadow-md transition hover:shadow-lg">
              <img
                src="https://source.unsplash.com/400x300/?pasta"
                alt="Recipe"
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="mb-2 text-xl font-semibold">
                  Spaghetti Carbonara
                </h3>
                <p className="mb-4 text-gray-600">
                  A creamy Italian pasta dish with crispy pancetta.
                </p>
                <button className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                  Add to Favorites
                </button>
              </div>
            </div>
            {/* אפשר להוסיף כרטיסים נוספים */}
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 py-6 text-center text-white">
        &copy; 2025 HomeChef. All rights reserved.
      </footer>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/my-recipes" element={<MyRecipes />} />
        <Route path="/add-recipe" element={<AddRecipe />} />
        <Route path="/meal/:id" element={<Meal />} />
        <Route path="/edit-recipe/:id" element={<EditRecipe />} />
        <Route path="/cooks" element={<Cooks />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
