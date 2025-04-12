import React, { useEffect, useState } from "react";
import { fetchCategories, fetchAllRecipes } from "../api/api"; // לוודא שהייבוא 
import '../index.css';

export default function CategorySelect({
  categories,
  selectedCategoryId,
  onSelectCategory,
  categoryCounts
}) {
  return (
    <div className="flex flex-wrap justify-center gap-6 mt-10">
      {/* כפתור 'All' */}
      <div
        onClick={() => onSelectCategory(null)}
        className="flex flex-col items-center cursor-pointer transition transform hover:scale-105"
      >
        <div className={`w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold text-white shadow-md ${selectedCategoryId === null ? "ring-2 ring-blue-300" : ""
          }`}>
          All
        </div>
        {selectedCategoryId === null && (
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white shadow-md">
              {categoryCounts}
            </div>
          )}
        <span className="mt-2 text-sm font-semibold text-gray-700 dark:text-white">
          All
        </span>
      </div>

      {categories.map((cat) => (
        <div
          key={cat.id}
          onClick={() => onSelectCategory(cat.id)}
          className={`flex flex-col items-center cursor-pointer transition transform hover:scale-105 
          }`}
        >
          <img
            src={cat.imageUrl}
            alt={cat.name}
            className={`w-16 h-16 rounded-full object-cover shadow-md ${selectedCategoryId === cat.id ? "ring-2 ring-blue-300" : ""
              }`}
          />
          {selectedCategoryId === cat.id && (
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white shadow-md">
              {categoryCounts}
            </div>
          )}
          <span className="mt-2 text-sm font-semibold text-gray-700 dark:text-white">
            {cat.name}
          </span>
        </div>

      ))}

    </div>

  );
}
