"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import ProjectCard from "@/components/ProjectCard";
import Link from "next/link";
import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiLayers,
  FiCpu,
  FiMaximize2,
} from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";

// Swiper Styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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
}

export default function FeaturedProjects() {
  const { language } = useLanguage();
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProjects();
  }, []);

  const fetchFeaturedProjects = async () => {
    try {
      const response = await fetch("/api/projects/featured");
      const data = await response.json();
      setFeaturedProjects(data);
    } catch (error) {
      console.error("Error fetching featured projects:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 bg-[#030712]">
        <div className="relative w-20 h-20 mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-t-2 border-r-2 border-blue-600 rounded-sm"
          />
          <FiCpu
            className="absolute inset-0 m-auto text-blue-600 animate-pulse"
            size={24}
          />
        </div>
        <span className="text-[10px] font-mono text-blue-500 uppercase tracking-[0.4em]">
          Initializing_Feed...
        </span>
      </div>
    );
  }

  if (featuredProjects.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative py-24 bg-[#030712] overflow-hidden"
    >
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Section Header: Command Console Style */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-l-2 border-blue-600 pl-8">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <FiLayers className="text-blue-500" />
              <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em]">
                System_Portfolio_v2.0
              </span>
            </div>
            <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic">
              Featured_<span className="text-blue-600">Assets</span>
            </h3>
            <p className="text-gray-500 mt-6 text-lg font-medium max-w-lg leading-relaxed">
              Real-time monitoring of our latest high-precision fabrications.
              Architectural integrity meets algorithmic perfection.
            </p>
          </div>

          <Link
            href="/projects"
            className="group relative px-8 py-4 bg-white/5 border border-white/10 overflow-hidden"
          >
            <div className="relative z-10 flex items-center space-x-4">
              <span className="text-white text-[11px] font-black uppercase tracking-widest">
                Access_Full_Archive
              </span>
              <FiArrowRight className="text-blue-500 group-hover:translate-x-2 transition-transform" />
            </div>
            <motion.div
              whileHover={{ x: "100%" }}
              className="absolute inset-0 bg-blue-600/10 -translate-x-full transition-transform duration-500"
            />
          </Link>
        </div>
      </div>

      {/* Slider Container: High-Density Interface */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 group/slider">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={40}
          slidesPerView={1}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          pagination={{
            clickable: true,
            el: ".custom-pagination",
          }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1280: { slidesPerView: 3 },
          }}
          className="featured-swiper !pb-20"
        >
          {featuredProjects.map((project, index) => (
            <SwiperSlide key={project.id}>
              <div className="relative border border-white/5 bg-white/[0.02] p-4 group/card hover:border-blue-500/50 transition-colors duration-500">
                {/* Technical Card Header */}
                <div className="flex justify-between items-center mb-4 px-2">
                  <span className="text-[9px] font-mono text-blue-500/50">
                    DATA_SET: 0{index + 1}
                  </span>
                  <FiMaximize2
                    className="text-white/20 group-hover/card:text-blue-500 transition-colors"
                    size={12}
                  />
                </div>

                <ProjectCard project={project} language={language} />

                {/* Bottom Scanning Bar */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600/10 overflow-hidden">
                  <motion.div
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-1/3 h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation & Controls */}
        <div className="flex items-center justify-between mt-8 border-t border-white/5 pt-8">
          <div className="custom-pagination flex gap-2" />

          <div className="flex gap-4">
            <button className="custom-prev bg-white/5 p-4 border border-white/10 text-white hover:bg-blue-600 hover:border-blue-600 transition-all">
              <FiChevronLeft size={20} />
            </button>
            <button className="custom-next bg-white/5 p-4 border border-white/10 text-white hover:bg-blue-600 hover:border-blue-600 transition-all">
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-pagination .swiper-pagination-bullet {
          width: 40px;
          height: 2px;
          border-radius: 0;
          background: rgba(255, 255, 255, 0.1);
          opacity: 1;
          margin: 0 !important;
          transition: all 0.5s;
        }
        .custom-pagination .swiper-pagination-bullet-active {
          background: #2563eb;
          box-shadow: 0 0 10px rgba(37, 99, 235, 0.5);
        }
      `}</style>
    </motion.div>
  );
}
