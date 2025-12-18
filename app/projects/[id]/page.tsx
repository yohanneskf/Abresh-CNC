"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiShare2,
  FiCalendar,
  FiPackage,
  FiTool,
  FiDroplet,
  FiMessageSquare,
  FiTag,
  FiLoader,
  FiExternalLink,
  FiChevronLeft,
  FiChevronRight,
  FiAlertCircle,
} from "react-icons/fi";

// Swiper Styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

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
  const router = useRouter();
  const { language } = useLanguage();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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
            className="text-blue-500 font-bold uppercase text-xs tracking-[0.2em] flex items-center justify-center hover:gap-3 transition-all"
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
      {/* Background Aesthetic */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            href="/projects"
            className="inline-flex items-center text-gray-500 hover:text-blue-500 font-bold text-xs uppercase tracking-[0.2em] mb-12 transition-colors group"
          >
            <FiArrowLeft className="mr-3 group-hover:-translate-x-2 transition-transform" />
            {language === "en" ? "Back to Portfolio" : "ወደ ፕሮጀክቶች ተመለስ"}
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* LEFT: Image System (7 Columns) */}
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
                  className="w-full h-full"
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

              <button
                onClick={handleShare}
                className="absolute top-6 right-6 p-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-full hover:bg-blue-600 transition-all z-20"
              >
                <FiShare2 className="h-5 w-5 text-white" />
              </button>

              {/* Technical Overlay Decor */}
              <div className="absolute bottom-6 left-6 flex items-center gap-4 opacity-50">
                <div className="h-10 w-[1px] bg-blue-500" />
                <span className="text-[10px] font-mono uppercase tracking-tighter">
                  Render_Mode: Final_Draft
                </span>
              </div>
            </motion.div>

            {/* Thumbnails */}
            {project.images.length > 1 && (
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {project.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-square border-2 transition-all ${
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
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Specs Sidebar (5 Columns) */}
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
                <FiCalendar className="mr-2 text-blue-500" />
                LOG_DATE: {new Date(project.createdAt).toLocaleDateString()}
              </div>

              <div className="prose prose-invert prose-sm max-w-none text-gray-400 leading-relaxed mb-12">
                <p>{description}</p>
              </div>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-1 gap-4 mb-10">
                {project.dimensions && (
                  <div className="p-6 bg-white/5 border-l-2 border-blue-600 flex items-center justify-between group hover:bg-white/10 transition-colors">
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

                <div className="p-6 bg-white/5 border-l-2 border-gray-700 flex items-center justify-between group hover:bg-white/10 transition-colors">
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
                <button
                  onClick={handleShare}
                  className="px-8 border border-white/20 hover:border-white text-white py-5 rounded-full font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-3"
                >
                  <FiShare2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative Technical Grid Image */}
    </div>
  );
}
