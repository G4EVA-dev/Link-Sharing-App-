"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import MobileNavBar from "@/components/previewNavBar/mobileView";
import TabletNavBar from "@/components/previewNavBar/tabletView";
import { auth, db } from "@/firebase"; // Ensure correct import paths
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaYoutube, FaFreeCodeCamp, FaDev, FaCode } from "react-icons/fa";

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

  const [shareableLink, setShareableLink] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async (uid: string) => {
      try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Document data:", data);
          setUserDetails(data as UserDetailsType);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User ID:", user.uid); // Log the user ID
        fetchData(user.uid);
        setShareableLink(`${window.location.origin}/preview/${user.uid}`);
      } else {
        console.log("No user is signed in.");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleShareLink = () => {
    if (shareableLink) {
      navigator.clipboard.writeText(shareableLink);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000); // Hide toast after 3 seconds
    }
  };

  const { profileImage, firstName, lastName, email, previewImage, links } = userDetails;

  if (!profileImage && !firstName && !lastName && !email && !previewImage) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-bgColor">
      <div className="block md:hidden">
        <MobileNavBar />
      </div>
      <div className="hidden md:block fixed top-0 w-full z-20">
        <TabletNavBar />
      </div>

      {/* Purple background for tablet and desktop views */}
      <div className="hidden md:block absolute top-0 left-0 w-full h-[357px] rounded-bl-[32px] rounded-br-[32px] bg-purple z-10"></div>

      <main className="bg-bgColor w-full h-full mt-[60px] md:mt-[102px] flex flex-col justify-center items-center gap-[56px] relative">
        <div className="relative w-[237px] lg:w-[349px] md:bg-white lg:rounded-[24px] flex flex-col justify-center items-center md:mt-24 z-20 md:p-[24px]">
          <div className="lg:w-[257px] flex flex-col justify-center items-center">
            <div className="rounded-full w-[104px] h-[104px] mb-[25px] border-[4px] border-purple">
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

        {/* Share Button */}
        <button
          onClick={handleShareLink}
          className="bg-purple text-white p-3 rounded-lg shadow-md"
        >
          Share Link
        </button>
      </main>

      {/* Toast Message */}
      {showToast && (
        <div className="fixed bottom-0 left-0 w-full bg-brown text-white p-4 text-center">
          The link has been copied to your clipboard!
        </div>
      )}
    </div>
  );
};

export default PreviewPage;






// "use client";
// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import MobileNavBar from "@/components/previewNavBar/mobileView";
// import TabletNavBar from "@/components/previewNavBar/tabletView";
// import { auth, db } from "@/firebase"; // Ensure correct import paths
// import { doc, getDoc } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";
// import {
//   FaGithub,
//   FaLinkedin,
//   FaTwitter,
//   FaFacebook,
//   FaYoutube,
//   FaFreeCodeCamp,
//   FaDev,
//   FaCode,
// } from "react-icons/fa";

// const platformIcons = {
//   GitHub: <FaGithub style={{ color: "white" }} />,
//   LinkedIn: <FaLinkedin style={{ color: "white" }} />,
//   Twitter: <FaTwitter style={{ color: "white" }} />,
//   Facebook: <FaFacebook style={{ color: "white" }} />,
//   YouTube: <FaYoutube style={{ color: "white" }} />,
//   freeCodeCamp: <FaFreeCodeCamp style={{ color: "white" }} />,
//   "Dev.to": <FaDev style={{ color: "white" }} />,
//   Codewars: <FaCode style={{ color: "white" }} />,
// };

// const platformColors = {
//   GitHub: "bg-black",
//   LinkedIn: "bg-linkedInColor",
//   Twitter: "bg-blue-400",
//   Facebook: "bg-blue-800",
//   YouTube: "bg-youtubeColor",
//   freeCodeCamp: "bg-freeCodeCampColor",
//   "Dev.to": "bg-devToColor",
//   Codewars: "bg-codeWarColor",
// };

// type Platform = keyof typeof platformIcons;

// interface LinkType {
//   platform: Platform;
//   url: string;
// }

// interface UserDetailsType {
//   profileImage: string | null;
//   firstName: string;
//   lastName: string;
//   email: string;
//   previewImage: string | null;
//   links: LinkType[];
// }

// const PreviewPage: React.FC = () => {
//   const [userDetails, setUserDetails] = useState<UserDetailsType>({
//     profileImage: null,
//     firstName: "",
//     lastName: "",
//     email: "",
//     previewImage: null,
//     links: [],
//   });

//   useEffect(() => {
//     const fetchData = async (uid: string) => {
//       try {
//         const docRef = doc(db, "users", uid);
//         const docSnap = await getDoc(docRef);
//         if (docSnap.exists()) {
//           const data = docSnap.data();
//           console.log("Document data:", data);
//           setUserDetails(data as UserDetailsType);
//         } else {
//           console.log("No such document!");
//         }
//       } catch (error) {
//         console.error("Error fetching document:", error);
//       }
//     };

//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         console.log("User ID:", user.uid); // Log the user ID
//         fetchData(user.uid);
//       } else {
//         console.log("No user is signed in.");
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const { profileImage, firstName, lastName, email, previewImage, links } =
//     userDetails;

//   if (!profileImage && !firstName && !lastName && !email && !previewImage) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div className="">
//       <div className="block md:hidden">
//         <MobileNavBar />
//       </div>
//       <div className="hidden md:block fixed top-0 w-full z-20">
//         <TabletNavBar />
//       </div>

//       {/* Purple background for tablet and desktop views */}
//       <div className="hidden md:block absolute top-0 left-0 w-full h-[357px] rounded-bl-[32px] rounded-br-[32px] bg-purple z-10"></div>

//       <main className="bg-bgColor w-full h-auto mt-[60px] md:mt-[102px] flex flex-col justify-center items-center gap-[56px] relative">
//         <div className="relative w-[237px] lg:w-[349px] md:bg-white lg:rounded-[24px] flex flex-col justify-center items-center md:mt-24 z-20 md:p-[24px]">
//           <div className="lg:w-[257px] flex flex-col justify-center items-center">
//             <div className="rounded-full w-[104px] h-[104px] mb-[25px] border-[4px] border-purple">
//               {previewImage ? (
//                 <Image
//                   src={previewImage}
//                   alt="Profile"
//                   width="104"
//                   height="104"
//                   className="w-[104px] h-[104px] rounded-full"
//                 />
//               ) : (
//                 <Image
//                   src="/images/preview/man.svg"
//                   alt="man"
//                   width="113"
//                   height="112"
//                 />
//               )}
//             </div>
//             <h1 className="text-[32px] font-bold leading-[48px] mb-[8px]">
//               {firstName} {lastName}
//             </h1>
//             <p className="text-[16px] text-linkPageCustomizeText font-normal leading-[24px]">
//               {email}
//             </p>
//           </div>

//           <div className="w-full flex flex-col items-center gap-4">
//             {links.map((link, index) => (
//               <a
//                 key={index}
//                 href={link.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className={`w-full flex items-center gap-2 p-4 rounded-lg shadow-md text-white ${
//                   platformColors[link.platform]
//                 } hover:opacity-90 transition`}
//               >
//                 {platformIcons[link.platform]}
//                 <span className="mr-auto">{link.platform}</span>
//                 <Image
//                   src="/images/preview/mdi_arrow-right.svg"
//                   alt="Arrow"
//                   width="16"
//                   height="16"
//                 />
//               </a>
//             ))}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default PreviewPage;







// "use client";
// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import MobileNavBar from "@/components/previewNavBar/mobileView";
// import TabletNavBar from "@/components/previewNavBar/tabletView";
// import {
//   FaGithub,
//   FaLinkedin,
//   FaTwitter,
//   FaFacebook,
//   FaYoutube,
//   FaFreeCodeCamp,
//   FaDev,
//   FaCode,
// } from "react-icons/fa";

// const platformIcons = {
//   GitHub: <FaGithub style={{ color: "white" }} />,
//   LinkedIn: <FaLinkedin style={{ color: "white" }} />,
//   Twitter: <FaTwitter style={{ color: "white" }} />,
//   Facebook: <FaFacebook style={{ color: "white" }} />,
//   YouTube: <FaYoutube style={{ color: "white" }} />,
//   freeCodeCamp: <FaFreeCodeCamp style={{ color: "white" }} />,
//   "Dev.to": <FaDev style={{ color: "white" }} />,
//   Codewars: <FaCode style={{ color: "white" }} />,
// };

// const platformColors = {
//   GitHub: "bg-black",
//   LinkedIn: "bg-linkedInColor",
//   Twitter: "bg-blue-400",
//   Facebook: "bg-blue-800",
//   YouTube: "bg-youtubeColor",
//   freeCodeCamp: "bg-freeCodeCampColor",
//   "Dev.to": "bg-devToColor",
//   Codewars: "bg-codeWarColor",
// };

// type Platform = keyof typeof platformIcons;

// interface LinkType {
//   platform: Platform;
//   url: string;
// }

// interface UserDetailsType {
//   profileImage: string | null;
//   firstName: string;
//   lastName: string;
//   email: string;
//   previewImage: string | null;
//   links: LinkType[];
// }

// const PreviewPage: React.FC = () => {
//   const [userDetails, setUserDetails] = useState<UserDetailsType>({
//     profileImage: null,
//     firstName: "",
//     lastName: "",
//     email: "",
//     previewImage: null,
//     links: [],
//   });

//   useEffect(() => {
//     const storedDetails = localStorage.getItem("userDetails");
//     const storedLinks = localStorage.getItem("userLinks");
//     if (storedDetails) {
//       setUserDetails((prevState) => ({
//         ...prevState,
//         ...JSON.parse(storedDetails),
//       }));
//     }
//     if (storedLinks) {
//       setUserDetails((prevState) => ({
//         ...prevState,
//         links: JSON.parse(storedLinks),
//       }));
//     }
//   }, []);

//   const { profileImage, firstName, lastName, email, previewImage, links } =
//     userDetails;

//   if (!profileImage && !firstName && !lastName && !email && !previewImage) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div className="bg-bgColor ">
//       <div className="block md:hidden">
//         <MobileNavBar />
//       </div>
//       <div className="hidden md:block fixed top-0 w-full z-20">
//         <TabletNavBar />
//       </div>

//       {/* Purple background for tablet and desktop views */}
//       <div className="hidden md:block absolute top-0 left-0 w-full h-[357px] rounded-bl-[32px] rounded-br-[32px] bg-purple z-10"></div>

//       <main className="bg-bgColor w-full h-full mt-[60px] md:mt-[102px] flex flex-col justify-center items-center gap-[56px] relative">
        

//         <div className="relative w-[237px] lg:w-[349px] md:bg-white lg:rounded-[24px] flex flex-col justify-center items-center md:mt-24 z-20 md:p-[24px]  ">
//           <div className="lg:w-[257px] flex flex-col justify-center items-center ">
//             <div className="rounded-full w-[104px] h-[104px] mb-[25px] border-[4px] border-purple ">
//               {previewImage ? (
//                 <Image
//                   src={previewImage}
//                   alt="Profile"
//                   width="104"
//                   height="104"
//                   className="w-[104px] h-[104px] rounded-full"
//                 />
//               ) : (
//                 <Image
//                   src="/images/preview/man.svg"
//                   alt="man"
//                   width="113"
//                   height="112"
//                 />
//               )}
//             </div>
//             <h1 className="text-[32px] font-bold leading-[48px] mb-[8px]">
//               {firstName} {lastName}
//             </h1>
//             <p className="text-[16px] text-linkPageCustomizeText font-normal leading-[24px]">
//               {email}
//             </p>
//           </div>

//           <div className="w-full flex flex-col items-center gap-4">
//             {links.map((link, index) => (
//               <a
//                 key={index}
//                 href={link.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className={`w-full flex items-center gap-2 p-4 rounded-lg shadow-md text-white ${
//                   platformColors[link.platform]
//                 } hover:opacity-90 transition`}
//               >
//                 {platformIcons[link.platform]}
//                 <span className="mr-auto">{link.platform}</span>
//                 <Image
//                   src="/images/preview/mdi_arrow-right.svg"
//                   alt="Arrow"
//                   width="16"
//                   height="16"
//                 />
//               </a>
//             ))}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default PreviewPage;