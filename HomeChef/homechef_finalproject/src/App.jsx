import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home";
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
      <nav>
        <Link to="/">Home</Link> | <Link to="/favorites">Favorites</Link> |
        <Link to="/my-recipes">My Recipes</Link> |{" "}
        <Link to="/add-recipe">Add Recipe</Link> |<Link to="/cooks">Cooks</Link>{" "}
        | <Link to="/login">Login</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/my-recipes" element={<MyRecipes />} />
        <Route path="/add-recipe" element={<AddRecipe />} />
        <Route path="/meal/:id" element={<Meal />} /> {/* יטען מתכון לפי ID */}
        <Route path="/edit-recipe/:id" element={<EditRecipe />} />
        <Route path="/cooks" element={<Cooks />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />{" "}
        {/* דף ברירת מחדל לכתובות לא קיימות */}
      </Routes>
    </Router>
  );
}

export default App;
