"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiFacebook,
  FiInstagram,
  FiLinkedin,
} from "react-icons/fi";
import Link from "next/link";

export default function Footer() {
  const { t, language } = useLanguage();

  const currentYear = new Date().getFullYear();

  const contactInfo = [
    {
      icon: <FiPhone className="h-5 w-5" />,
      text: language === "en" ? "+1 (555) 123-4567" : "+251 911 123456",
    },
    {
      icon: <FiMail className="h-5 w-5" />,
      text: "contact@cncdesign.com",
    },
    {
      icon: <FiMapPin className="h-5 w-5" />,
      text:
        language === "en"
          ? "123 Industrial Ave, Design District"
          : "ኢንዱስትሪ አቨንዩ 123, ዲዛይን ዲስትሪክት",
    },
  ];

  const socialLinks = [
    { icon: <FiFacebook />, href: "https://facebook.com", label: "Facebook" },
    {
      icon: <FiInstagram />,
      href: "https://instagram.com",
      label: "Instagram",
    },
    { icon: <FiLinkedin />, href: "https://linkedin.com", label: "LinkedIn" },
  ];

  const quickLinks = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.projects"), href: "/projects" },
    { label: t("nav.about"), href: "/about" },
    { label: t("nav.contact"), href: "/contact" },
  ];

  const services = [
    { label: "CNC Furniture Design", href: "/services#cnc" },
    { label: "Custom Manufacturing", href: "/services#manufacturing" },
    { label: "3D Modeling", href: "/services#3d" },
    { label: "Installation", href: "/services#installation" },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              CNC<span className="text-blue-400">DESIGN</span>
            </h3>
            <p className="text-gray-400 mb-6">
              {language === "en"
                ? "Precision CNC furniture design and manufacturing with industrial excellence."
                : "በኢንዱስትሪ ደረጃ ትክክለኛ CNC የዕቃ ንድፍ እና ማምረቻ።"}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-blue-600 p-2 rounded-full transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {language === "en" ? "Our Services" : "አገልግሎቶቻችን"}
            </h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {language === "en" ? "Contact Us" : "አግኙን"}
            </h4>
            <ul className="space-y-3">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="text-blue-400 mt-0.5">{info.icon}</span>
                  <span className="text-gray-400">{info.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} CNC Design Studio. {t("footer.copyright")}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white text-sm"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
