"use client";
import React, { useState } from "react";
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

const platformOptions = [
  { value: "GitHub", label: "GitHub", icon: <FaGithub /> },
  { value: "LinkedIn", label: "LinkedIn", icon: <FaLinkedin /> },
  { value: "Twitter", label: "Twitter", icon: <FaTwitter /> },
  { value: "Facebook", label: "Facebook", icon: <FaFacebook /> },
  { value: "YouTube", label: "YouTube", icon: <FaYoutube /> },
  { value: "freeCodeCamp", label: "freeCodeCamp", icon: <FaFreeCodeCamp /> },
  { value: "Dev.to", label: "Dev.to", icon: <FaDev /> },
  { value: "Codewars", label: "Codewars", icon: <FaCode /> },
];

// Define types for option and props
interface Option {
  value: string;
  label: string;
  icon: JSX.Element;
}

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

function CustomDropdown({ value, onChange }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: Option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  const selectedOption = platformOptions.find(
    (option) => option.value === value
  );

  return (
    <div className="relative">
      <button
        type="button"
        className="w-full flex justify-between items-center py-2 px-3 border border-gray-300 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center gap-2">
          {selectedOption ? selectedOption.icon : null}
          {selectedOption ? selectedOption.label : "Select Platform"}
        </span>
        <span className="ml-2">&#x25BC;</span>
      </button>
      {isOpen && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1">
          {platformOptions.map((option) => (
            <li
              key={option.value}
              className="flex items-center gap-2 py-2 px-3 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelect(option)}
            >
              {option.icon}
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CustomDropdown;
