"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  FiLock,
  FiMail,
  FiAlertCircle,
  FiLogIn,
  FiCpu,
  FiShield,
} from "react-icons/fi";
import { motion } from "framer-motion";

type LoginForm = {
  email: string;
  password: string;
};

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.token) {
        localStorage.setItem("admin_token", result.token);
        document.cookie = `admin_token=${result.token}; path=/; max-age=86400; SameSite=Strict`;
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setError(result.error || "CREDENTIAL_REJECTED: ACCESS DENIED");
      }
    } catch (err) {
      setError("COMMUNICATION_FAILURE: CHECK NETWORK STATUS");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* SECURITY GRID BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(37,99,235,0.1),_transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(rgba(37, 99, 235, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(37, 99, 235, 0.2) 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        />
        {/* Animated Scanning Line */}
        <motion.div
          animate={{ top: ["0%", "100%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-[2px] bg-blue-500/20 z-0"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full z-10"
      >
        <div className="bg-white/[0.03] border border-white/10 backdrop-blur-xl p-8 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {/* Corner Decals */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-blue-500" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-blue-500" />

          <div className="text-center mb-10">
            <div className="mx-auto w-16 h-16 bg-blue-600/10 border border-blue-500/30 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(37,99,235,0.2)]">
              <FiShield className="h-8 w-8 text-blue-500" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em] mb-1">
              Auth Terminal
            </h2>
            <p className="text-[10px] text-blue-500 font-mono tracking-widest uppercase">
              System_Access_Level: 01
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ x: -10 }}
              animate={{ x: 0 }}
              className="mb-6 p-3 bg-red-900/20 border-l-2 border-red-500 flex items-center space-x-3 text-red-400"
            >
              <FiAlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="text-[10px] font-mono uppercase tracking-tighter">
                {error}
              </span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                User Identifier
              </label>
              <div className="relative group">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  {...register("email", { required: "ID required" })}
                  className="w-full bg-black/40 pl-10 pr-4 py-3 border border-white/10 text-white font-mono text-sm focus:border-blue-500/50 outline-none transition-all"
                  placeholder="admin@internal"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                Access Key
              </label>
              <div className="relative group">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="password"
                  {...register("password", { required: "Key required" })}
                  className="w-full bg-black/40 pl-10 pr-4 py-3 border border-white/10 text-white font-mono text-sm focus:border-blue-500/50 outline-none transition-all"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <label className="flex items-center cursor-pointer group">
                <input type="checkbox" className="hidden peer" />
                <div className="w-4 h-4 border border-white/20 peer-checked:bg-blue-600 transition-all mr-2 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white opacity-0 peer-checked:opacity-100" />
                </div>
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                  Keep Session
                </span>
              </label>

              <button
                type="button"
                className="text-[10px] text-blue-500 hover:text-blue-400 font-mono uppercase tracking-tighter"
                onClick={() => {
                  setValue("email", "admin@cncdesign.com");
                  setValue("password", "admin123");
                }}
              >
                [ LOAD_TEST_KEYS ]
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white py-4 font-black uppercase text-[12px] tracking-[0.3em] flex items-center justify-center space-x-3 transition-all shadow-[0_0_30px_rgba(37,99,235,0.2)]"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <FiCpu className="animate-spin h-4 w-4" />
                  <span>Decrypting...</span>
                </div>
              ) : (
                <>
                  <FiLogIn className="h-4 w-4" />
                  <span>Initialize Access</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Metadata */}
          <div className="mt-10 pt-6 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-gray-700">
            <span>SECURE_ENCRYPTION: AES-256</span>
            <span>OS_V: 2.0.4-LTS</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
