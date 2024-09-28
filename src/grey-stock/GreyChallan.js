import React, { useEffect, useState } from "react";
import axios from "axios";

const InputField = ({ text, name, value, onChange, PartyName, Quality }) => {
  const [challans, setChallans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (PartyName && Quality) {
      fetchData();
    } else {
      setChallans([]);
    }
  }, [PartyName, Quality]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      console.log(`Fetching challans for party: ${PartyName} and quality: ${Quality}`);
      const response = await axios.get(
        `http://localhost:4000/api/parties/${PartyName}/qualities/${Quality}/challans`
      );
      console.log('Challans fetched:', response.data);

      if (Array.isArray(response.data)) {
        setChallans(response.data);
      } else {
        console.warn('Expected an array of challans but got:', response.data);
        setChallans([]);
      }
    } catch (error) {
      console.error("Error fetching challans:", error);
      setError('Error fetching challans. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-6 shadow-sm shadow-darkgray">
      <label className="block text-lg font-login ml-4 mt-2 text-gray-700">
        {text} <span className="text-red-600">*</span>
      </label>
      {loading && <div className="ml-4 mt-2 mb-2">Loading challans...</div>}
      {error && <div className="ml-4 mt-2 mb-2 text-red-600">{error}</div>}
      {!loading && !error && (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="ml-4 mt-2 mb-2 rounded-md focus:ring-darkgray border-1 focus:border-darkgray"
        >
          <option value="">Select Challan</option>
          {challans.map((challan, index) => (
            <option key={index} value={challan}>
              {challan}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default InputField;
