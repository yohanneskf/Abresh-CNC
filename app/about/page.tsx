"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import {
  FiCheck,
  FiUsers,
  FiAward,
  FiPackage,
  FiTarget,
  FiZap,
  FiArrowRight,
} from "react-icons/fi";
import { motion } from "framer-motion";

export default function AboutPage() {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "About CNC Design Studio",
      subtitle: "Precision engineering meets bespoke craftsmanship",
      mission: {
        title: "The Mission",
        description:
          "To revolutionize interior architecture through CNC precision, creating pieces that balance industrial accuracy with artistic soul.",
      },
      vision: {
        title: "The Vision",
        description:
          "To be the global benchmark for high-performance furniture design, defined by sustainable innovation and mathematical beauty.",
      },
      values: [
        {
          title: "Precision",
          description:
            "Every cut and joint executed with 0.01mm industrial accuracy.",
        },
        {
          title: "Innovation",
          description:
            "Iterative design using advanced CAD/CAM software suites.",
        },
        {
          title: "Quality",
          description:
            "Grade-A sustainable materials sourced from verified suppliers.",
        },
        {
          title: "Integrity",
          description: "Transparent production cycles from draft to delivery.",
        },
      ],
      stats: [
        { label: "Completed Units", value: "200+" },
        { label: "Design Partners", value: "150+" },
        { label: "Manufacturing Years", value: "8+" },
        { label: "Material Profiles", value: "25+" },
      ],
      process: [
        { title: "Consultation", description: "Architectural needs analysis." },
        {
          title: "CAD Modeling",
          description: "Digital prototyping & 3D stress testing.",
        },
        {
          title: "CNC Production",
          description: "Automated precision milling & finishing.",
        },
        {
          title: "Final Assembly",
          description: "Hand-finished quality inspection.",
        },
      ],
    },
    am: {
      title: "ስለ CNC ዲዛይን ስቱዲዮ",
      subtitle: "ትክክለኛነት በዕቃ ንድፍ ውስጥ ከሠራተኛነት ጋር ይገናኛል",
      mission: {
        title: "ተልእኳችን",
        description:
          "በCNC ትክክለኛነት የዕቃ ንድፍን በማማወር፣ ተግባራዊነትን ከሥነ ጥበባዊ አገላለጽ ጋር የሚያጣምሩ ብጁ ቁራጮችን መፍጠር።",
      },
      vision: {
        title: "ራዕያችን",
        description:
          "በአለም አቀፍ ደረጃ መሪ CNC የዕቃ ንድፍ ስቱዲዮ መሆን፣ ለማሕበረሰብ፣ ጥራት እና ዘላቂ ተግባሮች ተገኝቶ።",
      },
      values: [
        {
          title: "ትክክለኛነት",
          description: "እያንዳንዱ መቁረጥ፣ እያንዳንዱ መገጣጠም በCNC ትክክለኛነት ይከናወናል",
        },
        { title: "ማሕበረሰብ", description: "በአዲስ ዲዛይኖች እና ቴክኒኮች ወሰኖችን መጉላላት" },
        {
          title: "ጥራት",
          description: "የፕሪሚየም ቁሳቁሶችን እና የተረጋገጠ የሠራተኛነት ክህሎትን መጠቀም",
        },
        { title: "ዘላቂነት", description: "ኢኮ-ፍሬንድሊ ተግባሮች እና ተጠያቂ ምንጭ" },
      ],
      stats: [
        { label: "የተጠናቀቁ ፕሮጀክቶች", value: "200+" },
        { label: "ደስተኞች ደንበኞች", value: "150+" },
        { label: "የልምድ ዓመታት", value: "8+" },
        { label: "የተጠቀሙ ቁሳቁሶች", value: "25+" },
      ],
      process: [
        { title: "ምክክር", description: "ፍላጎቶችዎን እና ራዕይዎን መረዳት" },
        { title: "ንድፍ", description: "ዝርዝር 3D ሞዴሎች እና ዕቅዶች መፍጠር" },
        { title: "ማምረቻ", description: "CNC ትክክለኛ መቁረጥ እና ማቀናበር" },
        { title: "አቅርቦት", description: "ሙያዊ መጫን እና ማቀናበር" },
      ],
    },
  };

  const t = language === "en" ? content.en : content.am;

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-20">
      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(37,99,235,0.07),_transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage: `linear-gradient(rgba(37, 99, 235, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(37, 99, 235, 0.2) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* HERO SECTION */}
      <section className="relative py-24 z-10 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 text-center"
        >
          <span className="text-blue-500 font-bold tracking-[0.4em] uppercase text-[10px] mb-4 block">
            Engineered Legacy
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase italic">
            {t.title}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            {t.subtitle}
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto mt-10 shadow-[0_0_20px_rgba(37,99,235,0.5)]" />
        </motion.div>
      </section>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* MISSION & VISION */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {[t.mission, t.vision].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 p-10 backdrop-blur-md relative group hover:border-blue-500/50 transition-colors"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                {i === 0 ? <FiTarget size={60} /> : <FiZap size={60} />}
              </div>
              <h3 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-4">
                {item.title}
              </h3>
              <p className="text-xl font-medium text-gray-200 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
          {t.stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border-l-2 border-blue-600 p-8"
            >
              <div className="text-4xl font-black mb-2 tracking-tighter">
                {stat.value}
              </div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* VALUES */}
        <div className="mb-24">
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-3xl font-black uppercase tracking-tighter">
              Core Values
            </h2>
            <div className="h-px flex-grow bg-white/10" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.values.map((value, index) => (
              <div
                key={index}
                className="border border-white/5 p-8 hover:bg-white/[0.02] transition-colors"
              >
                <FiCheck className="text-blue-500 mb-6 h-6 w-6" />
                <h3 className="text-lg font-bold mb-3 uppercase tracking-tight">
                  {value.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* PROCESS */}
        <div className="pt-20 border-t border-white/10">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-center mb-16">
            The Production Workflow
          </h2>

          <div className="grid md:grid-cols-4 gap-0 border border-white/10">
            {t.process.map((step, index) => (
              <div
                key={index}
                className="relative p-10 border-b md:border-b-0 md:border-r border-white/10 group hover:bg-blue-600 transition-all duration-500"
              >
                <span className="absolute top-4 left-4 text-[10px] font-mono text-white/20 group-hover:text-white/50">
                  0{index + 1}
                </span>
                <h3 className="text-lg font-black text-gray-200 group-hover:text-white mb-4 uppercase tracking-tighter">
                  {step.title}
                </h3>
                <p className="text-gray-500 group-hover:text-blue-100 text-sm">
                  {step.description}
                </p>
                <FiArrowRight className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
