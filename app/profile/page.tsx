import React from "react";
import MobileNavBar from "@/components/mobileNavBar";

function page() {
  return (
    <div>
      <MobileNavBar />
      <main className="p-[16px] ">
        <div className="p-[24px] ">
          <h1 className="text-[24px] font-bold leading-[36px]">
            Product Details
          </h1>
          <p className="text-[16px] text-linkPageCustomizeText font-normal leading-[24px] mb-[40px]">
            Add your details to create a personal touch to your profile.
          </p>

          <div className="p-[20px] bg-bgColor mb-[24px] ">
            <p className="text-[16px] text-linkPageCustomizeText font-normal leading-[24px] mb-[40px]">
              Profile picture
            </p>

            <div className="profilePicture" >

            </div>

            <p className="text-[12px] text-linkPageCustomizeText font-normal leading-[18px] mb-[40px]">
              Image must be below 1024x1024px. Use PNG or JPG format.
            </p>
          </div>

          {/* -----SOmething Here------ */}

          <form action="" className="p-5 bg-bgColor w-full mb-[25px] ">
            <div className="flex flex-col gap-1 mb-3">
              <label
                htmlFor="firstName"
                className="text-[12px] text-linkPageCustomizeText font-normal leading-[18px]"
              >
                First Name*
              </label>
              <input
                type="text"
                id="firstName"
                className="py-[12px] px-[16px] border border-gray-300 rounded-md"
                placeholder="Ben"
              />
            </div>
            <div className="flex flex-col gap-1 mb-3">
              <label
                htmlFor="lastName"
                className="text-[12px] text-linkPageCustomizeText font-normal leading-[18px]"
              >
                Last Name*
              </label>
              <input
                type="text"
                id="lastName"
                className="py-[12px] px-[16px] border border-gray-300 rounded-md"
                placeholder="Wright"
              />
            </div>
            <div className="flex flex-col gap-1 mb-3">
              <label
                htmlFor="email"
                className="text-[12px] text-linkPageCustomizeText font-normal leading-[18px]"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="py-[12px] px-[16px] border border-gray-300 rounded-md"
                placeholder="ben@example.com"
              />
            </div>
          </form>
        </div>
        <div className="p-[16px] border-t border-t-1 border-saveborder">
          <button
            type="submit"
            className="w-full font-semibold py-[11px] px-[27px] bg-purple text-white rounded-md"
          >
            Save
          </button>
        </div>
      </main>
    </div>
  );
}

export default page;
