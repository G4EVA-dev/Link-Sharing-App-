// import React from "react";
// import MobileNavBar from "@/components/mobileNavBar";
// import Image from "next/image";

// function page() {
//   return (
//     <div>
//       <MobileNavBar />

//       <main className="w-[343px] h-screen mt-[16px] flex p-[16px] flex-col justify-center ">
//         <div className="p-[24px]  flex flex-col items-start self-stretch justify-center ">
//           <h1 className="text-[24px] font-bold leading-[36px] ">
//             Customize your links
//           </h1>
//           <p className="text-[16px] text-linkPageCustomizeText font-normal leading-[24px] mb-[40px] ">
//             Add/edit/remove links below and then share all your profiles with
//             the world!
//           </p>

//           <button className="w-full flex justify-center gap-[8px] items-start py-[11px] px-[27px] border border-btnpurple text-btnpurple rounded-[8px] font-superbold mb-[24px] ">
//             + Add new Link
//           </button>

//           <div className="w-full h-[377px] bg-bgColor flex flex-col items-center justify-center rounded-[12px] ">
//             <Image
//               src="/images/mobileNav/grouplink.svg"
//               alt="Group Links"
//               width="125"
//               height="81"
//               className="mb-[24px] "
//             />
//             <h1 className="text-[24px] font-bold leading-[36px] mb-[24px]  ">
//               Let’s get you started
//             </h1>
//             <p className="w-[255px] text-[16px] text-center text-linkPageCustomizeText font-normal leading-[24px] mb-[40px] ">
//               Use the “Add new link” button to get started. Once you have more
//               than one link, you can reorder and edit them. We’re here to help
//               you share your profiles with everyone!
//             </p>
//           </div>
//         </div>

//         <div className="p-[16px] border-t border-t-1 border-saveborder">
//           <button className="bg-linkSave w-full py-[11px] px-[27px] rounded-[8px] text-white ">
//             Save
//           </button>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default page;

import React from "react";
import MobileNavBar from "@/components/mobileNavBar";
import Image from "next/image";

function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <MobileNavBar />
      <main className="flex flex-1 items-center justify-center p-[16px] md:p-16">
        <div className="w-[343px] mt-4 flex flex-col p-4 md:p-16">
          <div className="w-full p-6 flex flex-col items-startjustify-center rounded-[12px] ">
            <h1 className="text-[24px] font-bold leading-[36px]">
              Customize your links
            </h1>
            <p className="text-[16px] text-linkPageCustomizeText font-normal leading-[24px] mb-[40px]">
              Add/edit/remove links below and then share all your profiles with
              the world!
            </p>
            <button className="w-full flex justify-center gap-[8px] items-start py-[11px] px-[27px] border border-btnpurple text-btnpurple rounded-[8px] font-superbold mb-[24px] ">
              + Add new Link
            </button>
            <div className="w-full h-96 bg-gray-100 flex flex-col items-center justify-center rounded-md">
              <Image
                src="/images/mobileNav/grouplink.svg"
                alt="Group Links"
                width="125"
                height="81"
                className="mb-6"
              />
              <h1 className="text-2xl font-bold leading-9 mb-6">
                Let’s get you started
              </h1>
              <p className="w-[255px] text-base text-center text-gray-600 font-normal leading-6 mb-10">
                Use the “Add new link” button to get started. Once you have more
                than one link, you can reorder and edit them. We’re here to help
                you share your profiles with everyone!
              </p>
            </div>
          </div>
          <div className="p-[16px] border-t border-t-1 border-saveborder">
            <button className="bg-linkSave w-full py-[11px] px-[27px] rounded-[8px] text-white ">
              Save
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Page;
