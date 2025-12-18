"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import ProjectCard from "@/components/ProjectCard";
import ProjectFilter from "@/components/ProjectFilter";
import Link from "next/link";
import { FiArrowRight, FiLoader, FiInbox, FiAlertCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  id: string;
  titleEn: string;
  titleAm: string;
  descriptionEn: string;
  descriptionAm: string;
  category: string;
  materials: string[];
  images: string[];
  featured: boolean;
  dimensions?: {
    length?: string;
    width?: string;
    height?: string;
    unit?: string;
  };
}

export default function ProjectsPage() {
  const { language, t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/projects");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setProjects(data);
      setFilteredProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to load projects. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === "all") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter((p) => p.category === category));
    }
  };

  const categories = [
    { id: "all", label: t("projects.category.all") },
    { id: "living", label: t("projects.category.living") },
    { id: "bedroom", label: t("projects.category.bedroom") },
    { id: "office", label: t("projects.category.office") },
    { id: "commercial", label: t("projects.category.commercial") },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-24 pb-20 overflow-hidden relative">
      {/* NEW INDUSTRIAL BACKGROUND SYSTEM */}
      <div className="absolute inset-0 z-0">
        {/* 1. Subtle Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(37,99,235,0.1),_transparent_50%)]" />

        {/* 2. Engineering Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `linear-gradient(rgba(37, 99, 235, 0.2) 1px, transparent 1px), 
                              linear-gradient(90deg, rgba(37, 99, 235, 0.2) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* 3. Micro Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(rgba(37, 99, 235, 0.1) 1px, transparent 1px), 
                              linear-gradient(90deg, rgba(37, 99, 235, 0.1) 1px, transparent 1px)`,
            backgroundSize: "10px 10px",
          }}
        />

        {/* 4. Masking fade to bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030712]/80 to-[#030712]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-blue-500 font-bold tracking-[0.4em] uppercase text-[10px] mb-4 block">
            Technical Catalog
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            {t("projects.title")}
          </h1>
          <div className="w-16 h-1 bg-blue-600 mx-auto mb-6 shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {language === "en"
              ? "Discover the intersection of high-end industrial manufacturing and bespoke furniture design."
              : "የትክክለኛ CNC የዕቃ ንድፎቻችንን ፖርትፎሊዮ ያስሱ"}
          </p>
        </motion.div>

        {/* Filter Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <ProjectFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </motion.div>

        {/* Grid and States logic remains the same */}
        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 border border-blue-500/20 bg-blue-900/5 rounded-sm backdrop-blur-md"
            >
              <FiAlertCircle className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">System Interruption</h3>
              <p className="text-gray-400 mb-6">{error}</p>
              <button
                onClick={fetchProjects}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black transition-all rounded-sm uppercase text-xs tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.3)]"
              >
                Re-initialize
              </button>
            </motion.div>
          ) : loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32"
            >
              <div className="relative">
                <FiLoader className="h-16 w-16 text-blue-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#2563eb]"></div>
                </div>
              </div>
              <p className="mt-8 text-blue-500 font-mono text-[10px] tracking-[0.3em] uppercase">
                Synchronizing_Portfolio_Data...
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
              }}
            >
              {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {filteredProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <ProjectCard project={project} language={language} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 border border-white/5 bg-white/5 rounded-sm backdrop-blur-sm">
                  <FiInbox className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2 uppercase tracking-tighter">
                    Null_Set_Returned
                  </h3>
                  <button
                    onClick={() => handleCategoryChange("all")}
                    className="mt-4 text-blue-500 hover:text-blue-400 font-bold uppercase text-[10px] tracking-widest"
                  >
                    Reset Filter Parameters
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Section */}
        {!loading && !error && filteredProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-24 pt-12 border-t border-white/5"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
              {[
                { label: "Inventory", value: filteredProjects.length },
                {
                  label: "Classifications",
                  value: new Set(projects.map((p) => p.category)).size,
                },
                { label: "Precision", value: "0.01mm" },
                { label: "Machine", value: "CNC_V3" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-6 bg-white/5 border border-white/5 relative group"
                >
                  <div className="absolute top-0 left-0 w-1 h-0 bg-blue-600 group-hover:h-full transition-all duration-300" />
                  <div className="text-3xl font-black mb-1 group-hover:text-blue-500 transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-widest font-black">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
