"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiFacebook,
  FiInstagram,
  FiLinkedin,
  FiArrowUp,
  FiCpu,
  FiActivity,
  FiTerminal,
} from "react-icons/fi";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  const { t, language } = useLanguage();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const contactInfo = [
    {
      icon: <FiPhone />,
      text: language === "en" ? "+251 911 123456" : "+251 911 123456",
      label: "COMMS_VOICE",
    },
    {
      icon: <FiMail />,
      text: "contact@cncdesign.com",
      label: "COMMS_DATA",
    },
    {
      icon: <FiMapPin />,
      text: language === "en" ? "Addis Ababa, Ethiopia" : "አዲስ አበባ, ኢትዮጵያ",
      label: "GEO_LOCATION",
    },
  ];

  const socialLinks = [
    { icon: <FiFacebook />, href: "https://facebook.com", label: "FB_01" },
    { icon: <FiInstagram />, href: "https://instagram.com", label: "IG_02" },
    { icon: <FiLinkedin />, href: "https://linkedin.com", label: "LI_03" },
  ];

  const labelStyles =
    "text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 mb-8 flex items-center gap-2";

  return (
    <footer className="relative bg-[#030712] text-white border-t border-white/10 overflow-hidden selection:bg-blue-500/30">
      {/* 1. Structural Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* 2. Top Scanner Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-600 to-transparent shadow-[0_0_15px_#2563eb]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Module 01: Identity */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link href="/" className="group flex items-center gap-2 mb-8">
              <div className="w-8 h-8 border border-blue-500 flex items-center justify-center">
                <FiCpu className="text-blue-500 text-sm group-hover:rotate-90 transition-transform duration-500" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase italic">
                CNC<span className="text-blue-500 not-italic">_DESIGN</span>
              </span>
            </Link>
            <p className="text-gray-500 text-[11px] font-medium leading-relaxed mb-10 max-w-xs uppercase tracking-wider">
              {language === "en"
                ? "High-Precision fabrication and architectural design systems. Algorithmically optimized. Human centered."
                : "በትክክለኛ የCNC ቴክኖሎጂ የተደገፉ የቤት እና የቢሮ እቃዎች ዲዛይን እና ምርት።"}
            </p>
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 flex flex-col items-center justify-center border border-white/10 bg-white/5 hover:border-blue-500 hover:text-blue-500 transition-all text-xs"
                >
                  {social.icon}
                  <span className="text-[7px] font-mono mt-1 opacity-50">
                    {social.label}
                  </span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Module 02: Navigation Matrix */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className={labelStyles}>
              <FiTerminal size={12} /> System_Nav
            </h4>
            <ul className="space-y-4">
              {["home", "projects", "about", "contact"].map((key, i) => (
                <li key={key}>
                  <Link
                    href={key === "home" ? "/" : `/${key}`}
                    className="text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 group"
                  >
                    <span className="text-blue-500/30 font-mono text-[8px]">
                      0{i + 1}
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      {t(`nav.${key}`)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Module 03: Performance Specs */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className={labelStyles}>
              <FiActivity size={12} /> Logic_Units
            </h4>
            <ul className="space-y-4">
              {[
                "CNC_FABRICATION",
                "PARAMETRIC_DESIGN",
                "CAD_MODELING",
                "ON_SITE_ASSEMBLY",
              ].map((item) => (
                <li
                  key={item}
                  className="text-gray-500 hover:text-blue-400 text-[10px] font-mono cursor-pointer transition-colors flex items-center gap-3 group"
                >
                  <div className="w-1 h-1 bg-blue-500/20 group-hover:bg-blue-500" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Module 04: Terminal Contact */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className={labelStyles}>
              <FiMapPin size={12} /> Terminal_ID
            </h4>
            <ul className="space-y-6">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex flex-col gap-1 group">
                  <span className="text-[8px] font-mono text-blue-500/50">
                    {info.label}
                  </span>
                  <span className="text-gray-400 text-[11px] font-bold uppercase tracking-widest group-hover:text-white transition-colors">
                    {info.text}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* System Footer Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <p className="text-gray-700 text-[9px] font-mono uppercase tracking-[0.3em]">
              © {currentYear} CNC_DS // [PRC_MOD_AKTIV]
            </p>
            <div className="hidden sm:block h-3 w-[1px] bg-white/10" />
            <Link
              href="/privacy"
              className="text-gray-700 hover:text-blue-500 text-[9px] font-mono uppercase tracking-[0.3em] transition-colors"
            >
              Privacy_Protocol
            </Link>
          </div>

          <button
            onClick={scrollToTop}
            className="group relative flex items-center justify-center w-12 h-12 border border-white/10 hover:border-blue-500 transition-all"
          >
            <FiArrowUp className="text-gray-500 group-hover:text-blue-500 group-hover:-translate-y-1 transition-all" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600/20 group-hover:bg-blue-600 transition-colors" />
          </button>
        </div>
      </div>
    </footer>
  );
}
