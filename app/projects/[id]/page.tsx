"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiShare2,
  FiCalendar,
  FiPackage,
  FiDroplet,
  FiMessageSquare,
  FiLoader,
  FiAlertCircle,
  FiDownload,
  FiMaximize2,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

/* ... Interfaces remain same ... */
interface Project {
  id: string;
  titleEn: string;
  titleAm: string;
  descriptionEn: string;
  descriptionAm: string;
  category: string;
  materials: string[];
  dimensions?: {
    length?: string;
    width?: string;
    height?: string;
    unit?: string;
  };
  images: string[];
  featured: boolean;
  createdAt: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const { language } = useLanguage();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const projectId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (projectId) fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error("Project not found");
      const data = await response.json();
      setProject(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Protocol: Download Image
  const handleDownload = async (imgUrl: string, index: number) => {
    try {
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${project?.titleEn.replace(/\s+/g, "_")}_View_${
        index + 1
      }.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project?.titleEn,
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center">
        <FiLoader className="h-12 w-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-mono text-xs tracking-widest uppercase">
          Initializing_Project_Data...
        </p>
      </div>
    );
  }

  if (error || !project)
    return (
      <div className="min-h-screen bg-[#0a0a0b] text-white flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <FiAlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-black mb-4 uppercase tracking-tighter">
            Project Not Found
          </h2>
          <Link
            href="/projects"
            className="text-blue-500 font-bold uppercase text-xs tracking-[0.2em] flex items-center justify-center"
          >
            <FiArrowLeft className="mr-2" /> Return to Catalog
          </Link>
        </div>
      </div>
    );

  const title = language === "en" ? project.titleEn : project.titleAm;
  const description =
    language === "en" ? project.descriptionEn : project.descriptionAm;

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white pt-24 pb-12 overflow-hidden relative">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            href="/projects"
            className="inline-flex items-center text-gray-500 hover:text-blue-500 font-bold text-xs uppercase tracking-[0.2em] mb-12 group"
          >
            <FiArrowLeft className="mr-3 group-hover:-translate-x-2 transition-transform" />
            {language === "en" ? "Back to Portfolio" : "ወደ ፕሮጀክቶች ተመለስ"}
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* LEFT: Image System */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square md:aspect-[4/3] bg-white/5 border border-white/10 rounded-sm overflow-hidden group shadow-2xl"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full cursor-zoom-in"
                  onClick={() => setIsFullscreen(true)}
                >
                  <Image
                    src={project.images[activeImageIndex]}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Action Floating Buttons */}
              <div className="absolute top-6 right-6 flex flex-col gap-3 z-20">
                <button
                  onClick={handleShare}
                  className="p-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-full hover:bg-blue-600 transition-all shadow-lg"
                  title="Share Project"
                >
                  <FiShare2 className="h-5 w-5 text-white" />
                </button>
                <button
                  onClick={() =>
                    handleDownload(
                      project.images[activeImageIndex],
                      activeImageIndex
                    )
                  }
                  className="p-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-full hover:bg-green-600 transition-all shadow-lg"
                  title="Download View"
                >
                  <FiDownload className="h-5 w-5 text-white" />
                </button>
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="p-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-full hover:bg-white hover:text-black transition-all shadow-lg"
                  title="Expand View"
                >
                  <FiMaximize2 className="h-5 w-5" />
                </button>
              </div>

              <div className="absolute bottom-6 left-6 flex items-center gap-4 opacity-50">
                <div className="h-10 w-[1px] bg-blue-500" />
                <span className="text-[10px] font-mono uppercase tracking-tighter">
                  View_Archive: {activeImageIndex + 1} / {project.images.length}
                </span>
              </div>
            </motion.div>

            {/* Thumbnails with Hover Download */}
            {project.images.length > 1 && (
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {project.images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <button
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-full aspect-square border-2 transition-all overflow-hidden ${
                        activeImageIndex === idx
                          ? "border-blue-600"
                          : "border-white/10 opacity-50 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt="Thumbnail"
                        fill
                        className="object-cover"
                      />
                    </button>
                    <button
                      onClick={() => handleDownload(img, idx)}
                      className="absolute bottom-1 right-1 p-1 bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-sm border border-white/10"
                    >
                      <FiDownload size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Specs Sidebar */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1">
                  {project.category}
                </span>
                {project.featured && (
                  <span className="border border-yellow-500/50 text-yellow-500 text-[10px] font-black uppercase tracking-widest px-3 py-1">
                    Featured Work
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter uppercase leading-tight">
                {title}
              </h1>

              <div className="flex items-center text-gray-500 text-xs font-mono mb-10">
                <FiCalendar className="mr-2 text-blue-500" /> LOG_DATE:{" "}
                {new Date(project.createdAt).toLocaleDateString()}
              </div>

              <div className="prose prose-invert prose-sm max-w-none text-gray-400 leading-relaxed mb-12">
                <p>{description}</p>
              </div>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-1 gap-4 mb-10">
                {project.dimensions && (
                  <div className="p-6 bg-white/5 border-l-2 border-blue-600 flex items-center justify-between hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <FiPackage className="text-blue-500 h-5 w-5" />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">
                        Dimensions
                      </span>
                    </div>
                    <span className="font-mono text-sm">
                      {project.dimensions.length} × {project.dimensions.width} ×{" "}
                      {project.dimensions.height} {project.dimensions.unit}
                    </span>
                  </div>
                )}
                <div className="p-6 bg-white/5 border-l-2 border-gray-700 flex items-center justify-between hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <FiDroplet className="text-blue-500 h-5 w-5" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">
                      Finish
                    </span>
                  </div>
                  <span className="font-mono text-sm uppercase">
                    Matte Industrial Lacquer
                  </span>
                </div>
              </div>

              {/* Materials List */}
              <div className="mb-12">
                <h4 className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-500 mb-4">
                  Material Selection
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.materials.map((m, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-gray-900 border border-white/10 text-xs font-medium hover:border-blue-500 transition-colors"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-white/5">
                <Link
                  href="/contact"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-full font-black uppercase text-xs tracking-widest transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] flex items-center justify-center gap-3"
                >
                  <FiMessageSquare className="h-4 w-4" />
                  {language === "en" ? "Request Quote" : "ዋጋ ይጠይቁ"}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX SYSTEM */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-12"
          >
            {/* Top Bar */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-[110]">
              <div className="font-mono text-[10px] tracking-widest text-white/50 uppercase">
                Image_Inspector // View_{activeImageIndex + 1}
              </div>
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-4 text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <FiX size={28} />
              </button>
            </div>

            {/* Navigation Controls */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 p-4 text-white/40 hover:text-white transition-colors z-[110]"
              onClick={() =>
                setActiveImageIndex((prev) =>
                  prev > 0 ? prev - 1 : project.images.length - 1
                )
              }
            >
              <FiChevronLeft size={48} />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 p-4 text-white/40 hover:text-white transition-colors z-[110]"
              onClick={() =>
                setActiveImageIndex((prev) =>
                  prev < project.images.length - 1 ? prev + 1 : 0
                )
              }
            >
              <FiChevronRight size={48} />
            </button>

            {/* Image Stage */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full h-full max-w-6xl max-h-[80vh]"
            >
              <Image
                src={project.images[activeImageIndex]}
                alt="Fullscreen View"
                fill
                className="object-contain"
                quality={100}
                priority
              />
            </motion.div>

            {/* Bottom Actions */}
            <div className="absolute bottom-8 flex gap-6 z-[110]">
              <button
                onClick={() =>
                  handleDownload(
                    project.images[activeImageIndex],
                    activeImageIndex
                  )
                }
                className="px-12 py-4 bg-white text-black font-black uppercase text-xs tracking-widest flex items-center gap-3 hover:bg-blue-600 hover:text-white transition-all"
              >
                <FiDownload /> Download_High_Res
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
