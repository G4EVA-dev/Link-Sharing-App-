import React from "react";
import Image from "next/image";
import Link from "next/link";

const mobileNavBar: React.FC = () => {
  return (
    <nav className="block md:hidden py-[16px] pl-[24px] pr-[16px]  ">
      <div className="flex justify-between items-center ">
        <Image
          src="/images/mobileNav/logo.svg"
          alt="logo"
          width="32"
          height="32"
        />

        <div className="flex justify-center items-center ">
          <Link href="link" className="py-[11px] px-[27px]">
            <Image
              src="/images/mobileNav/link.svg"
              alt="Link"
              width="21"
              height="20"
            />
          </Link>
          <Link href="profile" className="py-[11px] px-[27px]">
            <Image
              src="/images/mobileNav/profile.svg"
              alt="profile"
              width="21"
              height="20"
            />
          </Link>
        </div>

        <Link
          href="preview"
          className="py-[11px] px-[16px] border border-btnpurple text-btnpurple rounded-[8px] "
        >
          <Image
            src="/images/mobileNav/eye.svg"
            alt="leye"
            width="20"
            height="20"
          />
        </Link>
      </div>
    </nav>
  );
};

export default mobileNavBar;
