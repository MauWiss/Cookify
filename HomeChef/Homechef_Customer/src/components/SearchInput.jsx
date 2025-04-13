import { FaSearch } from "react-icons/fa";

export default function SearchInput({ searchTerm, onSearchTermChange }) {
  return (
    <div className="bg-card dark:bg-card-dark border-border dark:border-border-dark mx-auto mb-8 flex max-w-xl items-center overflow-hidden rounded-xl border p-1 shadow-md">
      <input
        type="text"
        placeholder="Search for a recipe..."
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        className="text-text dark:text-text-dark placeholder-muted dark:placeholder-muted-dark flex-grow bg-transparent px-4 py-2 text-base font-semibold tracking-wide outline-none"
      />
      <FaSearch className="text-muted dark:text-muted-dark mx-3" />
    </div>
  );
}
