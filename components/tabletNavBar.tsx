import React from "react";
import Image from "next/image";
import Link from "next/link";

const TabletNavBar: React.FC = () => {
  return (
    <nav className="hidden md:block lg:p-[24px]  p-[24px]  ">
      <div className="bg-white  flex justify-between items-center py-[16px] pl-[24px] pr-[24px] rounded-[12px] ">
        <div className="flex items-center justify-center gap-[6px] ">
          <Image
            src="/images/mobileNav/logo.svg"
            alt="logo"
            width="32"
            height="32"
          />
          <Image
            src="/images/devlinks.svg"
            alt="devlinks"
            width="136"
            height="27"
          />
        </div>

        <div className="flex justify-center items-center ">
          <Link href="link">
            <div className="flex justify-center items-center py-[11px] px-[16px] gap-[8px] ">
              <Image
                src="/images/mobileNav/link.svg"
                alt="Link"
                width="21"
                height="20"
              />
              <p className="text-profileDetails text-[16px] leading-6 font-semibold">
                Link
              </p>
            </div>
          </Link>

          <Link href="profile">
            <div className=" flex justify-center items-center py-[11px] px-[16px] gap-[8px] ">
              <Image
                src="/images/mobileNav/profile.svg"
                alt="profile"
                width="21"
                height="20"
              />

              <p className="text-profileDetails text-[16px] leading-6 font-semibold">
                Profile Details
              </p>
            </div>
          </Link>
        </div>

        <Link
          href="preview"
          className="py-[11px] px-[16px] border border-btnpurple text-btnpurple rounded-[8px] "
        >
          Preview
        </Link>
      </div>
    </nav>
  );
};

export default TabletNavBar;
