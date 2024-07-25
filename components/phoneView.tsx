"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaYoutube,
  FaFreeCodeCamp,
  FaDev,
  FaCode,
} from "react-icons/fa";

const platformIcons = {
  GitHub: <FaGithub style={{ color: "white" }} />,
  LinkedIn: <FaLinkedin style={{ color: "white" }} />,
  Twitter: <FaTwitter style={{ color: "white" }} />,
  Facebook: <FaFacebook style={{ color: "white" }} />,
  YouTube: <FaYoutube style={{ color: "white" }} />,
  freeCodeCamp: <FaFreeCodeCamp style={{ color: "white" }} />,
  "Dev.to": <FaDev style={{ color: "white" }} />,
  Codewars: <FaCode style={{ color: "white" }} />,
};

const platformColors = {
  GitHub: "bg-black",
  LinkedIn: "bg-linkedInColor",
  Twitter: "bg-blue-400",
  Facebook: "bg-blue-800",
  YouTube: "bg-youtubeColor",
  freeCodeCamp: "bg-freeCodeCampColor",
  "Dev.to": "bg-devToColor",
  Codewars: "bg-codeWarColor",
};

type Platform = keyof typeof platformIcons;

interface LinkType {
  platform: Platform;
  url: string;
}

interface UserDetailsType {
  profileImage: string | null;
  firstName: string;
  lastName: string;
  email: string;
  previewImage: string | null;
  links: LinkType[];
}

const PhonePreview: React.FC = () => {
  const [userDetails, setUserDetails] = useState<UserDetailsType>({
    profileImage: null,
    firstName: "",
    lastName: "",
    email: "",
    previewImage: null,
    links: [],
  });

  useEffect(() => {
    const storedDetails = localStorage.getItem("userDetails");
    const storedLinks = localStorage.getItem("userLinks");
    if (storedDetails) {
      setUserDetails((prevState) => ({
        ...prevState,
        ...JSON.parse(storedDetails),
      }));
    }
    if (storedLinks) {
      setUserDetails((prevState) => ({
        ...prevState,
        links: JSON.parse(storedLinks),
      }));
    }
  }, []);

  const { profileImage, firstName, lastName, email,previewImage,  links } = userDetails;

  // Determine whether to show skeleton or actual content
  const isLoading =
    !profileImage && !firstName && !lastName && !email && !previewImage && links.length === 0;

  return (
    <div className="bg-white w-[560px] h-full flex justify-center items-center">
      <div className="w-[308px] h-[632px] border-[1px] border-phoneViewBorder rounded-[53.5px] flex justify-center items-center custom-top-border">
        <div className="w-[286px] h-[612px] p-4 border-[1px] border-phoneViewBorder rounded-[44.5px] ">
          <div className="relative flex justify-center items-center flex-col">
            {isLoading ? (
              <>
                <div className="skeleton-circle bg-gray-200 h-[96px] w-[96px] rounded-full mt-[34px]"></div>
                <div className="name skeleton-line bg-gray-200 h-4 w-48 rounded my-2"></div>
                <div className="email skeleton-line bg-gray-200 h-4 w-36 rounded my-2"></div>
                <div className="links skeleton-line bg-gray-200 h-12 w-[237px] rounded mt-[56px]"></div>
                <div className="links skeleton-rect bg-gray-200 h-10 w-[237px] rounded mt-[20px]"></div>
                <div className="links skeleton-rect bg-gray-200 h-10 w-[237px] rounded mt-[20px]"></div>
                <div className="links skeleton-rect bg-gray-200 h-10 w-[237px] rounded mt-[20px]"></div>
                <div className="links skeleton-rect bg-gray-200 h-10 w-[237px] rounded mt-[20px]"></div>
              </>
            ) : (
              <>
                {previewImage ? (
                  <Image
                    src={previewImage}
                    width="96" height="96"
                    alt="Profile Preview"

                    className="rounded-full w-[96px] h-[96px] object-cover mt-[34px]"
                  />
                ) : (
                  <div className="skeleton-circle bg-gray-200 h-[96px] w-[96px] rounded-full mt-[34px]"></div>
                )}
                <div className="name text-center text-lg font-bold mt-2">
                  {firstName && lastName ? (
                    `${firstName} ${lastName}`
                  ) : (
                    <div className="skeleton-line bg-gray-200 h-4 w-48 rounded mx-auto"></div>
                  )}
                </div>
                <div className="email text-center text-sm mt-2">
                  {email ? (
                    email
                  ) : (
                    <div className="skeleton-line bg-gray-200 h-4 w-36 rounded mx-auto"></div>
                  )}
                </div>
                <div className="links mt-[56px] w-full flex flex-col items-center gap-4">
                  {links.length > 0 ? (
                    links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full flex items-center gap-2 p-4 rounded-lg shadow-md text-white ${
                          platformColors[link.platform]
                        } hover:opacity-90 transition`}
                      >
                        {platformIcons[link.platform]}
                        <span className="mr-auto ">{link.platform}</span>
                        <Image
                          src="/images/preview/mdi_arrow-right.svg"
                          alt="Arrow"
                          width="16"
                          height="16"
                        />
                      </a>
                    ))
                  ) : (
                    <>
                      <div className="links skeleton-rect bg-gray-200 h-10 w-[237px] rounded mt-[20px]"></div>
                      <div className="links skeleton-rect bg-gray-200 h-10 w-[237px] rounded mt-[20px]"></div>
                      <div className="links skeleton-rect bg-gray-200 h-10 w-[237px] rounded mt-[20px]"></div>
                      <div className="links skeleton-rect bg-gray-200 h-10 w-[237px] rounded mt-[20px]"></div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhonePreview;
