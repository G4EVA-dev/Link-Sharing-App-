"use client";
import React, { useState } from "react";
import MobileNavBar from "@/components/mobileNavBar";
import CustomDropdown from "@/components/customDropDown";
import TabletNavBar from "@/components/tabletNavBar";
import PhonePreview from "@/components/phoneView";

interface LinkType {
  platform: string;
  url: string;
}

function Page() {
  const [links, setLinks] = useState<LinkType[]>([{ platform: "", url: "" }]);
  const [toastMessage, setToastMessage] = useState("");
  const [inputErrors, setInputErrors] = useState<{ [key: number]: string }>({});

  const handleAddLink = () => {
    setLinks([...links, { platform: "", url: "" }]);
  };

  const handleRemoveLink = (index: number) => {
    const updatedLinks = links.filter((_, i) => i !== index);
    setLinks(updatedLinks);
  };

  const handlePlatformChange = (index: number, value: string) => {
    const updatedLinks = links.map((link, i) =>
      i === index ? { ...link, platform: value } : link
    );
    setLinks(updatedLinks);
  };

  const handleUrlChange = (index: number, value: string) => {
    const updatedLinks = links.map((link, i) =>
      i === index ? { ...link, url: value } : link
    );
    setLinks(updatedLinks);
    setInputErrors({ ...inputErrors, [index]: "" });
  };

  const handleSave = () => {
    let hasError = false;
    const errors: { [key: number]: string } = {};
    links.forEach((link, index) => {
      if (!link.url) {
        errors[index] = "can't be empty";
        hasError = true;
      } else if (!/^https:\/\/www\.\w+\.\w+/.test(link.url)) {
        errors[index] = "please check the URL";
        hasError = true;
      }
    });
    setInputErrors(errors);
    if (!hasError) {
      localStorage.setItem("userLinks", JSON.stringify(links));
      setToastMessage("Links saved successfully!");
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  return (
    <div className="bg-bgColor h-full flex flex-col relative">
      <MobileNavBar />
      <TabletNavBar />
      <main className="bg-bgColor p-[16px] lg:flex lg:gap-[24px] ">
        <div className="hidden lg:block">
          <PhonePreview />
        </div>

        <div className="bg-white p-[24px] lg:w-full lg:p-[40px] rounded-lg shadow-md">
          <h1 className="text-[24px] md:text-[32px] font-bold leading-[36px] md:leading-[48px] mb-[16px]">
            Customize your links
          </h1>
          <p className="text-[16px] text-linkPageCustomizeText font-normal leading-[24px] mb-[40px]">
            Add/edit/remove links below and then share all your profiles with
            the world!
          </p>
          <button
            className="w-full flex justify-center gap-2 items-center py-2 px-6 border border-btnpurple text-btnpurple rounded-md font-semibold mb-[24px] hover:bg-lightPurple hover:shadow-custom-shadow"
            onClick={handleAddLink}
          >
            + Add new Link
          </button>
          {links.map((link, index) => (
            <div
              key={index}
              className="w-full p-[20px] mb-[24px] bg-bgColor rounded-md shadow-sm flex flex-col gap-[16px]"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-[16px] text-linkGray font-semibold">
                  Link #{index + 1}
                </h2>
                <button
                  className="text-linkGray"
                  onClick={() => handleRemoveLink(index)}
                >
                  Remove
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] text-linkPageCustomizeText font-normal leading-[18px]">
                  Platform
                </label>
                <CustomDropdown
                  value={link.platform}
                  onChange={(value: string) =>
                    handlePlatformChange(index, value)
                  }
                />
              </div>
              <div className="flex flex-col gap-2 relative">
                <label className="text-[12px] text-linkPageCustomizeText font-normal leading-[18px]">
                  Link
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://www.github.com/"
                  className={`py-2 px-3 border ${
                    inputErrors[index] ? "text-red-500 border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:shadow-custom-shadow`}
                  value={link.url}
                  onChange={(e) => handleUrlChange(index, e.target.value)}
                />
                {inputErrors[index] && (
                  <span className="absolute right-3 top-10 text-red-500 text-xs">
                    {inputErrors[index]}
                  </span>
                )}
              </div>
            </div>
          ))}
          <div className="p-[16px] border-t border-t-1 md:flex md:justify-end border-saveborder">
            <button
              className="bg-purple w-full md:w-auto py-[11px] px-[27px] rounded-md text-white font-semibold hover:bg-buttonHover hover:shadow-custom-shadow"
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




// "use client";
// import React, { useState } from "react";
// import MobileNavBar from "@/components/mobileNavBar";
// import CustomDropdown from "@/components/customDropDown";
// import TabletNavBar from "@/components/tabletNavBar";
// import PhonePreview from "@/components/phoneView";

// interface LinkType {
//   platform: string;
//   url: string;
// }

// function Page() {
//   const [links, setLinks] = useState<LinkType[]>([{ platform: "", url: "" }]);

//   const handleAddLink = () => {
//     setLinks([...links, { platform: "", url: "" }]);
//   };

//   const handleRemoveLink = (index: number) => {
//     const updatedLinks = links.filter((_, i) => i !== index);
//     setLinks(updatedLinks);
//   };

//   const handlePlatformChange = (index: number, value: string) => {
//     const updatedLinks = links.map((link, i) =>
//       i === index ? { ...link, platform: value } : link
//     );
//     setLinks(updatedLinks);
//   };

//   const handleUrlChange = (index: number, value: string) => {
//     const updatedLinks = links.map((link, i) =>
//       i === index ? { ...link, url: value } : link
//     );
//     setLinks(updatedLinks);
//   };

//   const handleSave = () => {
//     localStorage.setItem("userLinks", JSON.stringify(links));
//     // alert("Links saved successfully!");
//   };

//   return (
//     <div className="bg-bgColor h-full flex flex-col">
//       <MobileNavBar />
//       <TabletNavBar />
//       <main className="bg-bgColor p-[16px] lg:flex lg:gap-[24px] ">
//         <div className=" hidden lg:block ">
//           <PhonePreview />
//         </div>

//         <div className="bg-white  p-[24px] lg:w-full lg:p-[40px] rounded-lg shadow-md  ">
//           <h1 className="text-[24px] md:text-[32px] font-bold leading-[36px] md:leading-[48px] mb-[16px]">
//             Customize your links
//           </h1>
//           <p className="text-[16px] text-linkPageCustomizeText font-normal leading-[24px] mb-[40px]">
//             Add/edit/remove links below and then share all your profiles with
//             the world!
//           </p>
//           <button
//             className="w-full flex justify-center gap-2 items-center py-2 px-6 border border-btnpurple text-btnpurple rounded-md font-semibold mb-[24px] hover:bg-lightPurple hover:shadow-custom-shadow "
//             onClick={handleAddLink}
//           >
//             + Add new Link
//           </button>
//           {links.map((link, index) => (
//             <div
//               key={index}
//               className="w-full p-[20px] mb-[24px] bg-bgColor rounded-md shadow-sm flex flex-col gap-[16px]  "
//             >
//               <div className="flex justify-between items-center">
//                 <h2 className="text-[16px] text-linkGray font-semibold">
//                   Link #{index + 1}
//                 </h2>
//                 <button
//                   className="text-linkGray"
//                   onClick={() => handleRemoveLink(index)}
//                 >
//                   Remove
//                 </button>
//               </div>
//               <div className="flex flex-col gap-2">
//                 <label className="text-[12px] text-linkPageCustomizeText font-normal leading-[18px]">
//                   Platform
//                 </label>
//                 <CustomDropdown
//                   value={link.platform}
//                   onChange={(value: string) =>
//                     handlePlatformChange(index, value)
//                   }
//                 />
//               </div>
//               <div className="flex flex-col gap-2">
//                 <label className="text-[12px] text-linkPageCustomizeText font-normal leading-[18px]">
//                   Link
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="e.g. https://www.github.com/"
//                   className="py-2 px-3 border border-gray-300 rounded-md focus:border-purple focus:outline-none focus:shadow-custom-shadow  "
//                   value={link.url}
//                   onChange={(e) => handleUrlChange(index, e.target.value)}
//                 />
//               </div>
//             </div>
//           ))}
//           <div className="p-[16px] border-t border-t-1 md:flex md:justify-end border-saveborder">
//             <button
//               className="bg-purple w-full md:w-auto py-[11px] px-[27px] rounded-md text-white font-semibold hover:bg-buttonHover hover:shadow-custom-shadow "
//               onClick={handleSave}
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default Page;
