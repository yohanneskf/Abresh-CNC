"use client";

import { useState } from "react";
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLanguage } from "@/contexts/LanguageContext";
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

// Schema for Validation
const schema = yup.object({
  name: yup.string().required("Identification required"),
  email: yup
    .string()
    .email("Invalid data format")
    .required("Communication endpoint required"),
  phone: yup.string().required("Contact frequency required"),
  projectType: yup.string().required("Classification required"),
  description: yup.string().required("Technical brief required"),
  budget: yup.string(),
  timeline: yup.string(),
});

type FormData = yup.InferType<typeof schema>;

export default function ContactPage() {
  const { language, t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  // File states (Storing Base64 strings for DB)
  const [images, setImages] = useState<string[]>([]);
  const [files, setFiles] = useState<string[]>([]);
  const [previews, setPreviews] = useState<{ url: string; type: string }[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema) as Resolver<FormData>,
  });

  const projectTypes = [
    "Custom Furniture",
    "Office Setup",
    "Home Furniture",
    "Commercial Space",
    "CNC Manufacturing",
    "Design Consultation",
    "Other",
  ];

  // Logic to process files to Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);

      selectedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          if (file.type.startsWith("image/")) {
            setImages((prev) => [...prev, base64]);
            setPreviews((prev) => [...prev, { url: base64, type: "image" }]);
          } else {
            setFiles((prev) => [...prev, base64]);
            setPreviews((prev) => [
              ...prev,
              { url: "/pdf-placeholder.png", type: "pdf" },
            ]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeFile = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    // Note: In a real app, you'd match the index back to images/files arrays specifically
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          images, // From state
          files, // From state
          language,
        }),
      });

      if (!response.ok) throw new Error("UPSTREAM_COMM_FAILURE");

      setIsSubmitted(true);
    } catch (err) {
      setError("System encountered an error during transmission.");
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
          <FiCheckCircle className="h-16 w-16 text-amber-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black mb-4 uppercase text-white">
            Transmission Received
          </h2>
          <p className="text-gray-400 mb-8 italic">
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
      {/* HUD Background Grid */}
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
            System_Intake_v4.0
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4">
            {language === "en" ? "Start Project" : "ፕሮጀክት ይጀምሩ"}
          </h1>
          <p className="text-gray-500 max-w-xl font-light italic">
            Submit specifications for a high-precision manufacturing quote.
          </p>
        </header>

        <div className="grid lg:grid-cols-12 gap-0 border border-white/10 bg-white/[0.02] backdrop-blur-md">
          {/* Main Form */}
          <div className="lg:col-span-8 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-white/10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
              {/* Part 01: Identity */}
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-amber-500 font-mono text-xs">01</span>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Entity_Identification
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-2 group">
                    <label className="text-[9px] font-bold uppercase text-gray-500 tracking-widest group-focus-within:text-amber-500 transition-colors">
                      Client_Name
                    </label>
                    <input
                      {...register("name")}
                      className="w-full bg-transparent border-b border-white/10 py-3 focus:border-amber-500 outline-none transition-all placeholder:text-gray-800"
                      placeholder="ENTRY_REQUIRED"
                    />
                    {errors.name && (
                      <span className="text-[9px] text-red-500 font-mono uppercase">
                        {errors.name.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-[9px] font-bold uppercase text-gray-500 tracking-widest group-focus-within:text-amber-500 transition-colors">
                      Comm_Endpoint (Email)
                    </label>
                    <input
                      {...register("email")}
                      className="w-full bg-transparent border-b border-white/10 py-3 focus:border-amber-500 outline-none transition-all placeholder:text-gray-800"
                      placeholder="USER@DOMAIN.COM"
                    />
                  </div>
                </div>
              </section>

              {/* Part 02: Specs */}
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
                        className="w-full bg-transparent border-b border-white/10 py-3 focus:border-amber-500 outline-none appearance-none cursor-pointer"
                      >
                        {projectTypes.map((t) => (
                          <option key={t} value={t} className="bg-[#030712]">
                            {t}
                          </option>
                        ))}
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
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase text-gray-500 tracking-widest">
                      Technical_Brief
                    </label>
                    <textarea
                      {...register("description")}
                      rows={3}
                      className="w-full bg-transparent border-b border-white/10 py-3 focus:border-amber-500 outline-none resize-none"
                      placeholder="DESCRIBE_PROJECT_SCOPE_AND_MATERIAL_PREFERENCE..."
                    />
                  </div>
                </div>
              </section>

              {/* Part 03: Files */}
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
                  <FiUpload className="h-10 w-10 text-amber-500/40 mx-auto mb-4 group-hover:text-amber-500 group-hover:-translate-y-1 transition-all" />
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    Inject CAD_Sketches or Photos
                  </p>
                  <p className="text-[8px] text-gray-600 font-mono mt-2 uppercase">
                    Max_Capacity: 10MB per packet
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

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-mono uppercase">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 bg-amber-600 text-[#030712] font-black uppercase text-[12px] tracking-[0.5em] hover:bg-amber-500 transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
              >
                {isSubmitting ? (
                  <FiLoader className="animate-spin" />
                ) : (
                  <>
                    <FiSend className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />{" "}
                    INITIATE_TRANSFER
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 bg-white/[0.01] p-10 space-y-12">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 mb-8 flex items-center gap-2">
                <FiCpu /> Logic_Support
              </h4>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 border border-white/10 text-amber-500">
                    <FiPhone />
                  </div>
                  <div className="font-mono text-[11px] text-gray-400">
                    +251 911 123456
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 border border-white/10 text-amber-500">
                    <FiMail />
                  </div>
                  <div className="font-mono text-[11px] text-gray-400 uppercase">
                    log@cnc_core.io
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 mb-8">
                Pipeline_Sequence
              </h4>
              <div className="space-y-8 relative">
                <div className="absolute left-[15px] top-0 bottom-0 w-px bg-white/5" />
                {["Validation", "Nesting", "Fabrication"].map((step, i) => (
                  <div key={i} className="flex gap-6 relative">
                    <div className="w-8 h-8 rounded-full bg-[#030712] border border-amber-500/50 flex items-center justify-center z-10 text-[9px] font-bold text-amber-500">
                      {i + 1}
                    </div>
                    <div>
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-white">
                        {step}
                      </h5>
                      <p className="text-[9px] text-gray-600 font-light mt-1 uppercase">
                        Phase_{i + 1} Deployment
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-white/5">
              <div className="bg-amber-500/5 border border-amber-500/10 p-6">
                <p className="text-[10px] text-amber-200/50 font-light italic leading-relaxed">
                  // Commercial high-volume nesting and production optimization
                  available for B2B contracts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
