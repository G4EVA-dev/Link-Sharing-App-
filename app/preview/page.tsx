"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

function PreviewPage() {
  const [userDetails, setUserDetails] = useState({
    profileImage: null,
    firstName: "",
    lastName: "",
    email: "",
    previewImage: null,
  });

  useEffect(() => {
    const storedDetails = localStorage.getItem("userDetails");
    if (storedDetails) {
      setUserDetails(JSON.parse(storedDetails));
    }
  }, []);

  const { profileImage, firstName, lastName, email, previewImage } = userDetails;

  if (!profileImage && !firstName && !lastName && !email && !previewImage) {
    return <p>Loading...</p>;
  }

  return (
    <div className="">
      <nav className="flex justify-around items-center py-[16px] pl-[24px] pr-[16px] mb-[60px]">
        <Link
          href="/"
          className="py-[11px] px-[27px] border border-btnpurple text-btnpurple rounded-[8px] font-superbold"
        >
          Back to editor
        </Link>
        <Link
          href="/"
          className=" py-[11px] px-[27px] rounded-[8px] text-white bg-purple"
        >
          Share Link
        </Link>
      </nav>

      <main className="w-full h-auto flex flex-col justify-center items-center gap-[56px]">
        <div className="w-[237px] flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-center mb-[56px]">
            <div className="rounded-full w-[104px] h-[104px] mb-[25px] border border-[4px] border-purple ">
              {previewImage ? (
                <img src={previewImage} alt="Profile" className="w-[104px] h-[104px] rounded-full" />
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

          <div>Links</div>
        </div>
      </main>
    </div>
  );
}

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
