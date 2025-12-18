"use client";

import Link from "next/link";
import Image from "next/image";
import { FiExternalLink, FiSettings, FiMaximize2 } from "react-icons/fi";
import { motion } from "framer-motion";

interface ProjectCardProps {
  project: {
    id: string;
    titleEn: string;
    titleAm: string;
    descriptionEn: string;
    descriptionAm: string;
    category: string;
    materials: string[];
    images: string[];
  };
  language: "en" | "am";
}

export default function ProjectCard({ project, language }: ProjectCardProps) {
  const title = language === "en" ? project.titleEn : project.titleAm;
  const description =
    language === "en"
      ? (project.descriptionEn?.substring(0, 80) || "") + "..."
      : (project.descriptionAm?.substring(0, 80) || "") + "...";

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group bg-[#16181d] border border-white/5 rounded-sm overflow-hidden transition-all duration-500 hover:border-blue-500/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
    >
      {/* Image Container with Technical Overlay */}
      <div className="relative h-72 overflow-hidden bg-black">
        {project.images && project.images[0] ? (
          <Image
            src={project.images[0]}
            alt={title}
            fill
            className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-in-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-[#1c1f26] flex items-center justify-center">
            <FiSettings className="h-12 w-12 text-gray-700 animate-spin-slow" />
          </div>
        )}

        {/* Blueprint Aesthetic Overlays */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute top-4 left-4 border-t border-l border-blue-500 w-4 h-4" />
          <div className="absolute bottom-4 right-4 border-b border-r border-blue-500 w-4 h-4" />
          <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-[2px]" />
        </div>

        {/* Category Badge - Industrial Label Style */}
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-black/80 backdrop-blur-md text-blue-400 border border-blue-500/30 px-3 py-1 text-[10px] font-black uppercase tracking-widest">
            {project.category}
          </span>
        </div>

        {/* Center Action Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          <div className="p-4 bg-blue-600 rounded-full shadow-xl">
            <FiMaximize2 className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 relative">
        {/* Subtle ID number for a catalog feel */}
        <span className="absolute top-6 right-6 font-mono text-[10px] text-gray-700">
          REF_{project.id.substring(0, 5).toUpperCase()}
        </span>

        <h3 className="text-xl font-black text-white mb-2 tracking-tight group-hover:text-blue-400 transition-colors">
          {title}
        </h3>

        <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">
          {description}
        </p>

        {/* Materials - Micro Labels */}
        <div className="flex flex-wrap gap-2 mb-8">
          {project.materials.slice(0, 3).map((material, index) => (
            <span
              key={index}
              className="border border-white/10 text-gray-400 px-2 py-1 text-[9px] uppercase font-bold tracking-tighter group-hover:border-blue-500/30 group-hover:text-gray-300 transition-colors"
            >
              {material}
            </span>
          ))}
          {project.materials.length > 3 && (
            <span className="text-gray-600 text-[9px] font-bold">
              +{project.materials.length - 3} MORE
            </span>
          )}
        </div>

        <Link
          href={`/projects/${project.id}`}
          className="relative flex items-center justify-between w-full group/btn overflow-hidden border border-white/10 px-4 py-4 transition-all duration-300 hover:border-blue-500"
        >
          {/* Button Background Animation */}
          <div className="absolute inset-0 w-0 bg-blue-600 transition-all duration-300 group-hover/btn:w-full" />

          <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.2em] text-white">
            {language === "en" ? "Technical Details" : "ዝርዝሮችን ይመልከቱ"}
          </span>
          <FiExternalLink className="relative z-10 h-4 w-4 text-gray-500 group-hover/btn:text-white transition-colors" />
        </Link>
      </div>
    </motion.div>
  );
}
