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
    const userDetails = {
      profileImage,
      firstName,
      lastName,
      email,
      previewImage,
    };
    localStorage.setItem("userDetails", JSON.stringify(userDetails));
  };

  return (
    <div>
      <MobileNavBar />
      <TabletNavBar />
      <main className="p-[16px] lg:flex lg:gap-[24px] ">
        <div className="hidden lg:block ">
          <PhonePreview />
        </div>

        <div className="p-[24px] lg:w-full lg:p-[40px] ">
          <h1 className="text-[24px] md:text-[32px] font-bold leading-[36px] md:leading-[48px] ">
            Product Details
          </h1>
          <p className="text-[16px] text-linkPageCustomizeText font-normal leading-[24px] mb-[40px]">
            Add your details to create a personal touch to your profile.
          </p>

          <div className="p-[20px] bg-bgColor mb-[24px] md:flex md:items-center md:justify-center  ">
            <div className="md:mr-auto">
              <p className="text-[16px] text-linkPageCustomizeText font-normal leading-[24px] mb-[40px]  ">
                Profile picture
              </p>
            </div>

            <div className="md:flex md:items-center md:justify-center md:gap-[24px] ">
              <div className="profilePicture mb-[16px] ">
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt="Profile Preview"
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
            <div className="flex flex-col gap-1 mb-3 md:flex-row ">
              <label
                htmlFor="firstName"
                className="text-[12px] md:leading-[24px] md:text-[16px] text-linkPageCustomizeText font-normal leading-[18px] md:mr-auto  "
              >
                First Name*
              </label>
              <input
                type="text"
                id="firstName"
                className="py-[12px] px-[16px] border border-gray-300 rounded-md md:md:w-[344px] "
                placeholder="Ben"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1 mb-3 md:flex-row">
              <label
                htmlFor="lastName"
                className="text-[12px] text-linkPageCustomizeText font-normal leading-[18px] md:leading-[24px] md:text-[16px] md:mr-auto"
              >
                Last Name*
              </label>
              <input
                type="text"
                id="lastName"
                className="py-[12px] px-[16px] border border-gray-300 rounded-md md:md:w-[344px] "
                placeholder="Wright"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1 mb-3 md:flex-row">
              <label
                htmlFor="email"
                className="text-[12px] text-linkPageCustomizeText font-normal leading-[18px] md:leading-[24px] md:text-[16px] md:mr-auto"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="py-[12px] px-[16px] border border-gray-300 rounded-md md:md:w-[344px] "
                placeholder="ben@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </form>

          <div className="p-[16px] border-t border-t-1 border-saveborder md:flex md:justify-end ">
            <button
              type="button"
              className="w-full font-semibold py-[11px] px-[27px] bg-purple text-white rounded-md md:w-auto  "
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Page;


// "use client";
// import React, { useState } from "react";
// import MobileNavBar from "@/components/mobileNavBar";
// import Image from "next/image";

// function Page() {
//   const [profileImage, setProfileImage] = useState(null);
//   const [previewImage, setPreviewImage] = useState(null);

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     setProfileImage(file);
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setPreviewImage(reader.result);
//     };
//     reader.readAsDataURL(file);
//   };

//   return (
//     <div>
//       <MobileNavBar />
//       <main className="p-[16px]">
//         <div className="p-[24px]">
//           <h1 className="text-[24px] font-bold leading-[36px]">
//             Product Details
//           </h1>
//           <p className="text-[16px] text-linkPageCustomizeText font-normal leading-[24px] mb-[40px]">
//             Add your details to create a personal touch to your profile.
//           </p>

//           <div className="p-[20px] bg-bgColor mb-[24px]">
//             <p className="text-[16px] text-linkPageCustomizeText font-normal leading-[24px] mb-[40px]">
//               Profile picture
//             </p>

//             <div className="profilePicture mb-[16px]">
//               {previewImage ? (
//                 <img
//                   src={previewImage}
//                   alt="Profile Preview"
//                   className="rounded-full w-[104px] h-[104px] object-cover"
//                 />
//               ) : (
//                 <div className="uploadTheImage rounded-md w-[193px] h-[193px] flex flex-col bg-gray-200 flex items-center justify-center">
//                   <Image src="/images/profile/uploadImage.svg" alt="Upload Image" width="40" height="40"/>
//                   <p className= " text-purple" >+ Upload Image </p>
//                 </div>
//               )}

//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageUpload}
//                 className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
//               />
//             </div>

//             <p className="text-[12px] text-linkPageCustomizeText font-normal leading-[18px] mb-[40px]">
//               Image must be below 1024x1024px. Use PNG or JPG format.
//             </p>
//           </div>

//           <form action="" className="p-5 bg-bgColor w-full mb-[25px]">
//             <div className="flex flex-col gap-1 mb-3">
//               <label
//                 htmlFor="firstName"
//                 className="text-[12px] text-linkPageCustomizeText font-normal leading-[18px]"
//               >
//                 First Name*
//               </label>
//               <input
//                 type="text"
//                 id="firstName"
//                 className="py-[12px] px-[16px] border border-gray-300 rounded-md"
//                 placeholder="Ben"
//               />
//             </div>
//             <div className="flex flex-col gap-1 mb-3">
//               <label
//                 htmlFor="lastName"
//                 className="text-[12px] text-linkPageCustomizeText font-normal leading-[18px]"
//               >
//                 Last Name*
//               </label>
//               <input
//                 type="text"
//                 id="lastName"
//                 className="py-[12px] px-[16px] border border-gray-300 rounded-md"
//                 placeholder="Wright"
//               />
//             </div>
//             <div className="flex flex-col gap-1 mb-3">
//               <label
//                 htmlFor="email"
//                 className="text-[12px] text-linkPageCustomizeText font-normal leading-[18px]"
//               >
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 className="py-[12px] px-[16px] border border-gray-300 rounded-md"
//                 placeholder="ben@example.com"
//               />
//             </div>
//           </form>
//         </div>
//         <div className="p-[16px] border-t border-t-1 border-saveborder">
//           <button
//             type="submit"
//             className="w-full font-semibold py-[11px] px-[27px] bg-purple text-white rounded-md"
//           >
//             Save
//           </button>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default Page;

// import React from "react";
// import MobileNavBar from "@/components/mobileNavBar";

// function page() {
//   return (
//     <div>
//       <MobileNavBar />
//       <main className="p-[16px] ">
//         <div className="p-[24px] ">
//           <h1 className="text-[24px] font-bold leading-[36px]">
//             Product Details
//           </h1>
//           <p className="text-[16px] text-linkPageCustomizeText font-normal leading-[24px] mb-[40px]">
//             Add your details to create a personal touch to your profile.
//           </p>

//           <div className="p-[20px] bg-bgColor mb-[24px] ">
//             <p className="text-[16px] text-linkPageCustomizeText font-normal leading-[24px] mb-[40px]">
//               Profile picture
//             </p>

//             <div className="profilePicture" >

//             </div>

//             <p className="text-[12px] text-linkPageCustomizeText font-normal leading-[18px] mb-[40px]">
//               Image must be below 1024x1024px. Use PNG or JPG format.
//             </p>
//           </div>

//           {/* -----SOmething Here------ */}

//           <form action="" className="p-5 bg-bgColor w-full mb-[25px] ">
//             <div className="flex flex-col gap-1 mb-3">
//               <label
//                 htmlFor="firstName"
//                 className="text-[12px] text-linkPageCustomizeText font-normal leading-[18px]"
//               >
//                 First Name*
//               </label>
//               <input
//                 type="text"
//                 id="firstName"
//                 className="py-[12px] px-[16px] border border-gray-300 rounded-md"
//                 placeholder="Ben"
//               />
//             </div>
//             <div className="flex flex-col gap-1 mb-3">
//               <label
//                 htmlFor="lastName"
//                 className="text-[12px] text-linkPageCustomizeText font-normal leading-[18px]"
//               >
//                 Last Name*
//               </label>
//               <input
//                 type="text"
//                 id="lastName"
//                 className="py-[12px] px-[16px] border border-gray-300 rounded-md"
//                 placeholder="Wright"
//               />
//             </div>
//             <div className="flex flex-col gap-1 mb-3">
//               <label
//                 htmlFor="email"
//                 className="text-[12px] text-linkPageCustomizeText font-normal leading-[18px]"
//               >
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 className="py-[12px] px-[16px] border border-gray-300 rounded-md"
//                 placeholder="ben@example.com"
//               />
//             </div>
//           </form>
//         </div>
//         <div className="p-[16px] border-t border-t-1 border-saveborder">
//           <button
//             type="submit"
//             className="w-full font-semibold py-[11px] px-[27px] bg-purple text-white rounded-md"
//           >
//             Save
//           </button>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default page;
