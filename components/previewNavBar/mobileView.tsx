import React from "react";
import Link from "next/link";

const MobileNavBar: React.FC = () => {
  return (
    <nav className="flex justify-around items-center py-4 pl-6 pr-4 bg-purple-500 text-white md:hidden">
      <Link
        href="/link"
        className="py-[11px] px-[27px] border border-btnpurple text-btnpurple rounded-[8px] font-superbold"
      >
        Back to editor
      </Link>
      <Link
        href="#"
        className=" py-[11px] px-[27px] rounded-[8px] text-white bg-purple"
      >
        Share Link
      </Link>
    </nav>
  );
};

export default MobileNavBar;
