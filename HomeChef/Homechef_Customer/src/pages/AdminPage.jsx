// src/pages/AdminPage.jsx
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import api, { deleteRecipe } from "../api/api";
import { useRecipesData } from "../hooks/useRecipesData";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const {
    recipes,
    totalCount,
    page,
    setPage,
    loadRecipes
  } = useRecipesData();

  useEffect(() => {
    loadRecipes("", null, page); // initial recipe load
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users:", err);
      toast.error("Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleDeleteRecipe = async (id) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;

    try {
      await deleteRecipe(id);
      toast.success("Recipe deleted!");
      loadRecipes("", null, page); // reload current page
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete recipe");
    }
  };

  const userColumns = [
    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "Username", selector: (row) => row.username, sortable: true },
    {
      name: "Is Admin",
      selector: (row) => (row.isAdmin ? "Yes" : "No"),
      sortable: true
    },
    {
      name: "Is Active",
      selector: (row) => (row.isActive ? "Yes" : "No"),
      sortable: true
    }
  ];

  const recipeColumns = [
    { name: "Title", selector: (row) => row.title, sortable: true },
    { name: "Category", selector: (row) => row.categoryName },
    { name: "Cooking Time", selector: (row) => `${row.cookingTime} min` },
    { name: "Servings", selector: (row) => row.servings },
    {
      name: "Actions",
      cell: (row) => (
        <button
          onClick={() => handleDeleteRecipe(row.recipeId)}
          className="text-red-600 hover:text-red-800"
        >
          <FaTrash />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true
    }
  ];

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Admin Dashboard</h1>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold">Users</h2>
        <DataTable
          columns={userColumns}
          data={users}
          progressPending={loadingUsers}
          pagination
          striped
          highlightOnHover
        />
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Recipes</h2>
        <DataTable
          columns={recipeColumns}
          data={recipes}
          pagination
          paginationServer
          paginationTotalRows={totalCount}
          onChangePage={handlePageChange}
          striped
          highlightOnHover
        />
      </section>
    </div>
  );
}
