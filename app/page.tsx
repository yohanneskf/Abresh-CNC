"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Hero from "@/components/Hero";
import FeaturedProjects from "@/components/FeaturedProjects";
import Services from "@/components/Services";
import { motion } from "framer-motion";

// Animation Variants for consistency
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-0">
      {/* Hero Section - Loads immediately */}
      <Hero />

      {/* Featured Projects Section */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              {t("projects.title")}
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6" />{" "}
            {/* Decorative CNC-style line */}
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t("hero.subtitle")}
            </p>
          </motion.div>

          {/* Staggered load for the grid */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <FeaturedProjects />
          </motion.div>
        </div>
      </section>

      {/* Services Section with a subtle background contrast */}
      <section className="bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Services />
        </motion.div>
      </section>
    </div>
  );
}
