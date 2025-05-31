"use client";
import React, { useState, useEffect } from "react";
import MobileNavBar from "@/components/mobileNavBar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TabletNavBar from "@/components/tabletNavBar";
import PhonePreview from "@/components/phoneView";
import { authService } from "@/services/authService";
import { linkService } from "@/services/linkService";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Link } from "@/types";
import Toast, { ToastType } from "@/components/Toast";
import ImageUpload from "@/components/ImageUpload";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaEnvelope } from "react-icons/fa";

interface ToastState {
  show: boolean;
  message: string;
  type: ToastType;
}

function Page() {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "info"
  });
  const router = useRouter();

  const handleImageSelect = (file: File | null) => {
    setProfileImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const { value } = e.target;
    if (field === "firstName") setFirstName(value);
    if (field === "lastName") setLastName(value);
    if (field === "email") setEmail(value);
    setErrors({ ...errors, [field]: "" });
  };

  const handleSave = async () => {
    let formErrors: { [key: string]: string } = {};

    if (!firstName) {
      formErrors.firstName = "First name is required";
    }

    if (!lastName) {
      formErrors.lastName = "Last name is required";
    }

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      setIsSaving(true);
      try {
        const userDetails = {
          profileImage,
          firstName,
          lastName,
          email,
          previewImage,
        };
        
        localStorage.setItem("userDetails", JSON.stringify(userDetails));
        showToast("Profile updated successfully!", "success");
      } catch (err: any) {
        showToast(err.message || "Failed to update profile", "error");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const loadLinks = async () => {
    setIsLoading(true);
    setError("");
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const response = await linkService.getUserLinks(user.id);
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        setLinks(response.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load links");
      showToast(err.message || "Failed to load links", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  const showToast = (message: string, type: ToastType) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="bg-bgColor h-full flex flex-col relative">
        <MobileNavBar />
        <TabletNavBar />
        <main className="p-[16px] lg:flex lg:gap-[24px]">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block"
          >
            <PhonePreview links={links} isLoading={isLoading} />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-[24px] lg:w-full lg:p-[40px] rounded-lg shadow-lg"
          >
            <h1 className="text-[24px] md:text-[32px] font-bold leading-[36px] md:leading-[48px] mb-[16px]">
              Profile Details
            </h1>
            <p className="text-[16px] text-linkPageCustomizeText font-normal leading-[24px] mb-[40px]">
              Add your details to create a personal touch to your profile.
            </p>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-100 text-red-700 rounded-md"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[12px] text-linkPageCustomizeText font-normal leading-[18px]">
                  Profile picture
                </label>
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  currentImage={previewImage}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[12px] text-linkPageCustomizeText font-normal leading-[18px] flex items-center gap-2">
                  <FaUser className="text-purple" />
                  First name*
                </label>
                <input
                  type="text"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => handleInputChange(e, "firstName")}
                  className={`py-2 px-3 border rounded-md focus:outline-none focus:shadow-custom-shadow transition-all duration-200 ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.firstName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm"
                  >
                    {errors.firstName}
                  </motion.p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[12px] text-linkPageCustomizeText font-normal leading-[18px] flex items-center gap-2">
                  <FaUser className="text-purple" />
                  Last name*
                </label>
                <input
                  type="text"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={(e) => handleInputChange(e, "lastName")}
                  className={`py-2 px-3 border rounded-md focus:outline-none focus:shadow-custom-shadow transition-all duration-200 ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.lastName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm"
                  >
                    {errors.lastName}
                  </motion.p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[12px] text-linkPageCustomizeText font-normal leading-[18px] flex items-center gap-2">
                  <FaEnvelope className="text-purple" />
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:shadow-custom-shadow bg-gray-50"
                  value={authService.getCurrentUser()?.email || ""}
                  disabled
                />
              </div>
            </div>

            <div className="p-[16px] border-t border-t-1 md:flex md:justify-end border-saveborder mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={isSaving}
                className={`bg-purple w-full md:w-auto py-[11px] px-[27px] rounded-md text-white font-semibold transition-all duration-200 ${
                  isSaving ? 'opacity-75 cursor-not-allowed' : 'hover:bg-buttonHover hover:shadow-custom-shadow'
                }`}
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="small" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  'Save'
                )}
              </motion.button>
            </div>
          </motion.div>
        </main>

        <AnimatePresence>
          {toast.show && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast({ ...toast, show: false })}
            />
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}

export default Page;
