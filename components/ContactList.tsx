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

  // --- DOWNLOAD LOGIC ---
  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `EXP_${selectedSubmission?.name?.replace(
        /\s+/g,
        "_"
      )}_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      alert("System Error: Download Protocol Failed");
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
      {/* HEADER SECTION */}
      <div className="bg-[#05070a] border border-white/5 p-4 md:p-6 relative overflow-hidden">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
            <FiActivity className="text-amber-500 animate-pulse" />
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

      {/* DESKTOP VIEW */}
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
                <td className="px-6 py-5 text-[9px] font-black text-amber-500 uppercase">
                  {sub.projectType}
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedSubmission(sub);
                        setCurrentImgIndex(0);
                      }}
                      className="p-2 border border-white/10 text-gray-500 hover:text-amber-500 transition-all"
                    >
                      <FiEye />
                    </button>
                    <button
                      onClick={() => setSubmissionToPurge(sub)}
                      className="p-2 border border-white/10 text-gray-500 hover:text-red-500 transition-all"
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

      {/* MOBILE VIEW */}
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
                <div className="text-[10px] text-gray-500 truncate max-w-[150px]">
                  {sub.email}
                </div>
              </div>
              <span className="text-[8px] font-black bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-1 uppercase">
                {sub.projectType}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
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

      {/* MAIN DETAIL MODAL */}
      <AnimatePresence>
        {selectedSubmission && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSubmission(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-6xl bg-[#080a0f] border border-amber-500/20 overflow-hidden shadow-2xl flex flex-col max-h-[95vh]"
            >
              <div className="flex justify-between items-center p-4 md:p-6 border-b border-white/5 bg-amber-500/[0.02]">
                <div className="flex items-center gap-3">
                  <FiCpu className="text-amber-500 shrink-0" />
                  <h3 className="text-[10px] md:text-xs font-black text-white uppercase tracking-[0.2em] truncate">
                    DIAG_REPORT // {selectedSubmission.id.slice(-5)}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="p-2 text-gray-500 hover:text-white transition-all"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="p-4 md:p-8 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* DATA COLUMN */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5 border border-white/5">
                      {[
                        {
                          label: "Client_Name",
                          val: selectedSubmission.name,
                          icon: <FiUsers />,
                        },
                        {
                          label: "Comm_Link",
                          val: selectedSubmission.email,
                          icon: <FiMail />,
                        },
                        {
                          label: "Voice_Line",
                          val: selectedSubmission.phone || "N/A",
                          icon: <FiPhone />,
                        },
                        {
                          label: "Region",
                          val: selectedSubmission.language || "EN",
                          icon: <FiGlobe />,
                        },
                      ].map((item, i) => (
                        <div key={i} className="bg-[#080a0f] p-4">
                          <span className="text-[7px] text-amber-500/40 flex items-center gap-2 uppercase mb-1">
                            {item.icon} {item.label}
                          </span>
                          <span className="text-xs font-bold text-white break-all">
                            {item.val}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-amber-500/[0.03] border border-amber-500/10 p-5">
                      <h4 className="text-[8px] font-black text-amber-500 uppercase mb-2">
                        Detailed_Description
                      </h4>
                      <p className="text-xs md:text-sm text-gray-300 italic">
                        "{selectedSubmission.description}"
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => setSelectedSubmission(null)}
                        className="px-6 py-3 border border-white/10 text-gray-500 text-[10px] font-black uppercase hover:text-white transition-all"
                      >
                        Close_Terminal
                      </button>
                    </div>
                  </div>

                  {/* IMAGE COLUMN */}
                  <div className="lg:col-span-5 space-y-4">
                    <h4 className="text-[8px] font-black text-amber-500 uppercase">
                      Visual_Data
                    </h4>
                    {selectedSubmission.images?.length ? (
                      <div className="space-y-4">
                        <div
                          className="relative group border border-white/10 p-1 bg-black aspect-square overflow-hidden cursor-pointer"
                          onClick={() => setIsZoomed(true)}
                        >
                          <img
                            src={selectedSubmission.images[currentImgIndex]}
                            className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                            <FiMaximize2 className="text-amber-500 text-3xl" />
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleDownload(
                              selectedSubmission.images![currentImgIndex]
                            )
                          }
                          className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-black text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                        >
                          <FiDownload /> Download_Full_Packet
                        </button>
                      </div>
                    ) : (
                      <div className="aspect-square border border-dashed border-white/5 flex items-center justify-center text-gray-800 text-[10px]">
                        NO_IMAGES_LOADED
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN IMAGE ZOOM (High Z-Index) */}
      <AnimatePresence>
        {isZoomed && selectedSubmission?.images && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black flex flex-col items-center justify-center p-4"
          >
            {/* HEADER FOR ZOOM */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center bg-gradient-to-b from-black to-transparent">
              <span className="text-amber-500 text-[10px] font-black tracking-widest uppercase">
                Fullscreen_Viewer
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(false);
                }}
                className="flex items-center gap-2 text-white bg-white/10 hover:bg-white/20 px-4 py-2 border border-white/10 transition-all"
              >
                <FiX />{" "}
                <span className="text-[9px] font-black uppercase">
                  Close_View
                </span>
              </button>
            </div>

            <img
              src={selectedSubmission.images[currentImgIndex]}
              className="max-w-full max-h-[80vh] object-contain shadow-[0_0_100px_rgba(0,0,0,0.5)]"
            />

            <button
              onClick={() =>
                handleDownload(selectedSubmission.images![currentImgIndex])
              }
              className="mt-8 px-8 py-3 bg-amber-500 text-black text-[10px] font-black uppercase hover:bg-amber-400 transition-all"
            >
              Download_This_Image
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PURGE MODAL */}
      <AnimatePresence>
        {submissionToPurge && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isProcessing && setSubmissionToPurge(null)}
              className="absolute inset-0 bg-black/90"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full max-w-md bg-[#080a0f] border border-red-500/30 p-8 text-center"
            >
              <FiAlertTriangle className="text-red-500 text-4xl mx-auto mb-4" />
              <h3 className="text-white font-black uppercase mb-2">
                Execute_Purge?
              </h3>
              <p className="text-gray-500 text-[10px] uppercase mb-8 leading-relaxed">
                Proceed with erasure of{" "}
                <span className="text-red-500">[{submissionToPurge.name}]</span>
                ?
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSubmissionToPurge(null)}
                  disabled={isProcessing}
                  className="py-3 border border-white/10 text-gray-500 text-[10px] font-black uppercase hover:text-white"
                >
                  Abort
                </button>
                <button
                  onClick={executePurge}
                  disabled={isProcessing}
                  className="py-3 bg-red-900/40 hover:bg-red-600 text-white border border-red-500/50 text-[10px] font-black uppercase"
                >
                  {isProcessing ? (
                    <FiLoader className="animate-spin mx-auto" />
                  ) : (
                    "Confirm_Delete"
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
