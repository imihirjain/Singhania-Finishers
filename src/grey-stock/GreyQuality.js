import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

const Quality = ({ text, value, onChange, selectedParty }) => {
  const [qualities, setQualities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQualities = async () => {
      setLoading(true);
      setError('');
      try {
        if (selectedParty) {
          const response = await axios.get(`http://localhost:4000/api/parties/${selectedParty}/qualities`);
          if (Array.isArray(response.data.qualities)) {
            setQualities(response.data.qualities);
          } else {
            setQualities([]);
          }
        } else {
          setQualities([]);
        }
      } catch (error) {
        setError('Error fetching qualities');
      } finally {
        setLoading(false);
      }
    };

    fetchQualities();
  }, [selectedParty]);

  const handleSelectChange = (selectedOption) => {
    onChange(selectedOption ? selectedOption.value : '');
  };

  const qualityOptions = qualities.map((quality) => ({
    value: quality,
    label: quality,
  }));

  return (
    <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-6 shadow-sm shadow-darkgray">
      <label className="block text-lg font-login ml-4 mt-6 text-gray-700">
        {text} <span className="text-red-600">*</span>
      </label>
      {loading && <div className="ml-4 mt-2 mb-4">Loading qualities...</div>}
      {error && <div className="ml-4 mt-2 mb-4 text-red-600">{error}</div>}
      {!loading && !error && (
        <Select
          name="quality"
          value={qualityOptions.find(option => option.value === value)}
          onChange={handleSelectChange}
          options={qualityOptions}
          className="ml-4 mt-2 mb-4 w-[90%] sm:w-auto rounded-md"
          classNamePrefix="select"
          placeholder="Select Quality..."
        />
      )}
    </div>
  );
};

export default Quality;
