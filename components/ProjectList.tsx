"use client";

import { useState, useEffect } from "react";
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
  FiMaximize2,
  FiArrowLeft,
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
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- PROTOCOL: KEYBOARD LISTENER ---
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsZoomed(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `CNC_EXPORT_${selectedSubmission?.name.replace(
        /\s+/g,
        "_"
      )}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      window.open(url, "_blank");
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

      {/* --- DESKTOP TABLE --- */}
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
                        setCurrentImgIndex(0);
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
                <div className="text-[10px] text-gray-500 truncate max-w-[180px]">
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
                  setCurrentImgIndex(0);
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

      {/* --- DETAIL VIEW MODAL --- */}
      <AnimatePresence>
        {selectedSubmission && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4">
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
              exit={{ y: 20, opacity: 0 }}
              className="relative w-full h-full md:h-auto md:max-w-6xl bg-[#080a0f] border-t md:border border-amber-500/20 overflow-hidden shadow-2xl flex flex-col md:max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-4 md:p-6 border-b border-white/5 bg-amber-500/[0.02]">
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="md:hidden text-amber-500 flex items-center gap-2 text-[10px] font-black uppercase"
                >
                  <FiArrowLeft /> Back
                </button>
                <div className="hidden md:flex items-center gap-3">
                  <FiCpu className="text-amber-500" />
                  <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">
                    DIAG_REPORT // ID_{selectedSubmission.id.slice(-5)}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-gray-500 hover:text-white p-2"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="p-4 md:p-8 overflow-y-auto custom-scrollbar flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Data */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5 border border-white/5">
                      {[
                        {
                          label: "Client",
                          val: selectedSubmission.name,
                          icon: <FiUsers />,
                        },
                        {
                          label: "Email",
                          val: selectedSubmission.email,
                          icon: <FiMail />,
                        },
                        {
                          label: "Phone",
                          val: selectedSubmission.phone || "N/A",
                          icon: <FiPhone />,
                        },
                        {
                          label: "Type",
                          val: selectedSubmission.projectType || "GENERAL",
                          icon: <FiGlobe />,
                        },
                      ].map((item, i) => (
                        <div key={i} className="bg-[#080a0f] p-4">
                          <span className="text-[7px] text-amber-500/50 flex items-center gap-2 uppercase mb-1">
                            {item.icon} {item.label}
                          </span>
                          <span className="text-xs font-bold text-white break-all">
                            {item.val}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-amber-500/[0.03] border border-amber-500/10 p-5">
                      <h4 className="text-[8px] font-black text-amber-500 uppercase mb-3">
                        Technical_Brief
                      </h4>
                      <p className="text-xs md:text-sm text-gray-400 leading-relaxed italic whitespace-pre-wrap">
                        "{selectedSubmission.description}"
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Visuals */}
                  <div className="lg:col-span-5 space-y-4">
                    <h4 className="text-[8px] font-black text-amber-500 uppercase tracking-widest">
                      Visual_Data_Packet
                    </h4>
                    {selectedSubmission.images &&
                    selectedSubmission.images.length > 0 ? (
                      <div className="space-y-4">
                        <div
                          className="relative group border border-white/10 p-1 bg-black aspect-square overflow-hidden cursor-zoom-in"
                          onClick={() => setIsZoomed(true)}
                        >
                          <img
                            src={selectedSubmission.images[currentImgIndex]}
                            className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <FiMaximize2 className="text-amber-500 text-3xl" />
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleDownload(
                              selectedSubmission.images![currentImgIndex]
                            )
                          }
                          className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all"
                        >
                          <FiDownload size={18} /> Download_Image
                        </button>
                      </div>
                    ) : (
                      <div className="aspect-square border border-dashed border-white/5 flex flex-col items-center justify-center text-gray-700 italic text-[10px]">
                        NO_VISUAL_DATA
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- FULLSCREEN ZOOM OVERLAY (MODIFIED) --- */}
      <AnimatePresence>
        {isZoomed && selectedSubmission?.images && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4"
            onClick={() => setIsZoomed(false)} // CLICK BACKDROP TO CANCEL
          >
            {/* TOP CANCEL BUTTON */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(false);
              }}
              className="absolute top-6 right-6 bg-white/10 hover:bg-red-600 p-4 text-white z-[210] flex items-center gap-3 text-[12px] uppercase font-black border border-white/10 transition-all"
            >
              <FiX size={24} /> Close_Viewer
            </button>

            {/* IMAGE CONTAINER */}
            <div
              className="relative max-w-full max-h-[75vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                src={selectedSubmission.images[currentImgIndex]}
                className="w-full h-full object-contain shadow-2xl"
              />
            </div>

            {/* ACTION FOOTER */}
            <div
              className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() =>
                  handleDownload(selectedSubmission.images![currentImgIndex])
                }
                className="flex-1 py-4 bg-amber-500 text-black font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-white transition-colors"
              >
                <FiDownload /> Download
              </button>
              <button
                onClick={() => setIsZoomed(false)}
                className="flex-1 py-4 bg-white/5 text-white font-black uppercase tracking-widest text-[10px] border border-white/10 hover:bg-white/20 transition-colors"
              >
                Exit_Zoom
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- PURGE MODAL --- */}
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
              className="relative w-full max-w-md bg-[#080a0f] border border-red-500/30 p-8 text-center"
            >
              <FiAlertTriangle className="text-red-500 text-4xl mx-auto mb-4 animate-pulse" />
              <h3 className="text-white font-black uppercase tracking-widest mb-2 text-sm">
                Execute_Data_Purge
              </h3>
              <p className="text-gray-500 text-[10px] uppercase mb-8 leading-relaxed">
                System erasure will remove all traces of [
                {submissionToPurge.name}].
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSubmissionToPurge(null)}
                  disabled={isProcessing}
                  className="py-3 border border-white/10 text-gray-500 text-[10px] font-black uppercase hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={executePurge}
                  disabled={isProcessing}
                  className="py-3 bg-red-900/40 hover:bg-red-600 text-white border border-red-500/50 text-[10px] font-black uppercase flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <FiLoader className="animate-spin" />
                  ) : (
                    <>
                      <FiTrash2 /> Confirm
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
