import React from "react";

const GreyInputField = ({ text, value, onChange, isDisabled }) => {
  return (
    <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-6 shadow-sm shadow-darkgray">
      <label className="block text-lg font-login ml-4 mt-4 text-gray-700">
        {text} <span className="text-red-600">*</span>
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="ml-4 mt-4 mb-4 w-[90%] sm:w-auto rounded-md"
        placeholder={`Enter ${text}`}
        disabled={isDisabled}
      />
    </div>
  );
};

export default GreyInputField;
