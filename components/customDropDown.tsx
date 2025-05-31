"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaYoutube,
  FaFreeCodeCamp,
  FaDev,
  FaCode,
  FaChevronDown,
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

export interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ value, onChange, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: Option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  const selectedOption = platformOptions.find(
    (option) => option.value === value
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className={`w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-md ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-purple'
        } focus:outline-none focus:shadow-custom-shadow`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className={value ? 'text-darkGray' : 'text-gray-400'}>
          {value ? (
            <span className="flex items-center gap-2">
              {selectedOption ? selectedOption.icon : null}
              {selectedOption ? selectedOption.label : "Select Platform"}
            </span>
          ) : "Select platform"}
        </span>
        <FaChevronDown className={`text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {platformOptions.map((option) => (
            <button
              key={option.value}
              className={`w-full flex items-center gap-2 text-left px-3 py-2 hover:bg-gray-100 ${
                value === option.value ? 'bg-gray-100' : ''
              }`}
              onClick={() => {
                handleSelect(option);
              }}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
