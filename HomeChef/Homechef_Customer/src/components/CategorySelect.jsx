export default function CategorySelect({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) {
  return (
    <div className="mb-4 text-left">
      <label className="mr-2 text-lg text-gray-800 dark:text-white">
        Filter by Category:
      </label>
      <select
        value={selectedCategoryId ?? ""}
        onChange={(e) =>
          onSelectCategory(e.target.value ? Number(e.target.value) : null)
        }
        className="rounded-lg border bg-white px-4 py-2 dark:border-white dark:bg-gray-700 dark:text-white"
      >
        <option value="">All</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
}
