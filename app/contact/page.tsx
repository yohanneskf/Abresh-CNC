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
  FiImage,
  FiTrash2,
  FiLoader,
  FiPhone,
  FiMail,
  FiInfo,
} from "react-icons/fi";
import Image from "next/image";

const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  projectType: yup.string().required("Project type is required"),
  description: yup.string().required("Description is required"),
  budget: yup.string(),
  timeline: yup.string(),
});

type FormData = yup.InferType<typeof schema>;

export default function ContactPage() {
  const { language, t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter((file) => {
        const validTypes = [
          "image/jpeg",
          "image/png",
          "application/pdf",
          "image/webp",
        ];
        const maxSize = 10 * 1024 * 1024;
        return validTypes.includes(file.type) && file.size <= maxSize;
      });

      setFiles((prev) => [...prev, ...validFiles]);
      validFiles.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onloadend = () =>
            setFilePreviews((prev) => [...prev, reader.result as string]);
          reader.readAsDataURL(file);
        } else {
          setFilePreviews((prev) => [...prev, "/pdf-icon.png"]);
        }
      });
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);
    setUploadProgress(30);
    // Simulation of API call logic remains same as your original
    setTimeout(() => {
      setUploadProgress(100);
      setIsSubmitted(true);
      setIsSubmitting(false);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white/5 border border-blue-500/30 p-12 text-center backdrop-blur-xl"
        >
          <FiCheckCircle className="h-16 w-16 text-blue-500 mx-auto mb-6 shadow-[0_0_30px_rgba(37,99,235,0.4)]" />
          <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter">
            Transmission Received
          </h2>
          <p className="text-gray-400 mb-8 font-light italic">
            {language === "en"
              ? "Your project parameters have been logged. Expect a response within 24 standard hours."
              : "ጥያቄዎ በተሳካ ሁኔታ ቀርቧል። በ24 ሰዓታት ውስጥ እናገኝዎታለን።"}
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="w-full py-4 bg-blue-600 font-black uppercase text-[10px] tracking-[0.3em] hover:bg-blue-500 transition-all"
          >
            Return to Terminal
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-28 pb-20 relative overflow-hidden">
      {/* Background Grid System */}
      <div
        className="absolute inset-0 opacity-[0.1] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(37, 99, 235, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(37, 99, 235, 0.2) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-600/10 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <header className="mb-16">
          <span className="text-blue-500 font-bold tracking-[0.4em] uppercase text-[10px] mb-2 block">
            Project Intake
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6">
            {t("contact.title")}
          </h1>
          <p className="text-gray-500 max-w-xl font-light italic border-l-2 border-blue-600 pl-6">
            {language === "en"
              ? "Submit your technical specifications or design sketches for a high-precision manufacturing quote."
              : "ራዕይዎን ከእኛ ጋር ያጋሩ። ለበለጠ ትክክለኛ ዋጋ ምስሎችን ወይም ስእሎችን ይጫኑ።"}
          </p>
        </header>

        <div className="grid lg:grid-cols-12 gap-0 border border-white/10 bg-white/5 backdrop-blur-md">
          {/* Main Form (Left 8 Columns) */}
          <div className="lg:col-span-8 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-white/10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-px bg-blue-600" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    01. Entity Information
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">
                      {t("contact.name")}
                    </label>
                    <input
                      {...register("name")}
                      className="w-full bg-white/5 border-b border-white/20 py-3 focus:border-blue-500 outline-none transition-all placeholder:text-gray-700"
                      placeholder="NAME_ENTRY"
                    />
                    {errors.name && (
                      <span className="text-[10px] text-red-500 font-mono italic">
                        {errors.name.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">
                      {t("contact.email")}
                    </label>
                    <input
                      {...register("email")}
                      className="w-full bg-white/5 border-b border-white/20 py-3 focus:border-blue-500 outline-none transition-all placeholder:text-gray-700"
                      placeholder="EMAIL_ADDRESS"
                    />
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-px bg-blue-600" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    02. Design Parameters
                  </h3>
                </div>
                <div className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">
                        Classification
                      </label>
                      <select
                        {...register("projectType")}
                        className="w-full bg-white/5 border-b border-white/20 py-3 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                      >
                        {projectTypes.map((type) => (
                          <option
                            key={type}
                            value={type}
                            className="bg-[#030712]"
                          >
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">
                        Est. Budget
                      </label>
                      <input
                        {...register("budget")}
                        className="w-full bg-white/5 border-b border-white/20 py-3 focus:border-blue-500 outline-none transition-all"
                        placeholder="VALUATION_RANGE"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">
                      Technical Brief
                    </label>
                    <textarea
                      {...register("description")}
                      rows={4}
                      className="w-full bg-white/5 border-b border-white/20 py-3 focus:border-blue-500 outline-none transition-all resize-none"
                      placeholder="DESCRIBE_PROJECT_SCOPE..."
                    />
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-px bg-blue-600" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    03. Technical Attachments
                  </h3>
                </div>
                <div className="group relative border-2 border-dashed border-white/10 p-10 hover:border-blue-600/50 transition-all text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    id="file-upload"
                  />
                  <FiUpload className="h-8 w-8 text-blue-500 mx-auto mb-4 group-hover:-translate-y-1 transition-transform" />
                  <p className="text-xs font-bold uppercase tracking-widest mb-1">
                    Upload CAD/Sketches
                  </p>
                  <p className="text-[10px] text-gray-600 font-mono">
                    JPG, PNG, PDF | MAX 10MB
                  </p>
                </div>

                {files.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mt-6">
                    {filePreviews.map((prev, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square border border-white/10 group"
                      >
                        <Image
                          src={prev}
                          fill
                          alt="preview"
                          className="object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full"
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
                className="w-full py-6 bg-blue-600 text-white font-black uppercase text-[12px] tracking-[0.4em] hover:bg-blue-500 transition-all shadow-[0_0_40px_rgba(37,99,235,0.2)] flex items-center justify-center gap-4 group"
              >
                {isSubmitting ? (
                  <FiLoader className="animate-spin" />
                ) : (
                  <>
                    <FiSend className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />{" "}
                    START_PROCESS
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Sidebar (Right 4 Columns) */}
          <div className="lg:col-span-4 bg-white/[0.02] p-8 md:p-12 space-y-12">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-8">
                Technical Support
              </h4>
              <div className="space-y-6">
                <div className="flex items-center gap-4 group">
                  <div className="p-3 bg-white/5 border border-white/10 group-hover:border-blue-500 transition-colors">
                    <FiPhone className="text-blue-500" />
                  </div>
                  <div className="font-mono text-xs">+251 911 123456</div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="p-3 bg-white/5 border border-white/10 group-hover:border-blue-500 transition-colors">
                    <FiMail className="text-blue-500" />
                  </div>
                  <div className="font-mono text-xs">LOG@CNC_STUDIO.COM</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-8">
                Manufacturing Pipeline
              </h4>

              <div className="space-y-8 relative">
                <div className="absolute left-[15px] top-0 bottom-0 w-px bg-white/10" />
                {[
                  {
                    t: "Verification",
                    d: "CAD file stress test & material analysis",
                  },
                  {
                    t: "Optimization",
                    d: "Nesting patterns for zero-waste production",
                  },
                  { t: "Fabrication", d: "0.01mm tolerance CNC milling cycle" },
                ].map((step, i) => (
                  <div key={i} className="flex gap-6 relative">
                    <div className="w-8 h-8 rounded-full bg-[#030712] border border-blue-500/50 flex items-center justify-center z-10 text-[10px] font-bold text-blue-500">
                      {i + 1}
                    </div>
                    <div>
                      <h5 className="text-[10px] font-black uppercase tracking-widest">
                        {step.t}
                      </h5>
                      <p className="text-[10px] text-gray-600 font-light mt-1">
                        {step.d}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-white/5">
              <div className="bg-blue-600/10 border border-blue-600/20 p-6 flex gap-4">
                <FiInfo className="text-blue-500 shrink-0 mt-1" />
                <p className="text-[10px] text-blue-100 font-light italic leading-relaxed">
                  Bulk order pricing is available for commercial office fit-outs
                  and real estate developments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
