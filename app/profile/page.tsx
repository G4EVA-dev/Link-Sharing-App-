"use client";
import React, { useState, ChangeEvent } from "react";
import MobileNavBar from "@/components/mobileNavBar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TabletNavBar from "@/components/tabletNavBar";
import PhonePreview from "@/components/phoneView";

function Page() {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfileImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPreviewImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    let formErrors: { [key: string]: string } = {};

    if (!firstName) {
      formErrors.firstName = "can't be empty";
    }

    if (!lastName) {
      formErrors.lastName = "can't be empty";
    }

    if (!email) {
      formErrors.email = "can't be empty";
    }

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      const userDetails = {
        profileImage,
        firstName,
        lastName,
        email,
        previewImage,
      };
      localStorage.setItem("userDetails", JSON.stringify(userDetails));
      setToastMessage("Profile saved successfully!");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const { value } = e.target;
    if (field === "firstName") setFirstName(value);
    if (field === "lastName") setLastName(value);
    if (field === "email") setEmail(value);
    setErrors({ ...errors, [field]: "" });
  };

  return (
    <div className="bg-bgColor flex flex-col relative">
      <MobileNavBar />
      <TabletNavBar />
      <main className="p-[16px] lg:flex lg:gap-[24px]">
        <div className="hidden lg:block">
          <PhonePreview />
        </div>

        <div className="bg-white p-[24px] lg:w-full lg:p-[40px]">
          <h1 className="text-[24px] md:text-[32px] font-bold leading-[36px] md:leading-[48px]">
            Product Details
          </h1>
          <p className="text-[16px] text-linkPageCustomizeText font-normal leading-[24px] mb-[40px]">
            Add your details to create a personal touch to your profile.
          </p>

          <div className="p-[20px] bg-bgColor mb-[24px] md:flex md:items-center md:justify-center">
            <div className="md:mr-auto">
              <p className="text-[16px] text-linkPageCustomizeText font-normal leading-[24px] mb-[40px]">
                Profile picture
              </p>
            </div>

            <div className="md:flex md:items-center md:justify-center md:gap-[24px]">
              <div className="profilePicture mb-[16px]">
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt="Profile Preview"
                    width="104"
                    height="104"
                    className="rounded-full w-[104px] h-[104px] object-cover"
                  />
                ) : (
                  <div
                    className="rounded-md w-[193px] h-[193px] flex flex-col bg-lightPurple items-center justify-center cursor-pointer"
                    onClick={() =>
                      document.getElementById("profileImageInput")?.click()
                    }
                  >
                    <Image
                      src="/images/profile/uploadImage.svg"
                      alt="Upload Image"
                      width="40"
                      height="40"
                    />
                    <p className="uploadTheImage text-purple">+ Upload Image</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  id="profileImageInput"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <p className="md:w-[127px] text-[12px] text-linkPageCustomizeText font-normal leading-[18px] mb-[40px]">
                Image must be below 1024x1024px. Use PNG or JPG format.
              </p>
            </div>
          </div>

          <form action="" className="p-5 bg-bgColor w-full mb-[25px]">
            <div className="flex flex-col gap-1 mb-3 md:flex-row relative">
              <label
                htmlFor="firstName"
                className="text-[12px] md:leading-[24px] md:text-[16px] text-linkPageCustomizeText font-normal leading-[18px] md:mr-auto"
              >
                First Name*
              </label>
              <input
                type="text"
                id="firstName"
                className={`py-[12px] px-[16px] border ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                } rounded-md md:w-[344px] focus:border-purple focus:outline-none focus:shadow-custom-shadow`}
                placeholder="Ben"
                value={firstName}
                onChange={(e) => handleInputChange(e, "firstName")}
              />
              {errors.firstName && (
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 text-[12px]">
                  {errors.firstName}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1 mb-3 md:flex-row relative">
              <label
                htmlFor="lastName"
                className="text-[12px] text-linkPageCustomizeText font-normal leading-[18px] md:leading-[24px] md:text-[16px] md:mr-auto"
              >
                Last Name*
              </label>
              <input
                type="text"
                id="lastName"
                className={`py-[12px] px-[16px] border ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                } rounded-md md:w-[344px] focus:border-purple focus:outline-none focus:shadow-custom-shadow`}
                placeholder="Wright"
                value={lastName}
                onChange={(e) => handleInputChange(e, "lastName")}
              />
              {errors.lastName && (
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 text-[12px]">
                  {errors.lastName}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1 mb-3 md:flex-row relative">
              <label
                htmlFor="email"
                className="text-[12px] text-linkPageCustomizeText font-normal leading-[18px] md:leading-[24px] md:text-[16px] md:mr-auto"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className={`py-[12px] px-[16px] border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-md md:w-[344px] focus:border-purple focus:outline-none focus:shadow-custom-shadow`}
                placeholder="ben@example.com"
                value={email}
                onChange={(e) => handleInputChange(e, "email")}
              />
              {errors.email && (
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 text-[12px]">
                  {errors.email}
                </span>
              )}
            </div>
          </form>

          <div className="p-[16px] border-t border-t-1 border-saveborder md:flex md:justify-end">
            <button
              type="button"
              className="w-full font-semibold py-[11px] px-[27px] bg-purple text-white rounded-md md:w-auto hover:bg-buttonHover hover:shadow-custom-shadow"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </main>
      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-bgBrown text-white py-2 px-4 rounded-md shadow-lg">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default Page;
