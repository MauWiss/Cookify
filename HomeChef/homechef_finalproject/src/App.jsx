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
      {/* Navigation Bar */}
      <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-3xl font-bold text-green-600">HomeChef 🍽️</h1>
        <div className="space-x-8 text-lg">
          <Link to="/" className="hover:text-yellow-400">
            Home
          </Link>
          <Link to="/favorites" className="hover:text-yellow-400">
            Favorites
          </Link>
          <Link to="/my-recipes" className="hover:text-yellow-400">
            My Recipes
          </Link>
          <Link to="/add-recipe" className="hover:text-yellow-400">
            Add Recipe
          </Link>
          <Link to="/cooks" className="hover:text-yellow-400">
            Cooks
          </Link>
          <Link to="/login" className="hover:text-yellow-400">
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-400 text-white py-20 text-center">
        <h2 className="text-5xl font-extrabold mb-4">
          Join the Best Cooking Community
        </h2>
        <p className="text-lg mb-6">
          Discover amazing recipes, share your own, and cook like a pro!
        </p>
        <button className="bg-white text-green-600 px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition">
          Get Started
        </button>
      </section>

      {/* Main Content */}
      <main className="bg-gray-50 min-h-screen p-8">
        {/* Example Recipes Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {/* Example Recipe Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <img
              src="https://source.unsplash.com/400x300/?pasta"
              alt="Recipe"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">Spaghetti Carbonara</h3>
              <p className="text-gray-600 mb-4">
                A creamy Italian pasta dish with crispy pancetta.
              </p>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Add to Favorites
              </button>
            </div>
          </div>
          {/* אפשר להוסיף כרטיסים נוספים */}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-6">
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
