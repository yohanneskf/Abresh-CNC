"use client";

import { FiFilter, FiActivity, FiTarget } from "react-icons/fi";
import { motion } from "framer-motion";

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
    <div className="mb-16 space-y-6">
      {/* Header with System Status */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiFilter className="h-4 w-4 text-blue-500" />
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full blur-[2px]"
            />
          </div>
          <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">
            Filter_Logic_Module
          </h3>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FiActivity className="text-gray-600 h-3 w-3" />
            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
              Status:{" "}
              {selectedCategory === "all" ? "Wide_Scan" : "Narrow_Focus"}
            </span>
          </div>
        </div>
      </div>

      {/* Industrial Tab Selector */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category, index) => {
          const isActive = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className="group relative"
            >
              <div
                className={`
                relative flex items-center gap-3 px-6 py-3 transition-all duration-300
                border rounded-sm overflow-hidden
                ${
                  isActive
                    ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                    : "bg-white/5 border-white/10 text-gray-500 hover:border-white/30 hover:text-gray-300"
                }
              `}
              >
                {/* Index Number */}
                <span
                  className={`text-[8px] font-mono font-bold ${
                    isActive ? "text-blue-200" : "text-gray-600"
                  }`}
                >
                  0{index + 1}
                </span>

                {/* Label */}
                <span className="text-[11px] font-black uppercase tracking-widest">
                  {category.label.replace(" ", "_")}
                </span>

                {/* Corner Accent (only visible on active or hover) */}
                <div
                  className={`
                  absolute top-0 right-0 w-2 h-2 border-t border-r transition-opacity
                  ${
                    isActive
                      ? "border-white opacity-100"
                      : "border-blue-500 opacity-0 group-hover:opacity-100"
                  }
                `}
                />
              </div>

              {/* Active Underline Glow */}
              {isActive && (
                <motion.div
                  layoutId="activeGlow"
                  className="absolute -bottom-1 left-2 right-2 h-[2px] bg-blue-400 blur-[1px]"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
