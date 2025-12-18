"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiUpload,
  FiPlus,
  FiTrash2,
  FiInfo,
  FiCpu,
  FiBox,
  FiLayers,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

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
  dimensions: {
    length: string;
    width: string;
    height: string;
    unit: string;
  };
  featured: boolean;
};

export default function ProjectForm({ onSuccess }: ProjectFormProps) {
  const [images, setImages] = useState<string[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);
  const [newMaterial, setNewMaterial] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    defaultValues: {
      dimensions: { unit: "cm" },
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const addMaterial = () => {
    if (newMaterial.trim()) {
      setMaterials((prev) => [...prev, newMaterial.trim()]);
      setNewMaterial("");
    }
  };

  const removeMaterial = (index: number) => {
    setMaterials((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProjectFormData) => {
    setLoading(true);
    try {
      const projectData = { ...data, materials, images };
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        reset();
        setImages([]);
        setMaterials([]);
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setLoading(false);
    }
  };

  const inputStyles =
    "w-full bg-white/5 border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-600";
  const labelStyles =
    "block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2";

  return (
    <div className="bg-[#0a0a0b] border border-white/10 rounded-sm overflow-hidden selection:bg-blue-500/30">
      {/* Header Bar */}
      <div className="bg-white/[0.02] border-b border-white/10 px-8 py-4 flex items-center gap-3">
        <FiCpu className="text-blue-500" />
        <h2 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">
          Asset_Creation_Terminal
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-10">
        {/* SECTION 1: IDENTIFICATION */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-[1px] w-4 bg-blue-600" />
            <span className={labelStyles}>Identification_Labels</span>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyles}>Primary_Designation (EN) *</label>
              <input
                type="text"
                {...register("titleEn", { required: "Required" })}
                placeholder="e.g., PARAMETRIC_STOOL_01"
                className={inputStyles}
              />
            </div>
            <div>
              <label className={labelStyles}>
                Secondary_Designation (AM) *
              </label>
              <input
                type="text"
                {...register("titleAm", { required: "Required" })}
                placeholder="ፕሮጀክት ስም"
                className={`${inputStyles} font-amharic`}
              />
            </div>
          </div>
        </section>

        {/* SECTION 2: SPECIFICATIONS */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-[1px] w-4 bg-blue-600" />
            <span className={labelStyles}>Technical_Details</span>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyles}>Description_Log (EN) *</label>
              <textarea
                rows={4}
                {...register("descriptionEn", { required: true })}
                className={inputStyles}
                placeholder="Detailed architectural specifications..."
              />
            </div>
            <div>
              <label className={labelStyles}>Description_Log (AM) *</label>
              <textarea
                rows={4}
                {...register("descriptionAm", { required: true })}
                className={`${inputStyles} font-amharic`}
                placeholder="ዝርዝር መግለጫ..."
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyles}>System_Classification *</label>
              <select
                {...register("category", { required: true })}
                className={inputStyles}
              >
                <option value="" className="bg-[#0a0a0b]">
                  Select Category
                </option>
                <option value="living" className="bg-[#0a0a0b]">
                  Living Room
                </option>
                <option value="bedroom" className="bg-[#0a0a0b]">
                  Bedroom
                </option>
                <option value="office" className="bg-[#0a0a0b]">
                  Office
                </option>
                <option value="commercial" className="bg-[#0a0a0b]">
                  Commercial
                </option>
              </select>
            </div>
            <div>
              <label className={labelStyles}>Material_Composition</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMaterial}
                  onChange={(e) => setNewMaterial(e.target.value)}
                  className={inputStyles}
                  placeholder="e.g., 18mm_Birch_Plywood"
                />
                <button
                  type="button"
                  onClick={addMaterial}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 transition-colors"
                >
                  <FiPlus />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {materials.map((m, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-mono text-blue-400"
                  >
                    {m}{" "}
                    <FiTrash2
                      onClick={() => removeMaterial(i)}
                      className="cursor-pointer hover:text-red-500"
                    />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: DIMENSIONS */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-[1px] w-4 bg-blue-600" />
            <span className={labelStyles}>Geometry_Matrix</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["length", "width", "height"].map((dim) => (
              <div key={dim}>
                <label className={labelStyles}>{dim}</label>
                <input
                  type="text"
                  {...register(`dimensions.${dim}` as any)}
                  className={inputStyles}
                  placeholder="0.00"
                />
              </div>
            ))}
            <div>
              <label className={labelStyles}>Unit</label>
              <select {...register("dimensions.unit")} className={inputStyles}>
                <option value="cm" className="bg-[#0a0a0b]">
                  CM
                </option>
                <option value="mm" className="bg-[#0a0a0b]">
                  MM
                </option>
                <option value="inch" className="bg-[#0a0a0b]">
                  INCH
                </option>
              </select>
            </div>
          </div>
        </section>

        {/* SECTION 4: VISUAL ASSETS */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-[1px] w-4 bg-blue-600" />
            <span className={labelStyles}>Visual_Payload_Upload</span>
          </div>
          <div className="border border-dashed border-white/10 bg-white/[0.01] p-10 hover:border-blue-500/50 transition-all group">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="asset-upload"
            />
            <label
              htmlFor="asset-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <FiUpload className="h-8 w-8 text-gray-600 group-hover:text-blue-500 transition-colors mb-4" />
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-white">
                Inject_Visual_Data
              </span>
            </label>

            <AnimatePresence>
              {images.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8 grid grid-cols-3 md:grid-cols-6 gap-4"
                >
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="aspect-square border border-white/10 p-1 bg-white/5 relative group"
                    >
                      <img
                        src={img}
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
                        alt="Upload"
                      />
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* FINALIZATION */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
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
            <span className="text-[10px] font-black uppercase text-gray-500 group-hover:text-white tracking-widest transition-colors">
              Priority_Featured_Listing
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-12 py-4 bg-blue-600 text-white font-black text-[11px] uppercase tracking-[0.3em] hover:bg-blue-500 disabled:opacity-50 transition-all shadow-[0_0_30px_rgba(37,99,235,0.2)]"
          >
            {loading ? "INITIALIZING_UPLOAD..." : "EXECUTE_DEPLOYMENT"}
          </button>
        </div>
      </form>
    </div>
  );
}
