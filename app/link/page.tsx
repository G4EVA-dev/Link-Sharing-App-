"use client";
import React, { useState } from "react";
import MobileNavBar from "@/components/mobileNavBar";
import Image from "next/image";
import CustomDropdown from "@/components/customDropDown";

function Page() {
  const [links, setLinks] = useState([{ platform: "", url: "" }]);

  const handleAddLink = () => {
    setLinks([...links, { platform: "", url: "" }]);
  };

  const handleRemoveLink = (index) => {
    const updatedLinks = links.filter((_, i) => i !== index);
    setLinks(updatedLinks);
  };

  const handlePlatformChange = (index, value) => {
    const updatedLinks = links.map((link, i) =>
      i === index ? { ...link, platform: value } : link
    );
    setLinks(updatedLinks);
  };

  const handleUrlChange = (index, value) => {
    const updatedLinks = links.map((link, i) =>
      i === index ? { ...link, url: value } : link
    );
    setLinks(updatedLinks);
  };

  const handleSave = () => {
    localStorage.setItem("userLinks", JSON.stringify(links));
    alert("Links saved successfully!");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <MobileNavBar />
      <main className="flex flex-1 items-center justify-center p-4 md:p-16">
        <div className="w-full max-w-md flex flex-col p-4 bg-white rounded-lg shadow-md md:max-w-2xl">
          <div className="w-full p-6 flex flex-col items-start justify-center rounded-lg">
            <h1 className="text-2xl font-bold leading-9 mb-4">
              Customize your links
            </h1>
            <p className="text-base text-linkPageCustomizeText font-normal leading-6 mb-10">
              Add/edit/remove links below and then share all your profiles with
              the world!
            </p>
            <button
              className="w-full flex justify-center gap-2 items-center py-2 px-6 border border-btnpurple text-btnpurple rounded-lg font-semibold mb-6"
              onClick={handleAddLink}
            >
              + Add new Link
            </button>
            {links.map((link, index) => (
              <div
                key={index}
                className="w-full p-4 mb-4 bg-gray-50 rounded-md shadow-sm flex flex-col gap-4"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-[16px] text-linkGray font-semibold">
                    Link #{index + 1}
                  </h2>
                  <button
                    className="text-linkGray"
                    onClick={() => handleRemoveLink(index)}
                  >
                    Remove
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] text-linkPageCustomizeText font-normal leading-[18px]">
                    Platform
                  </label>
                  <CustomDropdown
                    value={link.platform}
                    onChange={(value) => handlePlatformChange(index, value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] text-linkPageCustomizeText font-normal leading-[18px]">
                    Link
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. https://www.github.com/"
                    className="py-2 px-3 border border-gray-300 rounded-md"
                    value={link.url}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-t-1 border-saveborder">
            <button
              className="bg-linkSave w-full py-3 px-6 rounded-lg text-white"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Page;
