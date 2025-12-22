"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiUpload,
  FiPlus,
  FiTrash2,
  FiCpu,
  FiLayers,
  FiLoader,
  FiCheck,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useEdgeStore } from "@/lib/edgestore";

interface ProjectFormProps {
  onSuccess: () => void;
}

type ProjectFormData = {
  titleEn: string;
  titleAm: string;
  descriptionEn: string;
  descriptionAm: string;
  category: string;
  materials: string[];
  dimensions: { length: string; width: string; height: string; unit: string };
  featured: boolean;
};

export default function ProjectForm({ onSuccess }: ProjectFormProps) {
  const { edgestore } = useEdgeStore();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [materials, setMaterials] = useState<string[]>([]);
  const [newMaterial, setNewMaterial] = useState("");

  const { register, handleSubmit, reset } = useForm<ProjectFormData>({
    defaultValues: { featured: false, dimensions: { unit: "cm" } },
  });

  const onSubmit = async (data: ProjectFormData) => {
    setLoading(true);
    try {
      const uploadedImageUrls: string[] = [];

      // Upload to EdgeStore
      for (const file of files) {
        const res = await edgestore.publicFiles.upload({ file });
        uploadedImageUrls.push(res.url);
      }

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, materials, images: uploadedImageUrls }),
      });

      if (response.ok) {
        reset();
        setFiles([]);
        setMaterials([]);
        onSuccess();
      }
    } catch (error) {
      console.error("UPLOAD_CRITICAL_FAILURE", error);
    } finally {
      setLoading(false);
    }
  };

  const inputStyles =
    "w-full bg-white/5 border border-white/10 px-4 py-3 text-white text-sm focus:border-blue-500 outline-none transition-all";
  const labelStyles =
    "block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-8 space-y-10 bg-[#0a0a0b] border border-white/10 font-mono"
    >
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <FiCpu className="text-blue-500" />
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em]">
          Asset_Creation_Terminal
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <label className={labelStyles}>Identification_EN</label>
          <input
            {...register("titleEn")}
            className={inputStyles}
            placeholder="STOOL_BETA_01"
          />
        </div>
        <div>
          <label className={labelStyles}>Identification_AM</label>
          <input
            {...register("titleAm")}
            className={`${inputStyles} font-amharic`}
            placeholder="የፕሮጀክት ስም"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <textarea
          {...register("descriptionEn")}
          rows={3}
          className={inputStyles}
          placeholder="TECHNICAL_LOG_EN"
        />
        <textarea
          {...register("descriptionAm")}
          rows={3}
          className={`${inputStyles} font-amharic`}
          placeholder="TECHNICAL_LOG_AM"
        />
      </div>

      {/* EdgeStore Visual Input */}
      <section>
        <label className={labelStyles}>Visual_Payload_Queue</label>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          <label className="aspect-square border border-dashed border-white/10 hover:border-blue-500 flex flex-col items-center justify-center cursor-pointer transition-all">
            <FiUpload className="text-gray-500 mb-2" />
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) =>
                e.target.files &&
                setFiles([...files, ...Array.from(e.target.files)])
              }
            />
          </label>
          {files.map((file, i) => (
            <div
              key={i}
              className="relative aspect-square border border-white/10 group"
            >
              <img
                src={URL.createObjectURL(file)}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
              />
              <button
                type="button"
                onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                className="absolute top-1 right-1 bg-red-600 p-1 text-white opacity-0 group-hover:opacity-100"
              >
                <FiTrash2 size={10} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Geometry & Materials */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <label className={labelStyles}>System_Classification</label>
          <select {...register("category")} className={inputStyles}>
            <option value="living">LIVING_ROOM</option>
            <option value="office">OFFICE_WORKSPACE</option>
            <option value="commercial">COMMERCIAL</option>
          </select>
        </div>
        <div>
          <label className={labelStyles}>Materials_Checklist</label>
          <div className="flex gap-2">
            <input
              value={newMaterial}
              onChange={(e) => setNewMaterial(e.target.value)}
              className={inputStyles}
              placeholder="Material_ID"
            />
            <button
              type="button"
              onClick={() => {
                if (newMaterial) setMaterials([...materials, newMaterial]);
                setNewMaterial("");
              }}
              className="bg-blue-600 px-4"
            >
              <FiPlus />
            </button>
          </div>
        </div>
      </div>

      {/* Priority Checkbox */}
      <div className="flex items-center justify-between pt-6 border-t border-white/5">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              {...register("featured")}
              className="peer hidden"
            />
            <div className="w-5 h-5 border border-white/20 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all" />
            <FiLayers className="absolute inset-0 m-auto text-[10px] text-white opacity-0 peer-checked:opacity-100" />
          </div>
          <span className="text-[10px] font-black uppercase text-gray-500 group-hover:text-white tracking-widest">
            Priority_Featured_Listing
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="px-12 py-4 bg-blue-600 text-white font-black text-[11px] uppercase tracking-[0.3em] hover:bg-blue-500 disabled:opacity-20 flex items-center gap-3"
        >
          {loading ? <FiLoader className="animate-spin" /> : <FiCheck />}
          {loading ? "COMMITTING_CHANGES..." : "EXECUTE_DEPLOYMENT"}
        </button>
      </div>
    </form>
  );
}
