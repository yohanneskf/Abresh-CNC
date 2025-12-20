"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail,
  FiPhone,
  FiX,
  FiEye,
  FiTrash2,
  FiCpu,
  FiChevronRight,
  FiChevronLeft,
  FiActivity,
  FiImage,
  FiUsers,
  FiGlobe,
  FiAlertCircle,
} from "react-icons/fi";

interface Submission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  language?: string;
  description?: string;
  images?: string[];
  projectType?: string;
  budget?: string | number;
  status?: string;
  createdAt: string;
}

interface ContactListProps {
  submissions?: Submission[];
  onUpdateStatus?: (id: string, newStatus: string) => void;
  onDelete?: (id: string) => void;
  onUpdate?: () => void;
}

export default function ContactList({
  submissions = [],
  onUpdateStatus,
  onDelete,
}: ContactListProps) {
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const statusOptions = [
    { value: "all", label: "All_LOGS" },
    { value: "pending", label: "PENDING" },
    { value: "contacted", label: "CONTACTED" },
    { value: "quoted", label: "QUOTED" },
    { value: "completed", label: "COMPLETED" },
  ];

  const statusColors: Record<string, string> = {
    pending: "text-amber-500 border-amber-500/20 bg-amber-500/5",
    contacted: "text-blue-400 border-blue-400/20 bg-blue-400/5",
    quoted: "text-purple-400 border-purple-400/20 bg-purple-400/5",
    completed: "text-green-400 border-green-400/20 bg-green-400/5",
    cancelled: "text-red-400 border-red-400/20 bg-red-400/5",
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredSubmissions =
    statusFilter === "all"
      ? submissions
      : submissions.filter((sub) => sub.status === statusFilter);

  return (
    <div className="space-y-6 font-mono selection:bg-amber-500/30">
      {/* 1. Header & Filters Section */}
      <div className="bg-[#05070a] border border-white/5 p-6 relative overflow-hidden">
        {/* Decorative scanning line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
              <FiActivity className="text-amber-500" />
            </div>
            <div>
              <h3 className="text-[10px] font-black text-amber-500/50 uppercase tracking-[0.4em]">
                System_Intake_Feed
              </h3>
              <p className="text-2xl font-black text-white uppercase tracking-tighter italic">
                Active Inquiries
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest border transition-all ${
                  statusFilter === option.value
                    ? "bg-amber-600 border-amber-500 text-[#030712] shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                    : "bg-white/5 border-white/5 text-gray-500 hover:border-amber-500/30 hover:text-amber-500"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Main Data Grid */}
      <div className="bg-[#05070a] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-amber-500/[0.03] border-b border-white/5">
              <tr>
                <th className="px-6 py-4 text-[9px] font-black text-amber-500/40 uppercase tracking-widest">
                  Client_ID
                </th>
                <th className="px-6 py-4 text-[9px] font-black text-amber-500/40 uppercase tracking-widest">
                  Parameters
                </th>
                <th className="px-6 py-4 text-[9px] font-black text-amber-500/40 uppercase tracking-widest">
                  Status_Flag
                </th>
                <th className="px-6 py-4 text-[9px] font-black text-amber-500/40 uppercase tracking-widest text-right">
                  Receipt_Time
                </th>
                <th className="px-6 py-4 text-[9px] font-black text-amber-500/40 uppercase tracking-widest text-center">
                  Execute
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((sub: Submission) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-amber-500/[0.02] group transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div className="font-bold text-white text-sm uppercase tracking-tight">
                        {sub.name}
                      </div>
                      <div className="text-[10px] text-amber-500/50 mt-1">
                        {sub.email}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 uppercase">
                          {sub.projectType}
                        </span>
                        {sub.images && sub.images.length > 0 && (
                          <FiImage
                            className="text-amber-500/40"
                            size={12}
                            title="Visual data attached"
                          />
                        )}
                      </div>
                      <div className="text-[9px] text-gray-600 mt-2 italic uppercase">
                        {sub.budget
                          ? `Val: ${sub.budget}`
                          : "No_Value_Declared"}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 border text-[9px] font-black uppercase tracking-widest ${
                          statusColors[sub.status ?? "pending"]
                        }`}
                      >
                        <div className="w-1 h-1 bg-current animate-pulse" />
                        {sub.status ?? "pending"}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right font-mono text-[10px] text-gray-600">
                      {formatDate(sub.createdAt)}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex justify-center gap-2 opacity-20 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setSelectedSubmission(sub);
                            setCurrentImageIndex(0);
                          }}
                          className="p-2 bg-white/5 border border-white/10 hover:border-amber-500 hover:text-amber-500 transition-all"
                        >
                          <FiEye size={14} />
                        </button>
                        <button
                          onClick={() => onDelete?.(sub.id)}
                          className="p-2 bg-white/5 border border-white/10 hover:border-red-500 hover:text-red-500 transition-all"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <FiAlertCircle
                      className="mx-auto text-gray-800 mb-4"
                      size={30}
                    />
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest">
                      No_Data_Packets_Found
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Detail Modal (Amber HUD Style) */}
      <AnimatePresence>
        {selectedSubmission && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSubmission(null)}
              className="absolute inset-0 bg-[#030712]/95 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-5xl bg-[#080a0f] border border-amber-500/20 shadow-[0_0_50px_rgba(0,0,0,1)] overflow-hidden"
            >
              {/* Decorative HUD Corners */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-500" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-500" />

              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-white/5 bg-amber-500/[0.02]">
                <div className="flex items-center gap-4">
                  <FiCpu className="text-amber-500 animate-spin-slow" />
                  <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">
                      Diagnostics_View //{" "}
                      <span className="text-amber-500">
                        Intake_00{selectedSubmission.id.slice(-3)}
                      </span>
                    </h3>
                    <p className="text-[8px] text-amber-500/40 uppercase mt-1">
                      Encryption: AES-256 // Source: Remote_IP_Encrypted
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="p-2 text-gray-500 hover:text-white transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-10 max-h-[80vh] overflow-y-auto custom-scrollbar">
                {/* Left Column: Data & Logs */}
                <div className="lg:col-span-7 space-y-10">
                  <section>
                    <h4 className="text-[9px] font-black text-amber-500 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />{" "}
                      Client_Metadata
                    </h4>
                    <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/5">
                      {[
                        {
                          icon: <FiUsers />,
                          label: "Name",
                          val: selectedSubmission.name,
                        },
                        {
                          icon: <FiMail />,
                          label: "Email",
                          val: selectedSubmission.email,
                        },
                        {
                          icon: <FiPhone />,
                          label: "Phone",
                          val: selectedSubmission.phone || "N/A",
                        },
                        {
                          icon: <FiGlobe />,
                          label: "Origin",
                          val:
                            selectedSubmission.language?.toUpperCase() || "EN",
                        },
                      ].map((item, i) => (
                        <div key={i} className="bg-[#080a0f] p-4 group">
                          <span className="text-[8px] text-gray-600 block uppercase mb-1 tracking-widest">
                            {item.label}
                          </span>
                          <span className="text-xs font-bold text-white group-hover:text-amber-500 transition-colors">
                            {item.val}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h4 className="text-[9px] font-black text-amber-500 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />{" "}
                      Technical_Brief
                    </h4>
                    <div className="bg-amber-500/[0.03] border border-amber-500/10 p-6 relative">
                      <div className="absolute top-2 right-2 text-[8px] text-amber-500/20 font-mono italic">
                        "TRANSCRIPTION_ACTIVE"
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed italic">
                        "{selectedSubmission.description}"
                      </p>
                    </div>
                  </section>
                </div>

                {/* Right Column: Visual Schematic Analysis */}
                <div className="lg:col-span-5 space-y-8">
                  <section>
                    <h4 className="text-[9px] font-black text-amber-500 uppercase tracking-[0.4em] mb-4">
                      Visual_Schematics
                    </h4>
                    {selectedSubmission.images?.length ? (
                      <div className="border border-white/10 p-2 bg-black relative group">
                        <div className="aspect-square relative overflow-hidden">
                          <img
                            src={selectedSubmission.images[currentImageIndex]}
                            className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
                            alt="Project Visual"
                          />

                          {/* Navigation Overlay */}
                          {selectedSubmission.images.length > 1 && (
                            <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() =>
                                  setCurrentImageIndex((i) =>
                                    i > 0
                                      ? i - 1
                                      : selectedSubmission.images!.length - 1
                                  )
                                }
                                className="p-2 bg-black/80 text-amber-500 border border-amber-500/30 hover:bg-amber-500 hover:text-black transition-all"
                              >
                                <FiChevronLeft />
                              </button>
                              <button
                                onClick={() =>
                                  setCurrentImageIndex((i) =>
                                    i < selectedSubmission.images!.length - 1
                                      ? i + 1
                                      : 0
                                  )
                                }
                                className="p-2 bg-black/80 text-amber-500 border border-amber-500/30 hover:bg-amber-500 hover:text-black transition-all"
                              >
                                <FiChevronRight />
                              </button>
                            </div>
                          )}

                          {/* Image Counter */}
                          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/80 border border-amber-500/20 text-[8px] text-amber-500">
                            IMG_{currentImageIndex + 1}/
                            {selectedSubmission.images.length}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-square border border-dashed border-white/5 flex flex-col items-center justify-center text-gray-800 bg-white/[0.01]">
                        <FiImage size={30} className="mb-2 opacity-20" />
                        <span className="text-[8px] uppercase tracking-[0.3em]">
                          No_Visual_Payload
                        </span>
                      </div>
                    )}
                  </section>

                  <div className="grid grid-cols-2 gap-3">
                    <button className="py-4 bg-amber-600 text-[9px] font-black uppercase tracking-[0.3em] text-[#030712] hover:bg-amber-500 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                      Sync_Response
                    </button>
                    <button className="py-4 border border-white/10 text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 hover:border-amber-500 hover:text-amber-500 transition-all">
                      Archive_Data
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
