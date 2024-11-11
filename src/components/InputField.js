import React from "react";

const InputField = ({ text, name, value, onChange, disabled }) => {
  return (
    <div className="border-2 w-full sm:w-[500px] h-32 rounded-lg mt-6 shadow-sm shadow-darkgray">
      <label className="block text-lg font-login ml-4 mt-2 text-gray-700">
        {text} <span className="text-red-600">*</span>
      </label>
      <input
        type="text"
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className="ml-4 mt-4 mb-2 w-[70%] rounded-md focus:ring-darkgray border-1 focus:border-darkgray"
        placeholder="Your Answer"
      />
    </div>
  );
};

export default InputField;
