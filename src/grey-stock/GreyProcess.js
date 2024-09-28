import React, { useState, useRef, useEffect } from "react";

const Card = ({ text }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const dropdownRef = useRef(null);

  const options = ["Half Process", "Full Process", "Finish Process"];

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
      <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-6 shadow-sm shadow-darkgray">
        <div className="mt-4 ml-2 font-login">
          <label className="block text-lg font-login ml-4 mt-2 text-gray-700">
            {text} <span className="text-red-600">*</span>
          </label>
          <div className="relative mt-2">
            <select
              value={selectedOption}
              onChange={handleOptionChange}
              ref={dropdownRef}
              className="ml-4 mt-2 mb-2 rounded-md focus:ring-darkgray border-1 focus:border-darkgray w-[275px]"
            >
              <option value="" disabled>
                Select an option
              </option>
              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          {selectedOption && (
            <div className="mt-4 ml-2 mb-2 text-lg text-gray-700">
              Selected Process: <span className="font-semibold">{selectedOption}</span>
            </div>
          )}
        </div>
      </div>
  );
};

export default Card;

