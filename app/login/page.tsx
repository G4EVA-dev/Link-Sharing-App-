"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, FormEvent, ChangeEvent } from "react";
import { auth } from "@/firebase"; // Adjust the import based on your file structure
import { signInWithEmailAndPassword } from "firebase/auth";

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const router = useRouter();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset errors
    setEmailError("");
    setPasswordError("");

    let valid = true;

    if (email === "") {
      setEmailError("Can't be empty");
      valid = false;
    }

    if (password === "") {
      setPasswordError("Please check again");
      valid = false;
    }

    if (!valid) {
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCredential);
      // Redirect to the link page after successful login
      router.push("/link");
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    }
  };

  return (
    <div className="bg-bgColor p-[32px] md:bg-bgColor flex flex-col items-start md:justify-center md:items-center h-screen">
      <div className="flex gap-[10px] mb-[64px] md:mb-[51px]">
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
      <div className="w-[311px] h-auto flex flex-col md:bg-loginBg md:w-[476px] md:p-[40px]">
        <div className="mb-[40px]">
          <h1 className="font-bold text-[24px] leading-[36px] mb-[8px]">
            Login
          </h1>
          <p className="font-normal text-[16px] leading-[24px]">
            Add your details below to get back into the app
          </p>
        </div>
        <form
          onSubmit={handleLogin}
          className="flex flex-col height-auto w-full"
        >
          <label
            htmlFor="email"
            className={`font-normal text-[12px] leading-[18px] mb-[4px] ${emailError ? 'text-red-500' : 'text-darkGray'}`}
          >
            Email address
          </label>
          <div className="relative mb-[24px]">
            <input
              type="email"
              id="email"
              placeholder="e.g. alex@email.com"
              className={`pl-[44px] pr-[12px] py-[10px] border-[1px] rounded-[8px] w-full ${emailError ? 'border-red-500' : 'border-inputBorder'} focus:border-purple focus:outline-none focus:shadow-custom-shadow`}
              style={{
                backgroundImage: "url(/images/email-icon.svg)",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "10px center",
                backgroundSize: "16px",
              }}
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
            {emailError && (
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 text-[12px]">
                {emailError}
              </span>
            )}
          </div>
          <label
            htmlFor="password"
            className={`font-normal text-[12px] leading-[18px] mb-[4px] ${passwordError ? 'text-red-500' : 'text-darkGray'}`}
          >
            Password
          </label>
          <div className="relative mb-[24px]">
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className={`pl-[44px] pr-[12px] py-[10px] border-[1px] rounded-[8px] w-full ${passwordError ? 'border-red-500' : 'border-inputBorder'} focus:border-purple focus:outline-none focus:shadow-custom-shadow`}
              style={{
                backgroundImage: "url(/images/password-icon.svg)",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "10px center",
                backgroundSize: "16px",
              }}
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
            {passwordError && (
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 text-[12px]">
                {passwordError}
              </span>
            )}
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="py-[10px] flex justify-center font-semibold items-center bg-loginBtnBg text-white rounded-md mb-[24px] hover:bg-buttonHover hover:shadow-custom-shadow "
          >
            Login
          </button>
        </form>
        <div className="text-center md:flex md:justify-center md:items-center">
          <p className="text-grey text-[16px] font-normal leading-[24px]">
            Don’t have an account?
          </p>
          <Link
            href="/createAccount"
            className="text-purple text-[16px] font-normal leading-[24px]"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
