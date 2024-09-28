import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

const Party = ({ text, value, onChange, disabled }) => {
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/parties');
        const formattedParties = response.data.map(party => ({
          value: party.partyName,
          label: party.partyName
        }));
        setParties(formattedParties);
        setLoading(false);
      } catch (error) {
        setError('Error fetching parties');
        setLoading(false);
      }
    };

    fetchParties();
  }, []);

  const handleSelectChange = (selectedOption) => {
    onChange({
      target: {
        name: 'partyName',
        value: selectedOption ? selectedOption.value : ''
      }
    });
  };

  if (loading) {
    return <div>Loading parties...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-6 shadow-sm shadow-darkgray">
      <label className="block text-lg font-login ml-4 mt-2 text-gray-700">
        {text} <span className="text-red-600">*</span>
      </label>
      <Select
        name="partyName"
        value={parties.find(option => option.value === value)}
        onChange={handleSelectChange}
        disabled={disabled}
        options={parties}
        placeholder="Select Party..."
        isSearchable={true}
        className="ml-4 mt-2 mb-2 w-[90%] sm:w-auto rounded-md focus:ring-darkgray border-1 focus:border-darkgray"
      />
    </div>
  );
};

export default Party;
