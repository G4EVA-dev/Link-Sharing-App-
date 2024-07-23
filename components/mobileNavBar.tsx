import React from "react";
import Image from "next/image";
import Link from "next/link";

function mobileNavBar() {
  return (
    <nav className="flex justify-between items-center py-[16px] pl-[24px] pr-[16px] ">
      <Image
        src="/images/mobileNav/logo.svg"
        alt="logo"
        width="32"
        height="32"
      />

      <Link href="link">
        <Image
          src="/images/mobileNav/link.svg"
          alt="Link"
          width="21"
          height="20"
        />
      </Link>
      <Link href="profile">
        <Image
          src="/images/mobileNav/profile.svg"
          alt="profile"
          width="21"
          height="20"
        />
      </Link>
      <Link href="preview">
        <Image
          src="/images/mobileNav/eye.svg"
          alt="leye"
          width="20"
          height="20"
        />
      </Link>
    </nav>
  );
}

export default mobileNavBar;
