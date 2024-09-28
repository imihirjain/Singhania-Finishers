import React, { useState } from "react";
import axios from "axios";

const GenerateLot = ({ text }) => {
  const [lotNumber, setLotNumber] = useState("");

  const handleGenerate = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/generate-lot-number");
      if (response.data && response.data.lotNumber) {
        setLotNumber(response.data.lotNumber);
      }
    } catch (error) {
      console.error("Error generating lot number:", error);
    }
  };

  return (
    <>
      <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-6 shadow-sm shadow-darkgray">
        <label className="block text-lg font-login ml-4 mt-2 text-gray-700">
          {text} <span className="text-red-600">*</span>
        </label>

        <div className="lg:flex lg:items-center">
          <button
            type="button"
            className="inline-flex ml-4 mt-4 mb-4 px-10 py-2 text-sm font-medium text-white bg-darkgray rounded-md hover:bg-white hover:text-darkgray outline"
            onClick={handleGenerate}
          >
            Generate
          </button>

          <input
            type="text"
            value={lotNumber}
            readOnly
            className="lg:ml-[60px] sm:flex sm:flex-col ml-5 mt-2 mb-4 lg:mb-2 h-10 rounded-md focus:ring-darkgray border-1 w-[200px] focus:border-darkgray"
            placeholder="Lot Number"
          />
        </div>
      </div>
    </>
  );
};

export default GenerateLot;
