import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

const Quality = ({ text, value, onChange, selectedParty }) => {
  const [qualities, setQualities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQualities = async () => {
      if (selectedParty) {
        setLoading(true);
        console.log(`Fetching qualities for party ID: ${selectedParty}`);
        try {
          const response = await axios.get(`http://localhost:4000/api/party/${selectedParty}/qualities`);
          console.log('Qualities fetched:', response.data);
          setQualities(response.data || []); // Assuming the response is an array of strings
          setLoading(false);
        } catch (error) {
          console.error('Error fetching qualities:', error);
          setError('Error fetching qualities');
          setLoading(false);
        }
      } else {
        setQualities([]);
        console.log('No party selected, qualities reset.');
      }
    };

    fetchQualities();
  }, [selectedParty]);

  const handleSelectChange = (selectedOption) => {
    const selectedValue = selectedOption ? selectedOption.value : '';
    console.log(`Selected quality: ${selectedValue}`);
    onChange({
      target: {
        name: 'quality',
        value: selectedValue,
      },
    });
  };

  if (loading) {
    return <div>Loading qualities...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const qualityOptions = qualities.map((quality) => ({
    value: quality,
    label: quality,
  }));

  return (
    <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-6 shadow-sm shadow-darkgray">
      <label className="block text-lg font-login ml-4 mt-2 text-gray-700">
        {text} <span className="text-red-600">*</span>
      </label>
      <Select
        name="quality"
        value={qualityOptions.find(option => option.value === value)}
        onChange={handleSelectChange}
        options={qualityOptions}
        className="ml-4 mt-2 mb-2 w-[90%] sm:w-auto rounded-md"
        classNamePrefix="select"
      />
    </div>
  );
};

export default Quality;
