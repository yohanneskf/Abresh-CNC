"use client";

import {
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail,
  FiPhone,
  FiClock,
  FiCheck,
  FiX,
  FiEye,
  FiUsers,
  FiEdit,
  FiTrash2,
  FiMessageCircle,
  FiExternalLink,
  FiDownload,
  FiImage,
  FiCalendar,
  FiDollarSign,
  FiGlobe,
  FiFileText,
  FiChevronRight,
  FiChevronLeft,
  FiActivity,
  FiCpu,
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
  status?:
    | "pending"
    | "contacted"
    | "quoted"
    | "completed"
    | "cancelled"
    | string;
  createdAt: string;
}

interface ContactListProps {
  submissions?: Submission[];
  onUpdate?: (updated: Submission) => void;
}

export default function ContactList({
  submissions = [],
  onUpdate,
}: ContactListProps) {
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const [actionMessage, setActionMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // LOGIC FUNCTIONS (updateStatus, deleteSubmission, etc.) remain identical to original logic

  const statusOptions = [
    { value: "all", label: "All_LOGS", color: "gray" },
    { value: "pending", label: "PENDING", color: "yellow" },
    { value: "contacted", label: "CONTACTED", color: "blue" },
    { value: "quoted", label: "QUOTED", color: "purple" },
    { value: "completed", label: "COMPLETED", color: "green" },
  ];

  const statusColors: Record<string, string> = {
    pending: "text-amber-400 border-amber-400/20 bg-amber-400/5",
    contacted: "text-blue-400 border-blue-400/20 bg-blue-400/5",
    quoted: "text-purple-400 border-purple-400/20 bg-purple-400/5",
    completed: "text-green-400 border-green-400/20 bg-green-400/5",
    cancelled: "text-red-400 border-red-400/20 bg-red-400/5",
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "2-digit",
    });
  };

  const filteredSubmissions =
    statusFilter === "all"
      ? submissions
      : submissions.filter((sub) => sub.status === statusFilter);

  return (
    <div className="space-y-6 font-sans selection:bg-blue-500/30">
      {/* 1. Header & Filters Section */}
      <div className="bg-[#0a0a0b] border border-white/10 p-6 rounded-sm">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600/10 flex items-center justify-center border border-blue-500/20">
              <FiActivity className="text-blue-500" />
            </div>
            <div>
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
                Data_Inbound
              </h3>
              <p className="text-xl font-black text-white uppercase tracking-tighter">
                Client Inquiries
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all ${
                  statusFilter === option.value
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-white/5 border-white/10 text-gray-500 hover:border-white/30"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Main Data Grid */}
      <div className="bg-[#0a0a0b] border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/[0.02] border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                  Client_Identifier
                </th>
                <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                  Project_Spec
                </th>
                <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest text-right">
                  Timestamp
                </th>
                <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredSubmissions.map((sub: Submission) => (
                <tr
                  key={sub.id}
                  className="hover:bg-white/[0.02] group transition-colors"
                >
                  <td className="px-6 py-5">
                    <div className="font-bold text-white text-sm">
                      {sub.name}
                    </div>
                    <div className="text-[10px] font-mono text-gray-500 mt-1 uppercase tracking-tighter">
                      {sub.email}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[10px] font-black bg-blue-600/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded-sm uppercase">
                      {sub.projectType}
                    </span>
                    <div className="text-[10px] text-gray-500 mt-2 font-mono italic">
                      {sub.budget ? `BUDGET: ${sub.budget}` : "NO_BUDGET_DEF"}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 border text-[9px] font-black uppercase tracking-widest rounded-full ${
                        // default to "pending" when sub.status is undefined and ensure a string class
                        statusColors[sub.status ?? "pending"] ?? ""
                      }`}
                    >
                      <div
                        className={`w-1 h-1 rounded-full bg-current animate-pulse`}
                      />
                      {sub.status ?? "pending"}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right font-mono text-[10px] text-gray-500">
                    {formatDate(sub.createdAt)}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex justify-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setSelectedSubmission(sub)}
                        className="p-2 bg-white/5 border border-white/10 hover:border-blue-500 hover:text-blue-500 transition-all"
                      >
                        <FiEye size={14} />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(sub.id)}
                        className="p-2 bg-white/5 border border-white/10 hover:border-red-500 hover:text-red-500 transition-all"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Detail Modal (Glassmorphic) */}
      <AnimatePresence>
        {selectedSubmission && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSubmission(null)}
              className="absolute inset-0 bg-[#030712]/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-5xl bg-[#0a0a0b] border border-white/10 shadow-2xl overflow-hidden rounded-sm"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <FiCpu className="text-blue-500" />
                  <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-widest">
                      Entry_Detailed_View
                    </h3>
                    <p className="text-[10px] font-mono text-gray-500">
                      REF_ID: {selectedSubmission.id}
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

              <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-12 max-h-[70vh] overflow-y-auto custom-scrollbar text-white">
                {/* Left Column: Client & Project Details */}
                <div className="lg:col-span-7 space-y-10">
                  <section>
                    <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-4">
                      Client_Metadata
                    </h4>
                    <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10">
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
                          val: selectedSubmission.phone,
                        },
                        {
                          icon: <FiGlobe />,
                          label: "Lang",
                          val: selectedSubmission.language
                            ? selectedSubmission.language.toUpperCase()
                            : "UNSPECIFIED",
                        },
                      ].map((item, i) => (
                        <div key={i} className="bg-[#0a0a0b] p-4">
                          <span className="text-[9px] font-mono text-gray-500 block uppercase mb-1">
                            {item.label}
                          </span>
                          <span className="text-xs font-bold">{item.val}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-4">
                      Inquiry_Payload
                    </h4>
                    <div className="bg-white/[0.03] border border-white/5 p-6 rounded-sm">
                      <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap font-mono italic">
                        "{selectedSubmission.description}"
                      </p>
                    </div>
                  </section>
                </div>

                {/* Right Column: Visuals & Actions */}
                <div className="lg:col-span-5 space-y-8">
                  {selectedSubmission.images?.length ? (
                    <div className="border border-white/10 p-2 bg-white/5">
                      <div className="aspect-square relative overflow-hidden bg-black">
                        <img
                          src={selectedSubmission.images[currentImageIndex]}
                          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                          alt="Spec"
                        />
                        <div className="absolute bottom-4 right-4 flex gap-2">
                          <button
                            onClick={() =>
                              setCurrentImageIndex((i) => (i > 0 ? i - 1 : 0))
                            }
                            className="p-2 bg-black/80 hover:bg-blue-600 transition-colors"
                          >
                            <FiChevronLeft />
                          </button>
                          <button
                            onClick={() =>
                              setCurrentImageIndex((i) =>
                                i < selectedSubmission.images!.length - 1
                                  ? i + 1
                                  : i
                              )
                            }
                            className="p-2 bg-black/80 hover:bg-blue-600 transition-colors"
                          >
                            <FiChevronRight />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-square border border-dashed border-white/10 flex flex-col items-center justify-center text-gray-600">
                      <FiImage size={40} className="mb-4 opacity-20" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        No_Visual_Data
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    <button className="w-full py-4 bg-blue-600 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.2)] transition-all">
                      Initialize Response
                    </button>
                    <button className="w-full py-4 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all">
                      Archive Entry
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
