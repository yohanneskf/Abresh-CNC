"use client";

import { useState } from "react";
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  FiSend,
  FiUpload,
  FiCheckCircle,
  FiX,
  FiImage,
  FiTrash2,
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

      // Validate file types and sizes
      const validFiles = newFiles.filter((file) => {
        const validTypes = [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "application/pdf",
          "image/webp",
        ];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!validTypes.includes(file.type)) {
          alert(
            `File ${file.name} has invalid type. Only images and PDFs are allowed.`
          );
          return false;
        }

        if (file.size > maxSize) {
          alert(`File ${file.name} is too large. Maximum size is 10MB.`);
          return false;
        }

        return true;
      });

      setFiles((prev) => [...prev, ...validFiles]);

      // Create previews for images
      validFiles.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setFilePreviews((prev) => [...prev, reader.result as string]);
          };
          reader.readAsDataURL(file);
        } else {
          // For PDFs, use a generic icon
          setFilePreviews((prev) => [...prev, "/pdf-icon.png"]);
        }
      });
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // Convert files to base64
      const filePromises = files.map((file) => convertFileToBase64(file));
      const fileDataUrls = await Promise.all(filePromises);

      // Update progress
      setUploadProgress(50);

      // Submit form data with files
      const formData = {
        ...data,
        images: fileDataUrls,
        language: language,
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setUploadProgress(100);
        setIsSubmitted(true);
        reset();
        setFiles([]);
        setFilePreviews([]);

        // Reset progress after success
        setTimeout(() => setUploadProgress(0), 2000);
      } else {
        throw new Error(result.error || "Submission failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(
        `Submission failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setUploadProgress(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {language === "en" ? "Thank You!" : "አመሰግናለሁ!"}
            </h2>
            <p className="text-gray-600 mb-6">
              {language === "en"
                ? "Your inquiry has been submitted successfully. We will contact you within 24 hours."
                : "ጥያቄዎ በተሳካ ሁኔታ ቀርቧል። በ24 ሰዓታት ውስጥ እናገኝዎታለን።"}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold"
              >
                {language === "en" ? "Submit Another Request" : "ሌላ ጥያቄ አስገባ"}
              </button>
              <a
                href="/projects"
                className="block w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                {language === "en" ? "Browse Projects" : "ፕሮጀክቶችን ይመልከቱ"}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t("contact.title")}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {language === "en"
              ? "Share your vision with us. Upload images or sketches for a more accurate quote."
              : "ራዕይዎን ከእኛ ጋር ያጋሩ። ለበለጠ ትክክለኛ ዋጋ ምስሎችን ወይም ስእሎችን ይጫኑ።"}
          </p>
        </div>

        {/* Progress Bar */}
        {uploadProgress > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-blue-600">
                {language === "en" ? "Uploading files..." : "ፋይሎች በመጫን ላይ..."}
              </span>
              <span className="text-sm font-medium text-gray-600">
                {uploadProgress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Left Side - Form */}
            <div className="md:w-2/3 p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {language === "en" ? "Personal Information" : "የግል መረጃ"}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("contact.name")} *
                      </label>
                      <input
                        type="text"
                        {...register("name")}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder={language === "en" ? "John Doe" : "የሰይም ስም"}
                        disabled={isSubmitting}
                      />
                      {errors.name && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("contact.email")} *
                      </label>
                      <input
                        type="email"
                        {...register("email")}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="email@example.com"
                        disabled={isSubmitting}
                      />
                      {errors.email && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("contact.phone")} *
                    </label>
                    <input
                      type="tel"
                      {...register("phone")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder={
                        language === "en"
                          ? "+1 (555) 123-4567"
                          : "+251 911 123456"
                      }
                      disabled={isSubmitting}
                    />
                    {errors.phone && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Project Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {language === "en" ? "Project Details" : "የፕሮጀክት ዝርዝሮች"}
                  </h3>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("contact.project")} *
                    </label>
                    <select
                      {...register("projectType")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      disabled={isSubmitting}
                    >
                      <option value="">
                        {language === "en"
                          ? "Select project type"
                          : "የፕሮጀክት አይነት ይምረጡ"}
                      </option>
                      {projectTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.projectType && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.projectType.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("contact.description")} *
                    </label>
                    <textarea
                      {...register("description")}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder={
                        language === "en"
                          ? "Describe your project, materials, dimensions, and any specific requirements..."
                          : "ፕሮጀክትዎን፣ ቁሳቁሶችን፣ ልኬቶችን እና ማንኛውንም የተለየ መስፈርት ይግለጹ..."
                      }
                      disabled={isSubmitting}
                    />
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("contact.budget")}
                      </label>
                      <input
                        type="text"
                        {...register("budget")}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder={
                          language === "en"
                            ? "$1,000 - $5,000"
                            : "ብር 1,000 - 5,000"
                        }
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("contact.timeline")}
                      </label>
                      <input
                        type="text"
                        {...register("timeline")}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder={
                          language === "en" ? "2-4 weeks" : "2-4 ሳምንታት"
                        }
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                {/* File Upload Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {language === "en"
                      ? "Upload Files (Optional)"
                      : "ፋይሎችን ይጫኑ (አማራጭ)"}
                  </h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                      disabled={isSubmitting}
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center mb-4">
                        <FiUpload className="h-8 w-8 text-blue-600" />
                      </div>
                      <span className="text-lg font-semibold text-gray-900 mb-2">
                        {language === "en"
                          ? "Click to upload files"
                          : "ፋይሎችን ለመጫን ጠቅ ያድርጉ"}
                      </span>
                      <p className="text-sm text-gray-600 mb-2">
                        {language === "en"
                          ? "Upload images, sketches, or PDFs (Max 10MB each)"
                          : "ምስሎችን፣ ስእሎችን፣ ወይም PDF ፋይሎችን ይጫኑ (ከ10 ሜጋ ባይት በታች)"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {language === "en"
                          ? "Supports: JPG, PNG, PDF, WebP"
                          : "የሚደገፉ: JPG, PNG, PDF, WebP"}
                      </p>
                    </label>
                  </div>

                  {/* File Previews */}
                  {files.length > 0 && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900">
                          {language === "en" ? "Selected Files" : "የተመረጡ ፋይሎች"}{" "}
                          ({files.length})
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            setFiles([]);
                            setFilePreviews([]);
                          }}
                          className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                        >
                          <FiTrash2 className="h-4 w-4" />
                          {language === "en" ? "Clear all" : "ሁሉንም አጥፋ"}
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {files.map((file, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                              {file.type.startsWith("image/") ? (
                                <Image
                                  src={filePreviews[index]}
                                  alt={file.name}
                                  width={200}
                                  height={200}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center p-2">
                                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-2">
                                    <span className="text-red-600 font-bold">
                                      PDF
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-600 text-center truncate w-full">
                                    {file.name}
                                  </p>
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              title={
                                language === "en" ? "Remove file" : "ፋይል አስወግድ"
                              }
                            >
                              <FiX className="h-3 w-3" />
                            </button>
                            <div className="mt-1">
                              <p
                                className="text-xs text-gray-600 truncate"
                                title={file.name}
                              >
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>
                        {language === "en" ? "Submitting..." : "በማስገባት ላይ..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <FiSend className="h-6 w-6" />
                      <span>{t("contact.submit")}</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Side - Info & Preview */}
            <div className="md:w-1/3 bg-gradient-to-b from-gray-900 to-blue-900 text-white p-8">
              <div className="sticky top-8">
                <div className="mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <FiImage className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">
                    {language === "en"
                      ? "Why Upload Images?"
                      : "ምስሎችን ለምን እንጫን?"}
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5"></div>
                      <span className="text-sm text-blue-100">
                        {language === "en"
                          ? "Get more accurate quotes"
                          : "በጣም ትክክለኛ ዋጋ ያግኙ"}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5"></div>
                      <span className="text-sm text-blue-100">
                        {language === "en"
                          ? "Better understanding of your vision"
                          : "ራዕይዎን በተሻለ ሁኔታ መረዳት"}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5"></div>
                      <span className="text-sm text-blue-100">
                        {language === "en"
                          ? "Faster project turnaround"
                          : "ፈጣን የፕሮጀክት አጠናቀቂያ"}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-white/20 pt-8">
                  <h4 className="font-semibold mb-4">
                    {language === "en" ? "What Happens Next?" : "ቀጥሎ ምን ይሆናል?"}
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold">1</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Submission Review</p>
                        <p className="text-xs text-blue-200 mt-1">
                          {language === "en"
                            ? "We review your project details"
                            : "የፕሮጀክት ዝርዝሮችዎን እንገመግማለን"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold">2</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Design Consultation
                        </p>
                        <p className="text-xs text-blue-200 mt-1">
                          {language === "en"
                            ? "We contact you for more details"
                            : "ለተጨማሪ ዝርዝሮች እናገኝዎታለን"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold">3</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Quote & Timeline</p>
                        <p className="text-xs text-blue-200 mt-1">
                          {language === "en"
                            ? "Receive detailed quote and timeline"
                            : "ዝርዝር ዋጋ እና ጊዜ መርሐግብር ይቀበሉ"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/20">
                  <p className="text-sm text-blue-200">
                    {language === "en"
                      ? "Questions? Call us: +1 (555) 123-4567"
                      : "ጥያቄዎች? ይደውሉ: +251 911 123456"}
                  </p>
                  <p className="text-sm text-blue-200 mt-2">
                    Email: contact@cncdesign.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-blue-600 font-bold">24h</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              {language === "en" ? "Fast Response" : "ፈጣን ምላሽ"}
            </h4>
            <p className="text-sm text-gray-600">
              {language === "en"
                ? "We respond to all inquiries within 24 hours"
                : "ለሁሉም ጥያቄዎች በ24 ሰዓታት ውስጥ እንመልሳለን"}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-green-600 font-bold">✓</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              {language === "en" ? "Free Consultation" : "ነጻ ምክክር"}
            </h4>
            <p className="text-sm text-gray-600">
              {language === "en"
                ? "Get free design consultation for your project"
                : "ለፕሮጀክትዎ ነጻ የንድፍ ምክክር ያግኙ"}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-purple-600 font-bold">%</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              {language === "en" ? "Best Price" : "ምርጥ ዋጋ"}
            </h4>
            <p className="text-sm text-gray-600">
              {language === "en"
                ? "Competitive pricing with quality materials"
                : "በጥራት ያለው ዋጋ ከተወዳዳሪ ዋጋ ጋር"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
