"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function Login() {
  return (
    <div className="p-[32px] md:bg-bgColor flex flex-col items-start md:justify-center md:items-center h-screen ">
      <div className="flex gap-[10px] mb-[64px] md:mb-[51px] ">
        <Image
          src="/images/Vector.svg"
          alt="Image vector"
          width="34"
          height="34"
        />
        <Image
          src="/images/devlinks.svg"
          alt="devlinks"
          width="136"
          height="27"
        />
      </div>
      <div className="w-[311px]  h-auto flex flex-col  md:bg-loginBg md:w-[476px] md:p-[40px] ">
        <div className="mb-[40px]">
          <h1 className="font-bold text-[24px] leading-[36px] mb-[8px]">
            Login
          </h1>
          <p className="font-normal text-[16px] leading-[24px]">
            Add your details below to get back into the app
          </p>
        </div>
        <form action="" className="flex flex-col height-auto w-full">
          <label
            htmlFor="email"
            className="font-normal text-[12px] leading-[18px] text-darkGray mb-[4px]"
          >
            Email address
          </label>
          <div className="relative mb-[24px]">
            <input
              type="email"
              id="email"
              placeholder="e.g. alex@email.com"
              className="pl-[44px] pr-[12px] py-[10px] border border-1 border-inputBorder rounded-[8px] w-full"
              style={{
                backgroundImage: "url(/images/email-icon.svg)",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "10px center",
                backgroundSize: "16px",
              }}
            />
          </div>
          <label
            htmlFor="password"
            className="font-normal text-[12px] leading-[18px] text-darkGray mb-[4px]"
          >
            Password
          </label>
          <div className="relative mb-[24px]">
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="pl-[44px] pr-[12px] py-[10px] border border-1 border-inputBorder rounded-[8px] w-full mb-[24px] "
              style={{
                backgroundImage: "url(/images/password-icon.svg)",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "10px center",
                backgroundSize: "16px",
              }}
            />
          </div>
          <button className="py-[10px] bg-loginBtnBg text-white rounded-md mb-[24px] ">
            Login
          </button>
        </form>

        <div className="text-center md:flex md:justify-center md:items-center  ">
          <p className="text-grey text-[16px] font-normal leading-[24px] ">
            Don’t have an account?
          </p>
          <Link
            href="/createAccount"
            className="text-purple text-[16px] font-normal leading-[24px] "
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;