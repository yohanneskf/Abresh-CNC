"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import { FiArrowRight, FiTool } from "react-icons/fi";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative bg-gradient-to-r from-gray-900 to-blue-900 text-white">
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <FiTool className="h-8 w-8 text-blue-400" />
              <span className="text-sm font-semibold tracking-wider uppercase text-blue-300">
                CNC Precision
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {t("hero.title")}
            </h1>

            <p className="text-xl text-gray-300 mb-8">{t("hero.subtitle")}</p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/projects"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
              >
                <span>{t("hero.cta")}</span>
                <FiArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                {t("hero.contact")}
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              {/* Hero image placeholder */}
              <div className="w-full h-full bg-gradient-to-br from-blue-800 to-gray-900 flex items-center justify-center">
                <div className="text-center p-8">
                  <FiTool className="h-32 w-32 text-white opacity-20 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white opacity-75">
                    Industrial Design Excellence
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
