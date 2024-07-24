"use client"
import React, { useState, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/firebase"; // Adjust the import based on your file structure
import { createUserWithEmailAndPassword } from "firebase/auth";

function CreateAccount() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log(userCredential);
      // Redirect to login page or dashboard after successful sign up
    } catch (error: any) { // Use `any` to access error properties
      console.error(error);
      setError(error.message);
    }
  };

  return (
    <div className="p-[32px] md:bg-bgColor flex flex-col items-start justify-center md:items-center h-screen ">
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
      <div className="w-[311px] h-auto flex flex-col md:bg-loginBg md:w-[476px] md:p-[40px]">
        <div className="mb-[40px]">
          <h1 className="font-bold text-[24px] leading-[36px] mb-[8px]">
            Create Account
          </h1>
          <p className="font-normal text-[16px] leading-[24px] text-darkGray">
            Let’s get you started sharing your links!
          </p>
        </div>
        <form onSubmit={handleSignUp} className="flex flex-col height-auto w-full">
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
              className="pl-[44px] pr-[12px] py-[10px] border border-black rounded-md w-full"
              style={{
                backgroundImage: "url(/images/email-icon.svg)",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "10px center",
                backgroundSize: "16px",
              }}
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
              placeholder="At least 8 characters"
              className="pl-[44px] pr-[12px] py-[10px] border border-black rounded-md w-full"
              style={{
                backgroundImage: "url(/images/password-icon.svg)",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "10px center",
                backgroundSize: "16px",
              }}
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
          </div>
          <label
            htmlFor="confirm-password"
            className="font-normal text-[12px] leading-[18px] text-darkGray mb-[4px]"
          >
            Confirm Password
          </label>
          <div className="relative mb-[24px]">
            <input
              type="password"
              id="confirm-password"
              placeholder="At least 8 characters"
              className="pl-[44px] pr-[12px] py-[10px] border border-black rounded-md w-full"
              style={{
                backgroundImage: "url(/images/password-icon.svg)",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "10px center",
                backgroundSize: "16px",
              }}
              value={confirmPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="py-[10px] flex justify-center items-center bg-loginBtnBg text-white rounded-md mb-[24px]"
          >
            Create account
          </button>
        </form>
        <div className="text-center md:flex md:justify-center md:items-center">
          <p className="text-grey text-[16px] font-normal leading-[24px]">
            Already have an account?
          </p>
          <Link
            href="/login"
            className="text-purple text-[16px] font-normal leading-[24px]"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;





// import React from "react";
// import Image from "next/image";
// import Link from "next/link";

// function CreateAccount() {
//   return (
//     <div className="p-[32px] md:bg-bgColor flex flex-col items-start justify-center md:items-center h-screen ">
//       <div className="flex gap-[10px] mb-[64px] md:mb-[51px] ">
//         <Image
//           src="/images/Vector.svg"
//           alt="Image vector"
//           width="34"
//           height="34"
//         />
//         <Image
//           src="/images/devlinks.svg"
//           alt="devlinks"
//           width="136"
//           height="27"
//         />
//       </div>
//       <div className="w-[311px]  h-auto flex flex-col  md:bg-loginBg md:w-[476px] md:p-[40px] ">
//         <div className="mb-[40px]">
//           <h1 className="font-bold text-[24px] leading-[36px] mb-[8px]">
//             Create Account
//           </h1>
//           <p className="font-normal text-[16px] leading-[24px] text-darkGray">
//             Let’s get you started sharing your links!
//           </p>
//         </div>
//         <form action="" className="flex flex-col height-auto w-full">
//           <label
//             htmlFor="email"
//             className="font-normal text-[12px] leading-[18px] text-darkGray mb-[4px]"
//           >
//             Email address
//           </label>
//           <div className="relative mb-[24px]">
//             <input
//               type="email"
//               id="email"
//               placeholder="e.g. alex@email.com"
//               className="pl-[44px] pr-[12px] py-[10px] border border-black rounded-md w-full"
//               style={{
//                 backgroundImage: "url(/images/email-icon.svg)",
//                 backgroundRepeat: "no-repeat",
//                 backgroundPosition: "10px center",
//                 backgroundSize: "16px",
//               }}
//             />
//           </div>
//           <label
//             htmlFor="password"
//             className="font-normal text-[12px] leading-[18px] text-darkGray mb-[4px]"
//           >
//             Password
//           </label>
//           <div className="relative mb-[24px]">
//             <input
//               type="password"
//               id="password"
//               placeholder="At least 8 characters"
//               className="pl-[44px] pr-[12px] py-[10px] border border-black rounded-md w-full"
//               style={{
//                 backgroundImage: "url(/images/password-icon.svg)",
//                 backgroundRepeat: "no-repeat",
//                 backgroundPosition: "10px center",
//                 backgroundSize: "16px",
//               }}
//             />
//           </div>
//           <label
//             htmlFor="confirm-password"
//             className="font-normal text-[12px] leading-[18px] text-darkGray mb-[4px]"
//           >
//             Confirm Password
//           </label>
//           <div className="relative mb-[24px]">
//             <input
//               type="password"
//               id="confirm-password"
//               placeholder="At least 8 characters"
//               className="pl-[44px] pr-[12px] py-[10px] border border-black rounded-md w-full"
//               style={{
//                 backgroundImage: "url(/images/password-icon.svg)",
//                 backgroundRepeat: "no-repeat",
//                 backgroundPosition: "10px center",
//                 backgroundSize: "16px",
//               }}
//             />
//           </div>
//           <Link
//             href="/login"
//             className="py-[10px] flex justify-center items-center bg-loginBtnBg text-white rounded-md mb-[24px] "
//           >
//             Create account
//           </Link>
//         </form>

//         <div className="text-center md:flex md:justify-center md:items-center  ">
//           <p className="text-grey text-[16px] font-normal leading-[24px] ">
//             Already have an account?
//           </p>
//           <Link
//             href="login"
//             className="text-purple text-[16px] font-normal leading-[24px] "
//           >
//             Login
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CreateAccount;
