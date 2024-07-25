import React from "react";
import Link from "next/link";

const TabletNavBar: React.FC = () => {
  return (
    <nav className="hidden md:block lg:p-[24px]  p-[24px]">
      <div className=" flex rounded-[12px] bg-white justify-between py-4 pl-6 pr-4  " >
        <Link
          href="/link"
          className="py-[11px] px-[27px] border border-btnpurple text-btnpurple rounded-[8px] font-semibold"
        >
          Back to editor
        </Link>
        <Link
          href="#"
          className=" py-[11px] px-[27px] font-semibold rounded-[8px] text-white bg-purple"
        >
          Share Link
        </Link>
      </div>
    </nav>
  );
};

export default TabletNavBar;
