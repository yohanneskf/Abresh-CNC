"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "@/components/AdminNav";
import ProjectForm from "@/components/ProjectForm";
import ProjectList from "@/components/ProjectList";
import ContactList from "@/components/ContactList";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiAlertCircle,
  FiLoader,
  FiDatabase,
  FiUsers,
  FiCheckCircle,
  FiPlus,
  FiRefreshCw,
  FiTrendingUp,
  FiMail,
  FiImage,
  FiActivity,
  FiTerminal,
  FiZap,
} from "react-icons/fi";

// ... [Interfaces remain identical to your original code]
interface Project {
  id: string;
  titleEn: string;
  titleAm: string;
  category: string;
  materials: string[];
  featured: boolean;
  createdAt: string;
  images: string[];
}
interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  description: string;
  budget?: string;
  timeline?: string;
  files?: string[];
  status: "pending" | "contacted" | "quoted" | "completed" | "cancelled";
  language: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalSubmissions: 0,
    pendingReviews: 0,
    featuredProjects: 0,
  });
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      setLoading(true);
      setAuthError("");
      const token = localStorage.getItem("admin_token");
      if (!token) {
        setAuthError("No authentication token found. Please login.");
        router.push("/admin/login");
        return;
      }
      try {
        await fetch("/api/admin/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (e) {}
      await fetchData(token);
    } catch (error) {
      setAuthError("Authentication failed.");
      localStorage.removeItem("admin_token");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (token: string) => {
    try {
      setRefreshing(true);
      const projectsRes = await fetch("/api/projects");
      const projectsData = await projectsRes.json();
      setProjects(projectsData || []);

      let submissionsData: ContactSubmission[] = [];
      const submissionsRes = await fetch("/api/admin/submissions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (submissionsRes.ok) submissionsData = await submissionsRes.json();
      setSubmissions(submissionsData || []);

      setStats({
        totalProjects: projectsData?.length || 0,
        totalSubmissions: submissionsData?.length || 0,
        pendingReviews: (submissionsData || []).filter(
          (s) => s.status === "pending"
        ).length,
        featuredProjects: (projectsData || []).filter(
          (p: { featured: any }) => p.featured
        ).length,
      });
    } catch (error) {
      setAuthError(
        `Load Error: ${error instanceof Error ? error.message : "Unknown"}`
      );
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    document.cookie =
      "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/admin/login");
  };

  const handleUpdate = () => {
    const token = localStorage.getItem("admin_token");
    if (token) fetchData(token);
  };
  const refreshData = () => {
    const token = localStorage.getItem("admin_token");
    if (token) fetchData(token);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">
            Initializing_Systems...
          </h3>
        </div>
      </div>
    );
  }

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "projects":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-2 border-blue-600 pl-6">
              <div>
                <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em]">
                  Module_01
                </span>
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                  Project Catalog
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={refreshData}
                  disabled={refreshing}
                  className="p-3 bg-white/5 border border-white/10 hover:border-blue-500 transition-all text-gray-400"
                >
                  <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
                </button>
                <button
                  onClick={() => setShowProjectForm(!showProjectForm)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 font-black uppercase text-[10px] tracking-widest hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)]"
                >
                  <FiPlus /> {showProjectForm ? "Close Editor" : "New Entry"}
                </button>
              </div>
            </div>

            {showProjectForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="bg-white/5 border border-blue-500/20 p-8 backdrop-blur-md"
              >
                <ProjectForm onSuccess={handleUpdate} />
              </motion.div>
            )}

            <div className="bg-white/[0.02] border border-white/5 p-6">
              <ProjectList projects={projects} onUpdate={handleUpdate} />
            </div>
          </motion.div>
        );

      case "submissions":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="border-l-2 border-blue-600 pl-6 mb-12">
              <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em]">
                Module_02
              </span>
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                Inquiry Terminal
              </h1>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
              {[
                {
                  label: "Total",
                  val: stats.totalSubmissions,
                  icon: <FiUsers />,
                  color: "text-blue-500",
                },
                {
                  label: "Pending",
                  val: stats.pendingReviews,
                  icon: <FiAlertCircle />,
                  color: "text-amber-500",
                },
                {
                  label: "Contacted",
                  val: submissions.filter((s) => s.status === "contacted")
                    .length,
                  icon: <FiCheckCircle />,
                  color: "text-green-500",
                },
                {
                  label: "Closed",
                  val: submissions.filter((s) => s.status === "completed")
                    .length,
                  icon: <FiZap />,
                  color: "text-purple-500",
                },
              ].map((stat, i) => (
                <div key={i} className="bg-[#030712] p-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                      {stat.label}
                    </span>
                    <span className={stat.color}>{stat.icon}</span>
                  </div>
                  <div className="text-3xl font-black text-white">
                    {stat.val}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/[0.02] border border-white/5">
              <ContactList submissions={submissions} onUpdate={handleUpdate} />
            </div>
          </motion.div>
        );

      case "analytics":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="border-l-2 border-blue-600 pl-6 mb-12">
              <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em]">
                Module_03
              </span>
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                Diagnostics
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Category Matrix */}
              <div className="bg-[#0a0a0b] border border-white/10 p-8">
                <div className="flex items-center gap-3 mb-8">
                  <FiActivity className="text-blue-500" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white">
                    Project_Distribution
                  </h3>
                </div>
                <div className="space-y-6">
                  {Object.entries(
                    projects.reduce((acc: any, p) => {
                      acc[p.category] = (acc[p.category] || 0) + 1;
                      return acc;
                    }, {})
                  ).map(([cat, count]: any) => (
                    <div key={cat} className="group">
                      <div className="flex justify-between text-[10px] font-mono mb-2">
                        <span className="uppercase text-gray-400">{cat}</span>
                        <span className="text-blue-500">
                          {((count / projects.length) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-1 w-full bg-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(count / projects.length) * 100}%`,
                          }}
                          className="h-full bg-blue-600 shadow-[0_0_10px_#2563eb]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Flow */}
              <div className="bg-[#0a0a0b] border border-white/10 p-8">
                <div className="flex items-center gap-3 mb-8">
                  <FiTerminal className="text-blue-500" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white">
                    Operational_Status
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {["pending", "contacted", "quoted", "completed"].map(
                    (status) => {
                      const count = submissions.filter(
                        (s) => s.status === status
                      ).length;
                      return (
                        <div
                          key={status}
                          className="flex items-center justify-between p-4 bg-white/5 border border-white/5"
                        >
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            {status}
                          </span>
                          <span className="text-xl font-black text-white">
                            {count}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>

            {/* Recent Log */}
            <div className="bg-[#0a0a0b] border border-white/10 p-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white mb-8">
                Recent_Activity_Log
              </h3>
              <div className="space-y-4">
                {projects.slice(0, 3).map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 border border-white/10 overflow-hidden">
                        {project.images?.[0] ? (
                          <img
                            src={project.images[0]}
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
                          />
                        ) : (
                          <FiImage className="m-auto mt-2 text-gray-700" />
                        )}
                      </div>
                      <div>
                        <p className="text-[11px] font-black uppercase text-white">
                          {project.titleEn}
                        </p>
                        <p className="text-[9px] font-mono text-gray-500 mt-1 uppercase">
                          {project.category} //{" "}
                          {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-[10px] font-mono text-blue-500 opacity-50">
                      #LOG_{project.id.slice(-4)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-blue-600/30">
      {/* HUD GRID */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <AdminNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <main className="max-w-[1600px] mx-auto px-6 py-12 relative z-10">
        {renderActiveTabContent()}

        {authError && !authError.includes("No authentication token found") && (
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="mt-12 p-6 bg-red-900/10 border border-red-500/20 flex items-center gap-4"
          >
            <FiAlertCircle className="text-red-500" />
            <div className="text-[10px] font-mono uppercase tracking-widest text-red-400">
              System_Warning: {authError}
              <button
                onClick={checkAuthAndFetchData}
                className="ml-4 underline hover:text-white transition-colors"
              >
                Re-Initialize
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
