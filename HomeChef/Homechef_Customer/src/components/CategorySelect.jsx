import React, { useEffect, useState } from "react";
import { fetchCategories, fetchAllRecipes } from "../api/api"; // לוודא שהייבוא נכון

const CategorySelect = ({ selectedCategoryId, onSelectCategory }) => {
  const [categories, setCategories] = useState([]); // אחסון הקטגוריות
  const [recipes, setRecipes] = useState([]); // אחסון המתכונים
  const [totalRecipesCount, setTotalRecipesCount] = useState(0); // שדה חדש למספר המתכונים הכללי

  // שליפת קטגוריות מה-API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await fetchCategories(); // שליפה נכונה של הקטגוריות
        setCategories(data); // מאחסן את כל הקטגוריות
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    loadCategories();
  }, []);

  // שליפת מתכונים מה-API לפי קטגוריה או כל המתכונים
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        let data;
        if (selectedCategoryId === null) {
          // שליפה של כל המתכונים
          const allRecipes = await fetchAllRecipes();
          data = allRecipes.data;
          setTotalRecipesCount(data.length); // עדכון של מספר המתכונים הכלליים
        } else {
          // שליפה לפי קטגוריה
          data = await api.get(`/categories/${selectedCategoryId}/recipes`);
        }
        setRecipes(data); // מאחסן את המתכונים שנשלפו
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    loadRecipes();
  }, [selectedCategoryId]); // בודק אם קטגוריה נבחרה מחדש

  // תמונה ברירת מחדל למקרה שאין תמונה
  const defaultImage = "path/to/default-image.jpg"; // החלף בנתיב של התמונה ברירת המחדל

  return (
    <div className="mt-10 flex flex-wrap justify-center gap-6">
      {/* כפתור 'All' */}
      <div
        onClick={() => onSelectCategory(null)} // כאשר לוחצים על All
        className="flex transform cursor-pointer flex-col items-center transition hover:scale-105"
      >
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-full bg-gray-300 text-lg font-bold text-white shadow-md ${
            selectedCategoryId === null ? "ring-2 ring-blue-300" : ""
          }`}
        >
          All
        </div>
        <span className="mt-2 text-sm font-semibold text-gray-700 dark:text-white">
          {totalRecipesCount} Recipes
        </span>{" "}
        {/* מציג את מספר המתכונים הכללי */}
      </div>

      {/* קטגוריות עם מספר המתכונים */}
      {categories.map((cat) => (
        <div
          key={cat.id}
          onClick={() => onSelectCategory(cat.id)} // כאשר בוחרים קטגוריה
          className="flex transform cursor-pointer flex-col items-center transition hover:scale-105"
        >
          <img
            src={cat.imageUrl || defaultImage} // אם אין תמונה, הצג את התמונה ברירת המחדל
            alt={cat.name}
            className={`h-16 w-16 rounded-full object-cover shadow-md ${
              selectedCategoryId === cat.id ? "ring-2 ring-blue-300" : ""
            }`}
          />
          <span className="mt-2 text-sm font-semibold text-gray-700 dark:text-white">
            {cat.name}
          </span>
          <div className="mt-1 text-xs text-gray-500 dark:text-white">
            {cat.RecipeCount} recipes {/* מציג את מספר המתכונים */}
          </div>
        </div>
      ))}

      {/* הצגת המתכונים אם קטגוריה נבחרה */}
      <div className="mt-6">
        {recipes.map((recipe) => (
          <div key={recipe.RecipeId} className="flex flex-col items-center">
            <img
              src={recipe.ImageUrl || defaultImage}
              alt={recipe.Title}
              className="h-24 w-24 rounded-md object-cover shadow-md"
            />
            <span className="mt-2 text-sm">{recipe.Title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySelect;
