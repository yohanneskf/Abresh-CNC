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
  FiActivity,
  FiImage,
  FiUsers,
  FiGlobe,
  FiDownload,
  FiAlertTriangle,
  FiLoader,
  FiChevronLeft,
  FiChevronRight,
  FiMaximize2,
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
}

export default function ContactList({
  submissions = [],
  onDelete,
}: ContactListProps) {
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [submissionToPurge, setSubmissionToPurge] = useState<Submission | null>(
    null
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- PROTOCOL: DOWNLOAD PACKET ---
  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `SCHEMATIC_${selectedSubmission?.name.replace(
        /\s+/g,
        "_"
      )}_${currentImageIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Download failed", e);
    }
  };

  const executePurge = async () => {
    if (!submissionToPurge || !onDelete) return;
    setIsProcessing(true);
    try {
      await onDelete(submissionToPurge.id);
      setSubmissionToPurge(null);
    } catch (e) {
      console.error("Purge failed", e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 font-mono selection:bg-amber-500/30">
      {/* Activity Monitor Header */}
      <div className="bg-[#05070a] border border-white/5 p-4 md:p-6 relative overflow-hidden">
        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <FiActivity className="text-amber-500 animate-pulse text-sm md:text-base" />
            </div>
            <div>
              <h3 className="text-[8px] md:text-[10px] font-black text-amber-500/50 uppercase tracking-[0.4em]">
                System_Intake
              </h3>
              <p className="text-lg md:text-2xl font-black text-white uppercase italic">
                Active Inquiries
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- DESKTOP TABLE VIEW --- */}
      <div className="hidden md:block bg-[#05070a] border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/[0.02] border-b border-white/5">
            <tr>
              <th className="px-6 py-4 text-[9px] font-black text-amber-500/40 uppercase tracking-widest">
                Identifier
              </th>
              <th className="px-6 py-4 text-[9px] font-black text-amber-500/40 uppercase tracking-widest">
                Classification
              </th>
              <th className="px-6 py-4 text-[9px] font-black text-amber-500/40 uppercase tracking-widest text-right">
                Execute
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {submissions.map((sub) => (
              <tr
                key={sub.id}
                className="hover:bg-amber-500/[0.02] group transition-colors"
              >
                <td className="px-6 py-5">
                  <div className="text-white font-bold uppercase text-sm">
                    {sub.name}
                  </div>
                  <div className="text-[10px] text-gray-500">{sub.email}</div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-[9px] font-black bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-1 uppercase">
                    {sub.projectType}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedSubmission(sub);
                        setCurrentImageIndex(0);
                      }}
                      className="p-2 border border-white/10 hover:border-amber-500 text-gray-500 hover:text-amber-500 transition-all"
                    >
                      <FiEye />
                    </button>
                    <button
                      onClick={() => setSubmissionToPurge(sub)}
                      className="p-2 border border-white/10 hover:border-red-500 text-gray-500 hover:text-red-500 transition-all"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MOBILE CARD VIEW --- */}
      <div className="md:hidden space-y-4">
        {submissions.map((sub) => (
          <div
            key={sub.id}
            className="bg-[#05070a] border border-white/5 p-4 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="text-white font-bold uppercase text-sm">
                  {sub.name}
                </div>
                <div className="text-[10px] text-gray-500 truncate max-w-[200px]">
                  {sub.email}
                </div>
              </div>
              <span className="text-[8px] font-black bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-1 uppercase">
                {sub.projectType}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
              <button
                onClick={() => {
                  setSelectedSubmission(sub);
                  setCurrentImageIndex(0);
                }}
                className="flex items-center justify-center gap-2 py-3 border border-white/10 text-[9px] font-black uppercase text-amber-500"
              >
                <FiEye /> View
              </button>
              <button
                onClick={() => setSubmissionToPurge(sub)}
                className="flex items-center justify-center gap-2 py-3 border border-white/10 text-[9px] font-black uppercase text-red-500"
              >
                <FiTrash2 /> Purge
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- PURGE CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {submissionToPurge && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isProcessing && setSubmissionToPurge(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-[#080a0f] border border-red-500/30 p-8 text-center shadow-2xl"
            >
              <FiAlertTriangle className="text-red-500 text-4xl mx-auto mb-4 animate-pulse" />
              <h2 className="text-white font-black uppercase tracking-widest mb-2">
                Confirm_Data_Scrub
              </h2>
              <p className="text-gray-500 text-[10px] uppercase mb-8">
                Permanent Erasure of: {submissionToPurge.name}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setSubmissionToPurge(null)}
                  disabled={isProcessing}
                  className="flex-1 py-3 border border-white/10 text-gray-500 text-[10px] font-black uppercase hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={executePurge}
                  disabled={isProcessing}
                  className="flex-1 py-3 bg-red-600 text-white text-[10px] font-black uppercase flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <FiLoader className="animate-spin" />
                  ) : (
                    <>
                      <FiTrash2 /> Purge_Now
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- DETAIL VIEW MODAL --- */}
      <AnimatePresence>
        {selectedSubmission && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSubmission(null)}
              className="absolute inset-0 bg-[#030712]/98 backdrop-blur-md"
            />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="relative w-full max-w-6xl bg-[#080a0f] border border-amber-500/20 flex flex-col max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 md:p-6 border-b border-white/5 bg-amber-500/[0.02]">
                <div className="flex items-center gap-3">
                  <FiCpu className="text-amber-500" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">
                    Inquiry_File // {selectedSubmission.id.slice(-5)}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-gray-500 hover:text-white"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Info Panel */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5 border border-white/5">
                      {[
                        {
                          label: "Client_Name",
                          val: selectedSubmission.name,
                          icon: <FiUsers />,
                        },
                        {
                          label: "Contact_Email",
                          val: selectedSubmission.email,
                          icon: <FiMail />,
                        },
                        {
                          label: "Access_Phone",
                          val: selectedSubmission.phone || "N/A",
                          icon: <FiPhone />,
                        },
                        {
                          label: "Project_Class",
                          val: selectedSubmission.projectType,
                          icon: <FiActivity />,
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="bg-[#080a0f] p-4 flex gap-4 items-center"
                        >
                          <div className="text-amber-500/30">{item.icon}</div>
                          <div>
                            <span className="text-[7px] text-gray-600 block uppercase tracking-tighter">
                              {item.label}
                            </span>
                            <span className="text-xs font-bold text-white uppercase">
                              {item.val}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-amber-500/[0.03] border border-amber-500/10 p-6">
                      <h4 className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-4">
                        Transmission_Content
                      </h4>
                      <p className="text-sm text-gray-300 leading-relaxed italic">
                        "{selectedSubmission.description}"
                      </p>
                    </div>
                  </div>

                  {/* Image Gallery Panel */}
                  <div className="lg:col-span-5 space-y-4">
                    <h4 className="text-[9px] font-black text-amber-500 uppercase tracking-widest">
                      Visual_Payload
                    </h4>
                    {selectedSubmission.images &&
                    selectedSubmission.images.length > 0 ? (
                      <div className="space-y-4">
                        <div className="relative group aspect-square bg-black border border-white/10 overflow-hidden">
                          <img
                            src={selectedSubmission.images[currentImageIndex]}
                            className="w-full h-full object-contain transition-all duration-700"
                            alt="Schematic"
                          />

                          {/* Hover Controls */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <button
                              onClick={() => setIsZoomed(true)}
                              className="p-3 bg-white text-black hover:bg-amber-500 transition-colors"
                            >
                              <FiMaximize2 />
                            </button>
                            <button
                              onClick={() =>
                                handleDownload(
                                  selectedSubmission.images![currentImageIndex]
                                )
                              }
                              className="p-3 bg-white text-black hover:bg-amber-500 transition-colors"
                            >
                              <FiDownload />
                            </button>
                          </div>

                          {/* Navigation */}
                          {selectedSubmission.images.length > 1 && (
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-2 flex justify-between pointer-events-none">
                              <button
                                onClick={() =>
                                  setCurrentImageIndex((prev) =>
                                    prev > 0
                                      ? prev - 1
                                      : selectedSubmission.images!.length - 1
                                  )
                                }
                                className="p-2 bg-black/80 text-white pointer-events-auto hover:text-amber-500"
                              >
                                <FiChevronLeft />
                              </button>
                              <button
                                onClick={() =>
                                  setCurrentImageIndex((prev) =>
                                    prev < selectedSubmission.images!.length - 1
                                      ? prev + 1
                                      : 0
                                  )
                                }
                                className="p-2 bg-black/80 text-white pointer-events-auto hover:text-amber-500"
                              >
                                <FiChevronRight />
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                          {selectedSubmission.images.map((img, i) => (
                            <button
                              key={i}
                              onClick={() => setCurrentImageIndex(i)}
                              className={`w-16 h-16 shrink-0 border-2 transition-all ${
                                currentImageIndex === i
                                  ? "border-amber-500"
                                  : "border-white/5 opacity-40"
                              }`}
                            >
                              <img
                                src={img}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-square border border-dashed border-white/5 flex flex-col items-center justify-center text-gray-700 italic text-[10px]">
                        NO_VISUAL_DATA_ATTACHED
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 bg-white/[0.02] border-t border-white/5 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="px-6 py-2 border border-white/10 text-gray-500 text-[10px] font-black uppercase hover:text-white"
                >
                  Close_File
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- FULL SCREEN ZOOM VIEWER --- */}
      <AnimatePresence>
        {isZoomed && selectedSubmission?.images && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/98 flex items-center justify-center p-4"
          >
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-8 right-8 text-white/50 hover:text-white z-[210]"
            >
              <FiX size={40} />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={selectedSubmission.images[currentImageIndex]}
              className="max-w-full max-h-full object-contain shadow-2xl"
            />
            <div className="absolute bottom-10 flex gap-4">
              <button
                onClick={() =>
                  handleDownload(selectedSubmission.images![currentImageIndex])
                }
                className="flex items-center gap-2 px-6 py-3 bg-white text-black font-black uppercase text-xs hover:bg-amber-500 transition-colors"
              >
                <FiDownload /> Download_High_Res
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
