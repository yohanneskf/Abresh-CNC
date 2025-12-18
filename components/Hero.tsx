"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import {
  FiArrowRight,
  FiCpu,
  FiMaximize,
  FiTarget,
  FiActivity,
} from "react-icons/fi";
import { motion } from "framer-motion";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center bg-[#030712] overflow-hidden text-white selection:bg-blue-500/30">
      {/* 1. Deep Background & Scanning Lines */}
      <div className="absolute inset-0 bg-[#030712]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* 2. Radial Atmospheric Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(37,99,235,0.1),transparent_70%)]" />

      {/* 3. Floating Technical Elements (Decor) */}
      <div className="absolute top-24 left-10 hidden xl:block opacity-20">
        <div className="text-[10px] font-mono text-blue-500 space-y-1 tracking-tighter">
          <p>X_AXIS: 144.02</p>
          <p>Y_AXIS: 89.12</p>
          <p>Z_DEPTH: ACTIVE</p>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Mission Control */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center space-x-3 mb-8 px-4 py-2 bg-blue-600/5 border border-blue-500/20 rounded-sm">
              <FiActivity className="h-3 w-3 text-blue-500 animate-pulse" />
              <span className="text-[10px] font-black tracking-[0.4em] uppercase text-blue-500">
                System_Status: Operational
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter uppercase italic italic">
              {t("hero.title")
                .split(" ")
                .map((word, i) => (
                  <span
                    key={i}
                    className={
                      i % 2 === 0
                        ? "text-white"
                        : "text-blue-600 block md:inline"
                    }
                  >
                    {word}{" "}
                  </span>
                ))}
            </h1>

            <p className="text-lg md:text-xl text-gray-500 mb-12 max-w-xl leading-relaxed font-medium">
              <span className="text-blue-500/50 mr-2 font-mono">{"//"}</span>
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <Link
                href="/projects"
                className="group relative bg-blue-600 text-white px-10 py-5 overflow-hidden transition-all hover:bg-blue-500"
              >
                <div className="relative z-10 flex items-center justify-center space-x-4">
                  <span className="text-xs font-black uppercase tracking-[0.2em]">
                    {t("hero.cta")}
                  </span>
                  <FiArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                </div>
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/40" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/40" />
              </Link>

              <Link
                href="/contact"
                className="group px-10 py-5 bg-white/5 border border-white/10 text-white flex items-center justify-center transition-all hover:bg-white/10 hover:border-white/30"
              >
                <span className="text-xs font-black uppercase tracking-[0.2em]">
                  {t("hero.contact")}
                </span>
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Industrial Asset Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="lg:col-span-5 relative"
          >
            {/* Main Workpiece Image */}
            <div className="relative aspect-[4/5] bg-[#0a0a0b] border border-white/10 p-2 shadow-2xl group">
              <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-blue-600 opacity-50" />
              <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-blue-600 opacity-50" />

              <div className="relative h-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1000"
                  className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
                  alt="Industrial CNC"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-80" />

                {/* HUD Overlay in Image */}
                <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <FiTarget className="text-blue-500 h-3 w-3" />
                      <span className="text-[8px] font-mono text-blue-500 uppercase tracking-widest font-bold">
                        Target_Locked
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-400">
                      REF_ID: #4409-X
                    </span>
                  </div>
                  <FiMaximize className="text-white/20 h-4 w-4" />
                </div>

                <div className="absolute bottom-8 left-8">
                  <p className="text-blue-500 text-[10px] font-black tracking-[0.3em] uppercase mb-2">
                    Technical_Showcase
                  </p>
                  <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">
                    Precise_Geometry
                  </h3>
                </div>
              </div>
            </div>

            {/* Float Badge */}
            <div className="absolute -bottom-6 -left-6 bg-blue-600 p-6 hidden md:block">
              <FiCpu className="h-6 w-6 text-white mb-2" />
              <p className="text-[9px] font-black text-blue-100 uppercase tracking-widest leading-none">
                Automated
                <br />
                Fabrication
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
