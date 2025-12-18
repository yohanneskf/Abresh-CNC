"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { FiMenu, FiX, FiGlobe, FiCpu, FiHash } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  const navItems = [
    { key: "nav.home", href: "/", id: "01" },
    { key: "nav.projects", href: "/projects", id: "02" },
    { key: "nav.about", href: "/about", id: "03" },
    { key: "nav.contact", href: "/contact", id: "04" },
    { key: "nav.admin", href: "/admin/login", id: "05" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/10 bg-[#030712]/80 backdrop-blur-xl">
      {/* HUD Scanning Line Effect */}
      <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent shadow-[0_0_10px_#3b82f6]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo with Technical Accents */}
          <Link href="/" className="group flex items-center gap-2">
            <div className="relative flex items-center justify-center w-10 h-10 border border-blue-500/30 group-hover:border-blue-500 transition-colors">
              <FiCpu className="text-blue-500 group-hover:rotate-90 transition-transform duration-500" />
              <div className="absolute -top-1 -left-1 w-1 h-1 bg-blue-500" />
              <div className="absolute -bottom-1 -right-1 w-1 h-1 bg-blue-500" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase italic">
              CNC<span className="text-blue-500 not-italic">_DESIGN</span>
            </span>
          </Link>

          {/* Desktop Navigation: Technical Data Look */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="relative px-4 py-2 group overflow-hidden"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-blue-500/50 group-hover:text-blue-400">
                    {item.id}
                  </span>
                  <span className="text-[11px] font-black text-gray-400 group-hover:text-white uppercase tracking-[0.2em] transition-colors">
                    {t(item.key)}
                  </span>
                </div>

                {/* Technical Corner Accents on Hover */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 border-x border-blue-500/20 bg-blue-500/5"
                />
              </Link>
            ))}

            <div className="h-6 w-[1px] bg-white/10 mx-4" />

            <button
              onClick={toggleLanguage}
              className="group flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all"
            >
              <FiGlobe className="h-3 w-3 text-blue-500" />
              <span className="text-[10px] font-mono font-black text-gray-300 group-hover:text-white uppercase">
                {language === "en" ? "System_EN" : "System_AM"}
              </span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 bg-white/5 border border-white/10 text-blue-500"
            >
              {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation: Terminal Slide-down */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-[#0a0a0b] border-b border-white/10"
          >
            <div className="px-4 py-8 space-y-4">
              {navItems.map((item, i) => (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all"
                >
                  <span className="text-xs font-black text-white uppercase tracking-[0.3em]">
                    {t(item.key)}
                  </span>
                  <FiHash className="text-blue-500/30" />
                </Link>
              ))}

              <button
                onClick={toggleLanguage}
                className="w-full flex items-center justify-center gap-3 p-4 bg-blue-600/10 border border-blue-600/20 text-blue-500"
              >
                <FiGlobe />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Toggle_System_Language
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
