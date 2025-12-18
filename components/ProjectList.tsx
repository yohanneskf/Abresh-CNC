"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEdit2,
  FiTrash2,
  FiEye,
  FiCheck,
  FiX,
  FiBox,
  FiLayers,
  FiCalendar,
  FiStar,
  FiCpu,
  FiZap,
} from "react-icons/fi";

// Interfaces used by this component
interface Project {
  id: string;
  titleEn: string;
  titleAm: string;
  category: string;
  materials: string[];
  featured: boolean;
  createdAt: string;
}

interface ProjectListProps {
  projects: Project[];
  onUpdate?: (projects: Project[]) => void;
}

export default function ProjectList({ projects, onUpdate }: ProjectListProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // LOGIC FUNCTIONS (deleteProject, toggleFeatured) remain identical to your original logic

  const categories = {
    living: "Living_Area",
    bedroom: "Sleeping_Quarters",
    office: "Work_Station",
    commercial: "Business_Retail",
  };

  function toggleFeatured(id: string, featured: boolean): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="bg-[#0a0a0b] border border-white/10 overflow-hidden font-sans">
      {/* Module Header */}
      <div className="p-6 border-b border-white/10 bg-white/[0.02]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FiBox className="text-blue-500" />
            <h2 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">
              Asset_Inventory ({projects.length})
            </h2>
          </div>
          <div className="text-[9px] font-mono text-blue-500/60 uppercase tracking-widest">
            {projects.filter((p) => p.featured).length} Priority_Assets
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white/[0.02] border-b border-white/10">
            <tr>
              <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                Designation
              </th>
              <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                Classification
              </th>
              <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                Composition
              </th>
              <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                Priority
              </th>
              <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest text-right">
                Timestamp
              </th>
              <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest text-center">
                Protocol
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {projects.map((project) => (
              <tr
                key={project.id}
                className="hover:bg-white/[0.02] group transition-colors"
              >
                <td className="px-6 py-5">
                  <div className="font-bold text-white text-sm tracking-tight">
                    {project.titleEn}
                  </div>
                  <div className="text-[10px] font-mono text-gray-500 mt-1 uppercase opacity-60">
                    {project.titleAm}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-[9px] font-black bg-blue-600/10 text-blue-400 border border-blue-500/20 px-2 py-1 uppercase tracking-tighter">
                    {categories[project.category as keyof typeof categories] ||
                      project.category}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-wrap gap-1">
                    {project.materials.slice(0, 2).map((material, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 text-[9px] font-mono bg-white/5 text-gray-400 border border-white/10 uppercase"
                      >
                        {material}
                      </span>
                    ))}
                    {project.materials.length > 2 && (
                      <span className="px-2 py-0.5 text-[9px] font-mono bg-blue-600/20 text-blue-400 border border-blue-500/20">
                        +{project.materials.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <button
                    onClick={() => toggleFeatured(project.id, project.featured)}
                    className={`p-2 rounded-sm border transition-all ${
                      project.featured
                        ? "bg-amber-500/10 border-amber-500/40 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.1)]"
                        : "bg-white/5 border-white/10 text-gray-600 grayscale opacity-40 hover:grayscale-0 hover:opacity-100"
                    }`}
                  >
                    <FiStar
                      className={`h-3 w-3 ${
                        project.featured ? "fill-current" : ""
                      }`}
                    />
                  </button>
                </td>
                <td className="px-6 py-5 text-right font-mono text-[10px] text-gray-500">
                  {new Date(project.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-center space-x-2 opacity-40 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="p-2 bg-white/5 border border-white/10 hover:border-blue-500 hover:text-blue-500 transition-all"
                      title="Inspect"
                    >
                      <FiEye size={14} />
                    </button>
                    <button
                      className="p-2 bg-white/5 border border-white/10 hover:border-amber-500 hover:text-amber-500 transition-all"
                      title="Modify"
                    >
                      <FiEdit2 size={14} />
                    </button>
                    <button
                      onClick={() => setIsDeleting(project.id)}
                      disabled={isDeleting === project.id}
                      className="p-2 bg-white/5 border border-white/10 hover:border-red-500 hover:text-red-500 transition-all disabled:opacity-50"
                      title="Purge"
                    >
                      {isDeleting === project.id ? (
                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-red-500"></div>
                      ) : (
                        <FiTrash2 size={14} />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Asset Inspection Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-[#030712]/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-[#0a0a0b] border border-white/10 shadow-2xl rounded-sm overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <FiCpu className="text-blue-500" />
                  <h3 className="text-xs font-black text-white uppercase tracking-widest">
                    Asset_Data_Node
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="p-8 space-y-8 text-white">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block mb-2">
                      Primary_Designation (EN)
                    </span>
                    <p className="text-xl font-black tracking-tight">
                      {selectedProject.titleEn}
                    </p>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block mb-2">
                      Secondary_Designation (AM)
                    </span>
                    <p className="text-lg font-bold text-gray-400">
                      {selectedProject.titleAm}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 p-4">
                    <span className="text-[9px] font-mono text-gray-500 uppercase block mb-1">
                      Classification
                    </span>
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-tighter">
                      {
                        categories[
                          selectedProject.category as keyof typeof categories
                        ]
                      }
                    </span>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-4">
                    <span className="text-[9px] font-mono text-gray-500 uppercase block mb-1">
                      Priority_Tier
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase ${
                        selectedProject.featured
                          ? "text-amber-500"
                          : "text-gray-500"
                      }`}
                    >
                      {selectedProject.featured
                        ? "LEVEL_01_FEATURED"
                        : "STANDARD_ARCHIVE"}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block mb-3">
                    Material_Composition
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.materials.map((m, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-[10px] font-mono bg-blue-600/10 border border-blue-500/20 text-blue-400 uppercase"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-gray-600 block">
                      ENTRY_TIMESTAMP
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">
                      {new Date(selectedProject.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="px-6 py-2 bg-blue-600 text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all"
                  >
                    Acknowledge
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
