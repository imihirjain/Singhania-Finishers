import React, { useState, useEffect } from "react";
import axios from "axios";

function AccountStockOutTable() {
  const [submittedData, setSubmittedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchSubmittedData();
  }, []);

  const fetchSubmittedData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/entryOut", {
        withCredentials: true,
      });
      const sortedData = response.data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setSubmittedData(sortedData);
    } catch (error) {
      console.error("Error fetching submitted data:", error);
    }
  };

  const handleEditClick = (entry) => {
    setSelectedEntry(entry);
    setShowEditModal(true);
  };

  const handleDeleteClick = (entry) => {
    setSelectedEntry(entry);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:4000/api/entryOut/${selectedEntry._id}`);
      fetchSubmittedData();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  const handleEditConfirm = async () => {
    try {
      const updatedEntry = {
        ...selectedEntry,
        kg: selectedEntry.kg,
        meter: selectedEntry.meter,
        roll: selectedEntry.roll,
      };

      await axios.put(`http://localhost:4000/api/entryOut/${selectedEntry._id}`, updatedEntry);
      fetchSubmittedData();
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating entry:", error.response ? error.response.data : error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedEntry({ ...selectedEntry, [name]: value });
  };

  const groupEntries = (data) => {
    const groupedData = {};
    data.forEach((item) => {
      const key = `${item.lotNumber}-${item.party}-${item.quality}`;
      if (!groupedData[key]) {
        groupedData[key] = [];
      }
      groupedData[key].push(item);
    });
    return groupedData;
  };

  const handleSearch = () => {
    const filteredData = submittedData.filter(
      (item) =>
        (item.party && item.party.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.qualityChallanNumber && item.qualityChallanNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.lotNumber && item.lotNumber.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    return filteredData;
  };

  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Date(dateTimeString).toLocaleString("en-US", options);
  };

  const groupedData = groupEntries(handleSearch());

  return (
    <div className="flex flex-col items-center">
      <div className="w-full mt-6 bg-white border-nav border-2 rounded-lg">
        <div className="flex ml-4 mt-4 justify-between items-center">
          <div className="text-title font-bold">
            Account Stock Out Table <br /> Total: {submittedData.length}
          </div>

          <div className="flex items-center bg-backgrnd justify-center mr-6 h-[35px] overflow-hidden rounded-full">
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
              placeholder="Search..."
              className="mb-4 mt-3 w-[250px] bg-backgrnd placeholder:text-center border border-none placeholder:font-login placeholder:text-[14px] placeholder:bg-backgrnd placeholder:text-total font-medium"
            />
          </div>
        </div>

        {Object.keys(groupedData).length === 0 ? (
          <div className="text-center">
            <p className="text-gray-800 font-semibold text-lg" style={{ color: "#4A90E2" }}>
              Sorry, no data available at the moment.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y mt-6 divide-gray-200 border overflow-hidden">
              <thead className="bg-header text-header-font font-header">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                    Lot Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                    Party Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                    Quality
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                    Challan Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                    Kg
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                    Meter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                    Roll
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                    Date & Time
                  </th>
                  <th className="px-12 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-login font-header text-[16px] font-medium divide-gray-200">
                {Object.entries(groupedData).map(([key, value], index) => (
                  <React.Fragment key={index}>
                    {value.map((item, idx) => (
                      <tr key={idx}>
                        {idx === 0 && (
                          <>
                            <td rowSpan={value.length} className="px-6 py-4 whitespace-nowrap">
                              {item.lotNumber || "N/A"}
                            </td>
                            <td rowSpan={value.length} className="px-6 py-4 whitespace-nowrap">
                              {item.party || "N/A"}
                            </td>
                            <td rowSpan={value.length} className="px-6 py-4 whitespace-nowrap">
                              {item.quality || "N/A"}
                            </td>
                          </>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.qualityChallanNumber || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.kg || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.meter || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.roll || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatDateTime(item.createdAt) || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            className="inline-flex mt-1 px-4 py-2 text-sm font-medium font-login text-white bg-darkgray rounded-md hover:bg-white hover:text-darkgray outline"
                            onClick={() => handleEditClick(item)}
                          >
                            Edit
                          </button>
                          <button
                            className="inline-flex mt-1 ml-3 px-4 py-2 text-sm font-medium font-login text-white bg-red-700 rounded-md hover:bg-white hover:text-darkgray hover:outline outline-red-800"
                            onClick={() => handleDeleteClick(item)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <div className="flex flex-col items-center mt-8">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md border-2">
              <h2 className="text-xl mb-4 font-semibold text-gray-700 font-login">Edit Entry</h2>
              <form className="flex flex-col items-center">
                <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-3 shadow-sm shadow-darkgray">
                  <label className="block text-lg font-login ml-4 mt-4 text-gray-700">
                    Party Name<span className="text-red-600 ml-1">*</span>
                    <input
                      className="block w-[300px] mt-2 p-2 border-2 rounded mb-4 cursor-not-allowed"
                      name="party"
                      value={selectedEntry?.party || ''}
                      readOnly
                    />
                  </label>
                </div>
                <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-3 shadow-sm shadow-darkgray">
                <label className="block text-lg font-login ml-4 mt-4 text-gray-700">
                  Challan No.<span className="text-red-600 ml-1">*</span>
                  <input
                    className="block w-[300px] mt-2 p-2 border-2 rounded mb-4 cursor-not-allowed"
                    name="qualityChallanNumber"
                    value={selectedEntry?.qualityChallanNumber || ''}
                    readOnly
                  />
                </label>
                </div>
                <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-3 shadow-sm shadow-darkgray">
                <label className="block text-lg font-login ml-4 mt-4 text-gray-700">
                  Lot Number<span className="text-red-600 ml-1">*</span>
                  <input
                    className="block w-[300px] mt-2 p-2 border-2 rounded mb-4 cursor-not-allowed"
                    name="lotNumber"
                    value={selectedEntry?.lotNumber || ''}
                    readOnly
                  />
                </label>
                </div>
                <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-3 shadow-sm shadow-darkgray">
                <label className="block text-lg font-login ml-4 mt-4 text-gray-700">
                  Quality<span className="text-red-600 ml-1">*</span>
                  <input
                    className="block w-[300px] mt-2 p-2 border-2 rounded mb-4 cursor-not-allowed"
                    name="quality"
                    value={selectedEntry?.quality || ''}
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
                    value={selectedEntry?.kg || ''}
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
                    value={selectedEntry?.meter || ''}
                    onChange={handleChange}
                  />
                </label>
                </div>
                <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-3 shadow-sm shadow-darkgray">
                <label className="block text-lg font-login ml-4 mt-4 text-gray-700">
                  Roll<span className="text-red-600 ml-1">*</span>
                  <input
                    className="block w-[300px] mt-2 p-2 border-2 rounded mb-4"
                    name="roll"
                    value={selectedEntry?.roll || ''}
                    onChange={handleChange}
                  />
                </label>
                </div>
                
                <div className="mt-6 flex space-x-12">
                  <button
                    type="button"
                    className="inline-flex mt-4 px-8 py-2 text-sm font-medium text-white bg-darkgray rounded-md hover:bg-white hover:text-darkgray outline"
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
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4 overflow-auto max-h-full">
              <h2 className="text-xl mb-4 font-semibold text-gray-700">Confirm Delete</h2>
              <p>Are you sure you want to delete this entry?</p>
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
  );
}

export default AccountStockOutTable;
