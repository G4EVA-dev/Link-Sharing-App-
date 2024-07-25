"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import MobileNavBar from "@/components/previewNavBar/mobileView";
import TabletNavBar from "@/components/previewNavBar/tabletView";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaYoutube,
  FaFreeCodeCamp,
  FaDev,
  FaCode,
} from "react-icons/fa";

const platformIcons = {
  GitHub: <FaGithub style={{ color: "white" }} />,
  LinkedIn: <FaLinkedin style={{ color: "white" }} />,
  Twitter: <FaTwitter style={{ color: "white" }} />,
  Facebook: <FaFacebook style={{ color: "white" }} />,
  YouTube: <FaYoutube style={{ color: "white" }} />,
  freeCodeCamp: <FaFreeCodeCamp style={{ color: "white" }} />,
  "Dev.to": <FaDev style={{ color: "white" }} />,
  Codewars: <FaCode style={{ color: "white" }} />,
};

const platformColors = {
  GitHub: "bg-black",
  LinkedIn: "bg-linkedInColor",
  Twitter: "bg-blue-400",
  Facebook: "bg-blue-800",
  YouTube: "bg-youtubeColor",
  freeCodeCamp: "bg-freeCodeCampColor",
  "Dev.to": "bg-devToColor",
  Codewars: "bg-codeWarColor",
};

type Platform = keyof typeof platformIcons;

interface LinkType {
  platform: Platform;
  url: string;
}

interface UserDetailsType {
  profileImage: string | null;
  firstName: string;
  lastName: string;
  email: string;
  previewImage: string | null;
  links: LinkType[];
}

const PreviewPage: React.FC = () => {
  const [userDetails, setUserDetails] = useState<UserDetailsType>({
    profileImage: null,
    firstName: "",
    lastName: "",
    email: "",
    previewImage: null,
    links: [],
  });

  useEffect(() => {
    const storedDetails = localStorage.getItem("userDetails");
    const storedLinks = localStorage.getItem("userLinks");
    if (storedDetails) {
      setUserDetails((prevState) => ({
        ...prevState,
        ...JSON.parse(storedDetails),
      }));
    }
    if (storedLinks) {
      setUserDetails((prevState) => ({
        ...prevState,
        links: JSON.parse(storedLinks),
      }));
    }
  }, []);

  const { profileImage, firstName, lastName, email, previewImage, links } =
    userDetails;

  if (!profileImage && !firstName && !lastName && !email && !previewImage) {
    return <p>Loading...</p>;
  }

  return (
    <div className="">
      <div className="block md:hidden">
        <MobileNavBar />
      </div>
      <div className="hidden md:block fixed top-0 w-full z-20">
        <TabletNavBar />
      </div>

      {/* Purple background for tablet and desktop views */}
      <div className="hidden md:block absolute top-0 left-0 w-full h-[357px] rounded-bl-[32px] rounded-br-[32px] bg-purple z-10"></div>

      <main className="bg-bgColor w-full h-auto mt-[60px] md:mt-[102px] flex flex-col justify-center items-center gap-[56px] relative">
        

        <div className="relative w-[237px] lg:w-[349px] md:bg-white lg:rounded-[24px] flex flex-col justify-center items-center md:mt-24 z-20 md:p-[24px]  ">
          <div className="lg:w-[257px] flex flex-col justify-center items-center ">
            <div className="rounded-full w-[104px] h-[104px] mb-[25px] border-[4px] border-purple ">
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt="Profile"
                  width="104"
                  height="104"
                  className="w-[104px] h-[104px] rounded-full"
                />
              ) : (
                <Image
                  src="/images/preview/man.svg"
                  alt="man"
                  width="113"
                  height="112"
                />
              )}
            </div>
            <h1 className="text-[32px] font-bold leading-[48px] mb-[8px]">
              {firstName} {lastName}
            </h1>
            <p className="text-[16px] text-linkPageCustomizeText font-normal leading-[24px]">
              {email}
            </p>
          </div>

          <div className="w-full flex flex-col items-center gap-4">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full flex items-center gap-2 p-4 rounded-lg shadow-md text-white ${
                  platformColors[link.platform]
                } hover:opacity-90 transition`}
              >
                {platformIcons[link.platform]}
                <span className="mr-auto">{link.platform}</span>
                <Image
                  src="/images/preview/mdi_arrow-right.svg"
                  alt="Arrow"
                  width="16"
                  height="16"
                />
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PreviewPage;


// import React from "react";
// import Link from "next/link";
// import Image from "next/image";

// function page() {
//   return (
//     <div className="">
//       <nav className="flex justify-around items-center  py-[16px] pl-[24px] pr-[16px] mb-[60px] ">
//         <Link
//           href="/"
//           className="py-[11px] px-[27px] border border-btnpurple text-btnpurple rounded-[8px] font-superbold"
//         >
//           Back to editor
//         </Link>
//         <Link
//           href="/"
//           className=" py-[11px] px-[27px] rounded-[8px] text-white bg-purple"
//         >
//           {" "}
//           Share Link
//         </Link>
//       </nav>

//       <main className="w-full h-auto flex flex-col justify-center items-center gap-[56px] ">
//         <div className="w-[237px] flex flex-col justify-center items-center ">
//           <div className=" flex flex-col justify-center items-center mb-[56px] ">
//             <div className="rounded-[50%] width-[104px] height-[104px] mb-[25px]  ">
//               <Image
//                 src="/images/preview/man.svg"
//                 alt="man"
//                 width="113"
//                 height="112"
//               />
//             </div>
//             <h1 className="text-[32px] font-bold leading-[48px]  mb-[8px] ">
//               Ben Wright
//             </h1>
//             <p className="text-[16px] text-linkPageCustomizeText font-normal leading-[24px]">
//               ben@example.com
//             </p>
//           </div>

//           <div>Links</div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default page;
