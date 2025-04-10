import React, { useState, useEffect } from "react";
import api from "../api/api";


const CategorySelect = () => {

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);


  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="mb-4 text-left">
      <label
        htmlFor="category"
        className="mb-1 block text-sm font-medium text-gray-800 dark:text-white"
      >
        Filter by Category:
      </label>
      <select
        id="category"
        value={selectedCategoryId}
        onChange={(e) => setSelectedCategoryId(e.target.value)}
        className="w-relative rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
      >
        <option value="">All</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>

    </div>
  );
};

export default CategorySelect;