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
import { Link } from '@/types';
import LoadingSpinner from './LoadingSpinner';

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

interface PhonePreviewProps {
  links: Link[];
  isLoading?: boolean;
}

const PhonePreview: React.FC<PhonePreviewProps> = ({ links, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="w-[307px] h-[631px] bg-white rounded-[32px] p-[16px] flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="w-[307px] h-[631px] bg-white rounded-[32px] p-[16px]">
      <div className="w-full h-full bg-bgColor rounded-[24px] p-[32px] flex flex-col items-center">
        <div className="w-[96px] h-[96px] rounded-full bg-gray-200 mb-[24px] relative overflow-hidden">
          <Image
            src="/images/profile-placeholder.svg"
            alt="Profile"
            fill
            className="object-cover"
          />
        </div>
        <h2 className="text-[18px] font-bold text-darkGray mb-[8px]">
          John Doe
        </h2>
        <p className="text-[14px] text-grey mb-[56px]">@johndoe</p>

        <div className="w-full space-y-[16px]">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-[44px] bg-white rounded-[8px] flex items-center justify-center text-[16px] font-semibold text-darkGray hover:bg-gray-50 transition-colors"
            >
              {link.platform || 'Custom Link'}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhonePreview;
