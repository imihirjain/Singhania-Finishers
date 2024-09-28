import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EntryTable = () => {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [selectedQualityIndex, setSelectedQualityIndex] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, entries]);

  const fetchEntries = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/entries');
      console.log('Fetched Entries:', response.data);
      setEntries(response.data);
      setFilteredEntries(response.data); // Initialize filtered entries
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const filtered = entries.filter(entry => 
      entry.partyName.toLowerCase().includes(query) ||
      entry.challanNumber.toLowerCase().includes(query)
    );
    setFilteredEntries(filtered);
  };

  const handleEditClick = (entry, qualityIndex) => {
    const quality = entry.qualities[qualityIndex];
    setSelectedEntry({
      ...entry,
      quality: quality.quality,
      kg: quality.kg,
      meter: quality.meter,
      rolls: quality.roll,
    });
    setSelectedQualityIndex(qualityIndex);
    setShowEditModal(true);
  };

  const handleDeleteClick = (entry, qualityIndex) => {
    setSelectedEntry({ ...entry });
    setSelectedQualityIndex(qualityIndex);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:4000/api/entries/${selectedEntry._id}`);
      fetchEntries();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const handleEditConfirm = async () => {
    try {
      const updatedEntry = { ...selectedEntry };
      updatedEntry.qualities[selectedQualityIndex] = {
        quality: selectedEntry.quality,
        kg: selectedEntry.kg,
        meter: selectedEntry.meter,
        roll: selectedEntry.rolls, // Ensure to use the correct field name for rolls
      };

      console.log('Updating entry with data:', updatedEntry);
      await axios.put(`http://localhost:4000/api/entries/${selectedEntry._id}`, updatedEntry);
      fetchEntries();
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating entry:', error.response ? error.response.data : error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedEntry({ ...selectedEntry, [name]: value });
  };

  return (
    <>
    <div className="w-full mt-6 bg-white border-nav border-2 rounded-lg">
      <div className="flex flex-col lg:flex lg:flex-row ml-4 mt-4 lg:justify-between">
        <div className="text-title font-bold">
          Accounts Stock IN Table <br /> Total: {filteredEntries.length}
        </div>

        <div className="flex items-center bg-backgrnd mt-3 justify-center mr-6 h-[35px] overflow-hidden rounded-full">
          <div>
            <img
              className="h-[24px] w-[24px] ml-5"
              src={require("../../assets/searchicon.png")}
              alt="Inventory Management System"
            />
          </div>
          <div className="h-[25px] ml-6 border-total border-[1px]"></div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Party Name or Challan No..."
            className="mb-4 mt-3 w-[250px] bg-backgrnd placeholder:text-center border border-none placeholder:font-login placeholder:text-[14px] placeholder:bg-backgrnd placeholder:text-total font-medium"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y mt-6 divide-gray-200 border overflow-hidden">
          <thead className="bg-header text-header-font font-login font-semibold">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">Party Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">Challan No.</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">Quality</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">KG</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">Meter</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">Rolls</th>
              <th className="px-12 py-3 text-left text-xs font-semibold text-[14px] uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-login font-header text-[16px] font-medium divide-gray-200">
            {filteredEntries.map((entry) =>
              entry.qualities.map((quality, qualityIndex) => (
                <tr key={`${entry._id}-${qualityIndex}`} className="hover:bg-gray-100">
                  <td className="px-4 py-2 whitespace-nowrap">{entry.partyName}</td>
                  <td className="px-7 py-2 whitespace-nowrap">{entry.challanNumber}</td>
                  <td className="px-7 py-2 whitespace-nowrap">{quality.quality}</td>
                  <td className="px-7 py-2 whitespace-nowrap">{quality.kg}</td>
                  <td className="px-7 py-2 whitespace-nowrap">{quality.meter}</td>
                  <td className="px-7 py-2 whitespace-nowrap">{quality.roll}</td>
                  <td className="px-7 py-2 whitespace-nowrap">
                    <button
                      className="inline-flex mt-1 px-4 py-2 text-sm font-medium font-login text-white bg-darkgray rounded-md hover:bg-white hover:text-darkgray outline"
                      onClick={() => handleEditClick(entry, qualityIndex)}
                    >
                      Edit
                    </button>
                    <button
                      className="inline-flex mt-1 ml-3 px-4 py-2 text-sm font-medium font-login text-white bg-red-700 rounded-md hover:bg-white hover:text-darkgray hover:outline outline-red-800"
                      onClick={() => handleDeleteClick(entry, qualityIndex)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Edit Modal */}
        {showEditModal && (
          <div className="flex flex-col items-center mt-8">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md border-2">
              <h2 className="text-xl mb-4 font-semibold text-gray-700 font-login">Edit Entry</h2>
              <form className="flex flex-col items-center">
                <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-3 shadow-sm shadow-darkgray">
                  <label className="block text-lg font-login ml-4 mt-4 text-gray-700">
                    Party Name <span className="text-red-600 ml-1">*</span>
                    <input
                      className="block w-[300px] mt-2 p-2 border rounded mb-4 cursor-not-allowed"
                      name="partyName"
                      value={selectedEntry.partyName || ''}
                      readOnly
                    />
                  </label>
                </div>

                <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-3 shadow-sm shadow-darkgray">
                  <label className="block text-lg font-login ml-4 mt-4 text-gray-700">
                    Challan No. <span className="text-red-600 ml-1">*</span>
                    <input
                      className="block w-[300px] mt-2 p-2 border-2 rounded mb-4"
                      name="challanNumber"
                      value={selectedEntry.challanNumber || ''}
                      onChange={handleChange}
                    />
                  </label>
                </div>

                <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-3 shadow-sm shadow-darkgray">
                  <label className="block text-lg font-login ml-4 mt-4 text-gray-700">
                    Quality<span className="text-red-600 ml-1">*</span>
                    <input
                      className="block w-[300px] mt-2 p-2 border-2 rounded mb-4 cursor-not-allowed"
                      name="quality"
                      value={selectedEntry.quality || ''}
                      readOnly
                    />
                  </label>
                </div>

                <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-3 shadow-sm shadow-darkgray">
                  <label className="block text-lg font-login ml-4 mt-4 text-gray-700">
                    KG<span className="text-red-600 ml-1">*</span>
                    <input
                      className="block w-[300px] mt-2 p-2 border-2 rounded mb-4"
                      name="kg"
                      value={selectedEntry.kg || ''}
                      onChange={handleChange}
                    />
                  </label>
                </div>

                <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-3 shadow-sm shadow-darkgray">
                  <label className="block text-lg font-login ml-4 mt-4 text-gray-700">
                    Meter<span className="text-red-600 ml-1">*</span>
                    <input
                      className="block w-[300px] mt-2 p-2 border-2 rounded mb-4"
                      name="meter"
                      value={selectedEntry.meter || ''}
                      onChange={handleChange}
                    />
                  </label>
                </div>

                <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-3 shadow-sm shadow-darkgray">
                  <label className="block text-lg font-login ml-4 mt-4 text-gray-700">
                    Rolls<span className="text-red-600 ml-1">*</span>
                    <input
                      className="block w-[300px] mt-2 p-2 border-2 rounded mb-4"
                      name="rolls"
                      value={selectedEntry.rolls || ''}
                      onChange={handleChange}
                    />
                  </label>
                </div>
                <div className="mt-6 flex space-x-12">
                  <button
                    type="button"
                    className="inline-flex mt-4 px-8 py-2 text-sm font-medium text-white bg-darkgray rounded-md hover:bg-white hover:text-darkgray outline "
                    onClick={handleEditConfirm}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="inline-flex mt-4 px-8 py-2 text-sm font-medium text-white bg-darkgray rounded-md hover:bg-white hover:text-darkgray outline"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl mb-4 font-semibold text-gray-700 font-login">Confirm Delete</h2>
              <p className="font-login font-semibold">Are you sure you want to delete this entry?</p>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  className="mr-2 px-4 py-2 text-sm font-medium font-login text-white bg-red-700 rounded-md hover:bg-white hover:text-darkgray hover:outline outline-red-800 hover:font-semibold"
                  onClick={handleDeleteConfirm}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mr-2 font-login px-4 py-2 text-sm font-medium text-white bg-darkgray rounded-md hover:bg-white hover:text-darkgray outline hover:font-semibold"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default EntryTable;
