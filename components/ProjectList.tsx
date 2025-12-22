"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEdit2,
  FiTrash2,
  FiEye,
  FiX,
  FiBox,
  FiStar,
  FiCpu,
  FiImage,
  FiLoader,
} from "react-icons/fi";

interface Project {
  id: string;
  titleEn: string;
  titleAm: string;
  category: string;
  materials: string[];
  featured: boolean;
  createdAt: string;
  images: string[];
}

interface ProjectListProps {
  projects: Project[];
  onUpdate: () => void; // Trigger a refresh in the parent dashboard
}

export default function ProjectList({ projects, onUpdate }: ProjectListProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const categories: Record<string, string> = {
    living: "Living_Area",
    bedroom: "Sleeping_Quarters",
    office: "Work_Station",
    commercial: "Business_Retail",
  };

  // --- PROTOCOL: PURGE ASSET ---
  async function deleteProject(id: string) {
    if (!confirm("CONFIRM_PERMANENT_ERASURE?")) return;

    setIsProcessing(id);
    try {
      const res = await fetch(`/api/projects?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) onUpdate();
    } catch (error) {
      console.error("ERASURE_FAILURE", error);
    } finally {
      setIsProcessing(null);
    }
  }

  // --- PROTOCOL: TOGGLE PRIORITY ---
  async function toggleFeatured(id: string, currentStatus: boolean) {
    setIsProcessing(id);
    try {
      // Note: We use the POST/PUT logic here to update the project status
      const res = await fetch(`/api/projects`, {
        method: "POST", // Adjust to PUT if your route specifically handles updates
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          featured: !currentStatus,
          updateOnly: true,
        }),
      });
      // Tip: If your current POST route only creates, you may need a separate
      // PATCH /api/projects route or handle 'updateOnly' in the route logic.
      if (res.ok) onUpdate();
    } catch (error) {
      console.error("PRIORITY_UPDATE_FAILURE", error);
    } finally {
      setIsProcessing(null);
    }
  }

  return (
    <div className="bg-[#0a0a0b] border border-white/10 overflow-hidden font-mono">
      {/* Module Header */}
      <div className="p-6 border-b border-white/10 bg-white/[0.02]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FiBox className="text-blue-500" />
            <h2 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">
              Asset_Inventory ({projects.length})
            </h2>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white/[0.02] border-b border-white/10">
            <tr>
              <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                Payload
              </th>
              <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                Designation
              </th>
              <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest text-center">
                Priority
              </th>
              <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest text-right">
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
                {/* Visual Thumbnail */}
                <td className="px-6 py-4">
                  <div className="w-12 h-12 bg-black border border-white/10 overflow-hidden">
                    {project.images?.[0] ? (
                      <img
                        src={project.images[0]}
                        alt="thumb"
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                      />
                    ) : (
                      <FiImage className="m-auto mt-3 text-gray-800" />
                    )}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="font-bold text-white text-sm uppercase">
                    {project.titleEn}
                  </div>
                  <div className="text-[10px] text-blue-500/50 uppercase tracking-tighter">
                    {categories[project.category] || project.category}
                  </div>
                </td>

                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => toggleFeatured(project.id, project.featured)}
                    disabled={isProcessing === project.id}
                    className={`p-2 border transition-all ${
                      project.featured
                        ? "bg-amber-500/10 border-amber-500/40 text-amber-500"
                        : "border-white/5 text-gray-700 hover:text-white"
                    }`}
                  >
                    <FiStar
                      className={project.featured ? "fill-current" : ""}
                      size={14}
                    />
                  </button>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="p-2 bg-white/5 border border-white/10 hover:border-blue-500 text-gray-500 hover:text-blue-500 transition-all"
                    >
                      <FiEye size={14} />
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="p-2 bg-white/5 border border-white/10 hover:border-red-500 text-gray-500 hover:text-red-500 transition-all"
                    >
                      {isProcessing === project.id ? (
                        <FiLoader className="animate-spin" />
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

      {/* Asset Inspection Modal (Displaying Full Images) */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-[#030712]/95 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl bg-[#0a0a0b] border border-white/10 rounded-sm overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <FiCpu className="text-blue-500" />
                  <h3 className="text-[10px] font-black text-white uppercase tracking-widest">
                    Asset_Data_Node: {selectedProject.id.slice(-8)}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="p-8 grid md:grid-cols-2 gap-8">
                {/* Images View */}
                <div className="space-y-4">
                  <div className="aspect-video bg-black border border-white/5 overflow-hidden">
                    {selectedProject.images?.[0] ? (
                      <img
                        src={selectedProject.images[0]}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-800 uppercase text-[10px]">
                        No_Visual_Data
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {selectedProject.images?.slice(1).map((img, i) => (
                      <div
                        key={i}
                        className="aspect-square border border-white/5 bg-black"
                      >
                        <img
                          src={img}
                          className="w-full h-full object-cover grayscale"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metadata View */}
                <div className="space-y-6">
                  <div>
                    <span className="text-[9px] text-gray-600 block mb-1">
                      DESIGNATION
                    </span>
                    <h2 className="text-2xl font-black text-white uppercase">
                      {selectedProject.titleEn}
                    </h2>
                    <p className="text-gray-400 font-amharic">
                      {selectedProject.titleAm}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/5 border border-white/5">
                      <span className="text-[8px] text-gray-600 block">
                        CLASSIFICATION
                      </span>
                      <span className="text-[10px] text-blue-400 font-black">
                        {categories[selectedProject.category] || "UNKNOWN"}
                      </span>
                    </div>
                    <div className="p-3 bg-white/5 border border-white/5">
                      <span className="text-[8px] text-gray-600 block">
                        PRIORITY
                      </span>
                      <span
                        className={`text-[10px] font-black ${
                          selectedProject.featured
                            ? "text-amber-500"
                            : "text-gray-500"
                        }`}
                      >
                        {selectedProject.featured ? "FEATURED_01" : "STANDARD"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] text-gray-600 block mb-2">
                      COMPOSITION_MATRIX
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.materials.map((m, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-[9px] bg-blue-600/10 border border-blue-500/20 text-blue-400"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
