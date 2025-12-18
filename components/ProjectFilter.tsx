"use client";

import { FiFilter } from "react-icons/fi";

interface Category {
  id: string;
  label: string;
}

interface ProjectFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function ProjectFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: ProjectFilterProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <FiFilter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Filter by Category
          </h3>
        </div>
        <span className="text-sm text-gray-500">
          {selectedCategory === "all" ? "All projects" : "Filtered"}
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
              selectedCategory === category.id
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}
