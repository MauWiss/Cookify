import { FaSearch } from "react-icons/fa";

export default function SearchInput({ searchTerm, onSearchTermChange }) {
  return (
    <div className="mx-auto mb-8 flex max-w-xl items-center overflow-hidden rounded-xl bg-gray-100 p-1 shadow-md dark:bg-gray-800">
      <input
        type="text"
        placeholder="Search for a recipe..."
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        className="flex-grow bg-transparent px-4 py-2 text-base font-semibold tracking-wide text-gray-800 placeholder-gray-700 outline-none dark:text-white dark:placeholder-gray-300"
      />
      <FaSearch className="mx-3 text-gray-400" />
    </div>
  );
}
