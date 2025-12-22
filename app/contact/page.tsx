"use client";

import { useState } from "react";
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEdgeStore } from "@/lib/edgestore"; // Ensure path is correct
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSend,
  FiUpload,
  FiCheckCircle,
  FiX,
  FiLoader,
  FiPhone,
  FiMail,
  FiInfo,
  FiFileText,
  FiCpu,
} from "react-icons/fi";
import Image from "next/image";

const schema = yup.object({
  name: yup.string().required("Identification required"),
  email: yup.string().email("Invalid format").required("Email required"),
  phone: yup.string().required("Phone required"),
  projectType: yup.string().required("Classification required"),
  description: yup.string().required("Brief required"),
  budget: yup.string(),
  timeline: yup.string(),
});

type FormData = yup.InferType<typeof schema>;

export default function ContactPage() {
  const { language, t } = useLanguage();
  const { edgestore } = useEdgeStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Store actual File objects for EdgeStore
  const [rawFiles, setRawFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ url: string; type: string }[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema) as Resolver<FormData>,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setRawFiles((prev) => [...prev, ...selectedFiles]);

      selectedFiles.forEach((file) => {
        const url = URL.createObjectURL(file);
        setPreviews((prev) => [
          ...prev,
          { url, type: file.type.startsWith("image/") ? "image" : "pdf" },
        ]);
      });
    }
  };

  const removeFile = (index: number) => {
    setRawFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);
    setError("");

    try {
      const uploadedImageUrls: string[] = [];
      const uploadedFileUrls: string[] = [];

      // 1. Upload all files to EdgeStore first
      await Promise.all(
        rawFiles.map(async (file) => {
          const res = await edgestore.publicFiles.upload({ file });
          if (file.type.startsWith("image/")) {
            uploadedImageUrls.push(res.url);
          } else {
            uploadedFileUrls.push(res.url);
          }
        })
      );

      // 2. Send URLs to your local API
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          images: uploadedImageUrls,
          files: uploadedFileUrls,
          language,
        }),
      });

      if (!response.ok) throw new Error("UPSTREAM_COMM_FAILURE");
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("System encountered an error during file uplink.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-md w-full bg-white/5 border border-amber-500/30 p-12 text-center"
        >
          <FiCheckCircle className="h-16 w-16 text-amber-500 mx-auto mb-6 shadow-[0_0_30px_rgba(245,158,11,0.2)]" />
          <h2 className="text-3xl font-black mb-4 uppercase text-white">
            Transmission Received
          </h2>
          <p className="text-gray-400 mb-8 italic italic">
            Parameters logged. Awaiting technical review.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-amber-600 font-black uppercase text-[10px] tracking-widest hover:bg-amber-500 transition-all text-[#030712]"
          >
            Re-Initialize Terminal
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-28 pb-20 relative overflow-hidden selection:bg-amber-500/30">
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(245, 158, 11, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 158, 11, 0.2) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <header className="mb-16 border-l-2 border-amber-600 pl-8">
          <span className="text-amber-500 font-bold tracking-[0.4em] uppercase text-[10px] mb-2 block">
            System_Intake_v4.5
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4">
            {language === "en" ? "Start Project" : "ፕሮጀክት ይጀምሩ"}
          </h1>
        </header>

        <div className="grid lg:grid-cols-12 gap-0 border border-white/10 bg-white/[0.02] backdrop-blur-md">
          <div className="lg:col-span-8 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-white/10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
              {/* Identity Section */}
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-amber-500 font-mono text-xs">01</span>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Entity_Identification
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase text-gray-500 tracking-widest">
                      Client_Name
                    </label>
                    <input
                      {...register("name")}
                      className="w-full bg-transparent border-b border-white/10 py-3 focus:border-amber-500 outline-none transition-all placeholder:text-gray-800"
                      placeholder="ENTRY_REQUIRED"
                    />
                    {errors.name && (
                      <span className="text-[9px] text-red-500 font-mono">
                        {errors.name.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase text-gray-500 tracking-widest">
                      Comm_Endpoint
                    </label>
                    <input
                      {...register("email")}
                      className="w-full bg-transparent border-b border-white/10 py-3 focus:border-amber-500 outline-none transition-all placeholder:text-gray-800"
                      placeholder="USER@DOMAIN.COM"
                    />
                  </div>
                </div>
              </section>

              {/* Specs Section */}
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-amber-500 font-mono text-xs">02</span>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Project_Parameters
                  </h3>
                </div>
                <div className="space-y-10">
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase text-gray-500 tracking-widest">
                        Classification
                      </label>
                      <select
                        {...register("projectType")}
                        className="w-full bg-transparent border-b border-white/10 py-3 focus:border-amber-500 outline-none appearance-none"
                      >
                        <option
                          value="CNC Manufacturing"
                          className="bg-[#030712]"
                        >
                          CNC Manufacturing
                        </option>
                        <option
                          value="Custom Furniture"
                          className="bg-[#030712]"
                        >
                          Custom Furniture
                        </option>
                        <option value="Other" className="bg-[#030712]">
                          Other
                        </option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase text-gray-500 tracking-widest">
                        Phone_Frequency
                      </label>
                      <input
                        {...register("phone")}
                        className="w-full bg-transparent border-b border-white/10 py-3 focus:border-amber-500 outline-none"
                        placeholder="+251..."
                      />
                    </div>
                  </div>
                  <textarea
                    {...register("description")}
                    rows={3}
                    className="w-full bg-transparent border-b border-white/10 py-3 focus:border-amber-500 outline-none resize-none"
                    placeholder="DESCRIBE_PROJECT_SCOPE..."
                  />
                </div>
              </section>

              {/* Attachments Section */}
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-amber-500 font-mono text-xs">03</span>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Technical_Attachments
                  </h3>
                </div>
                <div className="relative border border-dashed border-white/10 p-12 hover:border-amber-500/40 transition-all text-center group">
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                  />
                  <FiUpload className="h-10 w-10 text-amber-500/40 mx-auto mb-4 group-hover:text-amber-500 transition-all" />
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    Uplink CAD_Sketches or Photos
                  </p>
                </div>

                {previews.length > 0 && (
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-4 mt-8">
                    {previews.map((item, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square border border-white/10 group bg-white/5"
                      >
                        {item.type === "image" ? (
                          <img
                            src={item.url}
                            alt="prev"
                            className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FiFileText className="text-amber-500" />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FiX size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 bg-amber-600 text-[#030712] font-black uppercase text-[12px] tracking-[0.5em] hover:bg-amber-500 transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
              >
                {isSubmitting ? (
                  <FiLoader className="animate-spin" />
                ) : (
                  <>
                    <FiSend /> INITIATE_TRANSFER
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 bg-white/[0.01] p-10 space-y-12">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 flex items-center gap-2">
              <FiCpu /> Logic_Support
            </h4>
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-gray-400 font-mono text-[11px]">
                <FiPhone className="text-amber-500" /> +251 911 123456
              </div>
              <div className="flex items-center gap-4 text-gray-400 font-mono text-[11px] uppercase">
                <FiMail className="text-amber-500" /> log@cnc_core.io
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
