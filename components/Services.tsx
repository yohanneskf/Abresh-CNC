"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import {
  FiTool,
  FiCpu,
  FiSettings,
  FiTruck,
  FiCheckCircle,
  FiUsers,
  FiArrowRight,
  FiLayers,
  FiHexagon,
  FiTarget,
  FiActivity,
} from "react-icons/fi";
import Link from "next/link";
import { motion } from "framer-motion";

interface Service {
  icon: React.ReactNode;
  id: string;
  titleEn: string;
  titleAm: string;
  descriptionEn: string;
  descriptionAm: string;
  features: string[];
}

export default function Services() {
  const { language } = useLanguage();

  const services: Service[] = [
    {
      id: "MOD_01",
      icon: <FiTool className="h-6 w-6" />,
      titleEn: "CNC Furniture Design",
      titleAm: "CNC የዕቃ ንድፍ",
      descriptionEn:
        "Custom furniture design using advanced CNC technology for precision and perfection.",
      descriptionAm: "ብጁ የዕቃ ንድፍ የላቀ CNC ቴክኖሎጂ በመጠቀም ለትክክለኛነት እና ፍጹምነት።",
      features: ["3D Modeling", "Material Selection", "Precision Cutting"],
    },
    {
      id: "MOD_02",
      icon: <FiCpu className="h-6 w-6" />,
      titleEn: "3D Modeling & CAD",
      titleAm: "3D ሞዴሊንግ & CAD",
      descriptionEn:
        "Detailed 3D models and CAD drawings for perfect visualization before production.",
      descriptionAm: "ዝርዝር 3D ሞዴሎች እና CAD ስዕሎች ከማምረቻው በፊት ፍጹም የሆነ ምስላዊነት።",
      features: ["AutoCAD Designs", "3D Rendering", "Technical Drawings"],
    },
    {
      id: "MOD_03",
      icon: <FiSettings className="h-6 w-6" />,
      titleEn: "Custom Manufacturing",
      titleAm: "ብጁ ማምረቻ",
      descriptionEn:
        "From concept to creation, we manufacture custom pieces with industrial precision.",
      descriptionAm: "ከሃሳብ እስከ ፍጠራ፣ ብጁ ቁራጮችን በኢንዱስትሪ ትክክለኛነት እንሠራለን።",
      features: ["Prototype Development", "Bulk Production", "Quality Control"],
    },
    {
      id: "MOD_04",
      icon: <FiTruck className="h-6 w-6" />,
      titleEn: "Installation & Delivery",
      titleAm: "መጫን & አቅራቢያ",
      descriptionEn:
        "Professional installation and nationwide delivery of your custom furniture.",
      descriptionAm: "ሙያዊ መጫን እና በመላው ሀገር ያለው የብጁ ዕቃዎችዎ አቅራቢያ።",
      features: [
        "Professional Setup",
        "Nationwide Delivery",
        "Post-Installation Support",
      ],
    },
  ];

  const features = [
    {
      icon: <FiTarget />,
      textEn: "Precision CNC Technology",
      textAm: "ትክክለኛ CNC ቴክኖሎጂ",
    },
    {
      icon: <FiLayers />,
      textEn: "Quality Materials",
      textAm: "ጥራት ያላቸው ቁሳቁሶች",
    },
    {
      icon: <FiHexagon />,
      textEn: "Expert Craftsmanship",
      textAm: "ባለሙያ የሠራተኛነት",
    },
    { icon: <FiActivity />, textEn: "On-Time Delivery", textAm: "በጊዜ ማቅረብ" },
  ];

  return (
    <section className="relative py-32 bg-[#030712] text-white overflow-hidden selection:bg-blue-500/30">
      {/* 1. Industrial Background Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(37,99,235,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Module */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 border-l-2 border-blue-600 pl-8"
        >
          <div className="max-w-2xl">
            <span className="text-blue-500 font-mono text-[10px] font-black tracking-[0.5em] uppercase mb-4 block">
              Capabilities_Index_2024
            </span>
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase italic">
              Our_<span className="text-blue-600">Operations</span>
            </h2>
          </div>
          <div className="hidden md:block text-[10px] font-mono text-gray-600 text-right uppercase tracking-widest leading-relaxed">
            Systems_Active: 100%
            <br />
            Latent_Latency: 0.04ms
            <br />
            Protocol: Industrial_Standard
          </div>
        </motion.div>

        {/* Technical Capability Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-32">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-[#0a0a0b] border border-white/5 p-8 hover:border-blue-500/40 hover:bg-white/[0.02] transition-all duration-500"
            >
              {/* Module Identification */}
              <div className="flex justify-between items-start mb-10">
                <div className="text-blue-500 bg-blue-600/10 p-3 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  {service.icon}
                </div>
                <span className="text-[9px] font-mono text-gray-600 group-hover:text-blue-500/50 transition-colors">
                  {service.id}
                </span>
              </div>

              <h3 className="text-xl font-black mb-4 uppercase tracking-tight">
                {language === "en" ? service.titleEn : service.titleAm}
              </h3>

              <p className="text-gray-500 text-xs leading-relaxed mb-8 h-12 overflow-hidden">
                {language === "en"
                  ? service.descriptionEn
                  : service.descriptionAm}
              </p>

              <div className="space-y-2">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="h-[1px] w-3 bg-blue-600/30 group-hover:w-5 group-hover:bg-blue-600 transition-all" />
                    <span className="text-[10px] font-mono text-gray-400 group-hover:text-gray-200 uppercase tracking-tighter transition-colors">
                      {feature.replace(" ", "_")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Machined Corner Accent */}
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/10 group-hover:border-blue-500 transition-colors" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/10 group-hover:border-blue-500 transition-colors" />
            </motion.div>
          ))}
        </div>

        {/* Mission_Brief Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative bg-[#0a0a0b] border border-white/10 overflow-hidden"
        >
          {/* Scanning Beam Animation */}
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
          />

          <div className="grid lg:grid-cols-2">
            <div className="p-12 md:p-20 border-r border-white/5">
              <h3 className="text-3xl font-black mb-12 uppercase italic tracking-tighter">
                {language === "en" ? "Technical_Performance" : "ቴክኒካዊ ብቃት"}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {features.map((feature, index) => (
                  <div key={index} className="group flex items-start gap-4">
                    <div className="text-blue-500 mt-1">{feature.icon}</div>
                    <div>
                      <span className="text-[10px] font-black text-white uppercase tracking-widest block mb-1">
                        {language === "en" ? feature.textEn : feature.textAm}
                      </span>
                      <div className="w-8 h-[1px] bg-blue-600/30 group-hover:w-full transition-all duration-700" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-16">
                <Link
                  href="/contact"
                  className="group relative inline-flex items-center bg-blue-600 text-white px-10 py-5 transition-all hover:bg-blue-500"
                >
                  <span className="text-xs font-black uppercase tracking-[0.3em]">
                    {language === "en" ? "Initiate_Project" : "ፕሮጀክትዎን ይጀምሩ"}
                  </span>
                  <FiArrowRight className="ml-4 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                  {/* Geometric Accents */}
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400" />
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400" />
                </Link>
              </div>
            </div>

            {/* Visual Engineering Backdrop */}
            <div className="hidden lg:flex relative bg-white/[0.01] items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 grayscale" />

              <div className="relative z-10 text-center space-y-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <FiHexagon
                    size={120}
                    className="text-blue-500/20 stroke-[1px]"
                  />
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-5xl font-black text-white">100+</span>
                    <p className="text-[10px] font-mono text-blue-500 font-bold uppercase tracking-[0.3em]">
                      Units_Deployed
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid Coordinates Overlay */}
              <div className="absolute bottom-6 right-8 text-[9px] font-mono text-gray-700 space-y-1">
                <p>LNG: 38.7578° E</p>
                <p>LAT: 8.9806° N</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
