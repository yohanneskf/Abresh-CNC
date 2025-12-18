"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiGrid,
  FiMessageSquare,
  FiBarChart2,
  FiLogOut,
  FiMenu,
  FiX,
  FiHome,
  FiBell,
  FiUser,
  FiSettings,
  FiChevronDown,
  FiCpu,
  FiExternalLink,
  FiTerminal,
  FiActivity,
  FiShield,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface AdminNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout?: () => void;
}

export default function AdminNav({
  activeTab,
  setActiveTab,
  onLogout,
}: AdminNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();

  const navItems = [
    { id: "projects", label: "Catalog_Module", icon: <FiGrid />, code: "01" },
    {
      id: "submissions",
      label: "Intake_Feed",
      icon: <FiMessageSquare />,
      code: "02",
    },
    {
      id: "analytics",
      label: "Diagnostics",
      icon: <FiBarChart2 />,
      code: "03",
    },
  ];

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("admin_token");
      document.cookie =
        "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      router.push("/admin/login");
    }
    setShowProfileMenu(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-[#030712]/90 backdrop-blur-xl border-b border-white/5 z-50">
        {/* HUD Scanning Line Decor */}
        <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* BRANDING: CORE SYSTEM */}
            <div className="flex items-center gap-12">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-3 group"
              >
                <div className="relative w-10 h-10 border border-blue-500/30 flex items-center justify-center overflow-hidden group-hover:border-blue-500 transition-colors">
                  <FiCpu className="h-5 w-5 text-blue-500 group-hover:rotate-180 transition-transform duration-700" />
                  <div className="absolute top-0 right-0 w-1 h-1 bg-blue-500" />
                  <div className="absolute bottom-0 left-0 w-1 h-1 bg-blue-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black tracking-tighter uppercase italic text-white leading-none">
                    CNC<span className="text-blue-500 not-italic">_CORE</span>
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="animate-pulse w-1 h-1 bg-green-500 rounded-full" />
                    <span className="text-[7px] font-mono text-gray-500 uppercase tracking-[0.3em]">
                      OS_KRNL_v4.0.1
                    </span>
                  </div>
                </div>
              </Link>

              {/* DESKTOP NAV: TAB MODULES */}
              <div className="hidden lg:flex items-center space-x-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`relative px-6 py-3 flex items-center gap-3 transition-all group ${
                      activeTab === item.id
                        ? "text-white"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    <span className="font-mono text-[8px] opacity-40 group-hover:opacity-100">
                      {item.code}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                      {item.label}
                    </span>

                    {activeTab === item.id && (
                      <>
                        <motion.div
                          layoutId="activeHighlight"
                          className="absolute inset-0 bg-blue-600/5 border-x border-blue-500/20"
                        />
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-blue-600 shadow-[0_0_15px_#3b82f6]"
                        />
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* SYSTEM STATUS & UTILS */}
            <div className="flex items-center gap-4">
              {/* LIVE FEED LINK */}
              <Link
                href="/"
                target="_blank"
                className="hidden xl:flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all group"
              >
                <FiExternalLink className="h-3 w-3 text-blue-500" />
                <span className="text-[9px] font-mono font-bold text-gray-400 group-hover:text-white uppercase tracking-widest">
                  Public_Interface
                </span>
              </Link>

              <div className="h-8 w-[1px] bg-white/5 mx-2" />

              {/* NOTIFICATION TERMINAL */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`p-3 border transition-all ${
                    showNotifications
                      ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                      : "bg-white/5 border-white/5 text-gray-500 hover:border-white/20"
                  }`}
                >
                  <FiTerminal className="h-4 w-4" />
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      className="absolute right-0 mt-4 w-80 bg-[#0a0a0b] border border-white/10 shadow-2xl z-50 p-1"
                    >
                      <div className="p-3 bg-white/5 flex justify-between items-center">
                        <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-500">
                          Active_System_Logs
                        </h3>
                        <span className="text-[8px] font-mono text-gray-600 italic">
                          SEC_ENCRYPTED
                        </span>
                      </div>
                      <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                          >
                            <div className="flex justify-between mb-1">
                              <span className="text-[8px] font-mono text-blue-500/50">
                                #LOG_00{i}
                              </span>
                              <span className="text-[8px] font-mono text-gray-600">
                                04:22:0{i}
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                              Data Packet Received: New Lead from
                              [Regional_Unit_04]
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* AUTH_USER MODULE */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-4 p-1.5 pr-4 bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all"
                >
                  <div className="w-10 h-10 bg-blue-600 flex items-center justify-center">
                    <FiShield className="text-white text-lg" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white leading-none">
                      Root_Admin
                    </p>
                    <p className="text-[7px] font-mono text-blue-500 mt-1 uppercase">
                      Access_Clearance: Lv_01
                    </p>
                  </div>
                  <FiChevronDown
                    className={`h-3 w-3 text-gray-600 transition-transform ${
                      showProfileMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 bg-[#0a0a0b] border border-white/10 shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="p-2 space-y-1">
                        <button className="w-full flex items-center gap-4 px-4 py-3 text-gray-500 hover:text-white hover:bg-white/5 transition-all">
                          <FiSettings className="h-3.5 w-3.5" />
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            System_Config
                          </span>
                        </button>
                        <div className="h-[1px] bg-white/5 mx-2" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-500/10 transition-all"
                        >
                          <FiLogOut className="h-3.5 w-3.5" />
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            Terminate_Sess
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE HUD OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed inset-0 top-20 bg-[#030712] z-40 lg:hidden p-8"
          >
            <div className="space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-6 border ${
                    activeTab === item.id
                      ? "bg-blue-600/10 border-blue-600 text-white"
                      : "border-white/5 text-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-black uppercase tracking-[0.3em] text-xs">
                      {item.label}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] opacity-30">
                    {item.code}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-20" />
    </>
  );
}
