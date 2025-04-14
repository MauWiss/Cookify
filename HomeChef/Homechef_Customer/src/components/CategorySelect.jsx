import React, { useRef, useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import "../index.css";

export default function CategorySelect({
  categories,
  selectedCategoryId,
  onSelectCategory,
  categoryCounts,
}) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  return (
    <div className="relative my-6">
      {/* חץ שמאלה */}
      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-400"
        >
          <ChevronLeft />
        </button>
      )}

      {/* גלילה עם תוכן ממורכז */}
      <div className="relative my-6 pt-6 overflow-x-auto scrollbar-hide px-10" ref={scrollRef}>
        <div className="flex gap-6 w-max mx-auto">
          {/* כפתור 'All' */}
          <div
            onClick={() => onSelectCategory(null)}
            className="flex flex-col items-center cursor-pointer transition transform hover:scale-105 relative"
          >
            <div
              className={`w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold text-white shadow-md ${
                selectedCategoryId === null ? "ring-2 ring-blue-300" : ""
              }`}
            >
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
              className="flex flex-col items-center cursor-pointer transition transform hover:scale-105 relative"
            >
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className={`w-16 h-16 rounded-full object-cover shadow-md ${
                  selectedCategoryId === cat.id ? "ring-2 ring-blue-300" : ""
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
      </div>

      {/* חץ ימינה */}
      {canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-400"
        >
          <ChevronRight />
        </button>
      )}
    </div>
  );
}
