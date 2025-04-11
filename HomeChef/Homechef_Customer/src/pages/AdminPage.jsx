import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import api from "../api/api";
import { fetchRecipes, deleteRecipe  } from "../api/api"; // ✔️ אם יש פונקציה בשם הזה
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";


export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRes = await api.get("/admin/users");
        setUsers(usersRes.data);
      } catch (err) {
        console.error("Failed to load users:", err); // ✅ עכשיו err קיים
      } finally {
        setLoading(false);
      }
    };
    

    const fetchAllRecipes = async () => {
      const res = await fetchRecipes(); // לא שולחת term ולא קטגוריה
      setRecipes(res.data);
    };
    fetchAllRecipes();
    fetchUsers();
  }, [])
  

  const handleDeleteRecipe = async (id) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
  
    try {
      await deleteRecipe(id);
      setRecipes((prev) => prev.filter(r => r.recipeId !== id)); // הסרה מה-state
      toast.success("Recipe deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete recipe.");
    }
  };

  

  if (loading) return <div>Loading admin data...</div>;

  // עמודות לטבלת משתמשים
  const userColumns = [
    { name: "Email", selector: row => row.email, sortable: true },
    { name: "Username", selector: row => row.username, sortable: true },
    { name: "Is Admin", selector: row => (row.isAdmin ? "Yes" : "No") },
    { name: "Is Active", selector: row => (row.isActive ? "Yes" : "No") },
  ];

  // עמודות לטבלת מתכונים
  const recipeColumns = [
    { name: "Title", selector: row => row.title, sortable: true },
    { name: "Category", selector: row => row.categoryName },
    { name: "Cooking Time (min)", selector: row => row.cookingTime },
    { name: "Servings", selector: row => row.servings },
    {
      name: "Actions",
      cell: row => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => handleDeleteRecipe(row.recipeId)}
            className="text-red-600 hover:text-red-800"
          >
            <FaTrash />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true, // ✅ נשאר רק בעמודה – לא עובר לדום
    }
    
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Users</h2>
        <DataTable
          columns={userColumns}
          data={users}
          pagination
          highlightOnHover
          striped
        />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Recipes</h2>
        <DataTable
          title="Recipes"
          columns={recipeColumns}
          data={recipes}
          progressPending={loading}
          pagination
          
        />
      </section>

    </div>
  );
}
