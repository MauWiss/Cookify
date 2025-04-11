import { useEffect, useState } from "react";
import api from "../api/api"; 

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, recipesRes] = await Promise.all([
          api.get("/admin/users"),
          api.get("/admin/recipes"),
        ]);
        setUsers(usersRes.data);
        setRecipes(recipesRes.data);
      } catch (err) {
        console.error("Failed to load admin data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading admin data...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Users</h2>
        <ul className="bg-gray-100 p-4 rounded shadow-sm">
          {users.map((user) => (
            <li key={user.id} className="border-b py-2">{user.email}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Recipes</h2>
        <ul className="bg-gray-100 p-4 rounded shadow-sm">
          {recipes.map((recipe) => (
            <li key={recipe.id} className="border-b py-2">{recipe.title}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
