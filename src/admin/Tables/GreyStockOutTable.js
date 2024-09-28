import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

const processes = [
  { value: "process1", status: "status1" },
  { value: "process2", status: "status2" },
  { value: "process3", status: "status3" },
];

const colors = [
  { value: "red", label: "Red" },
  { value: "green", label: "Green" },
  { value: "yellow", label: "Yellow" },
  { value: "blue", label: "Blue" },
  { value: "", label: "No Color" }, // Added No Color option
];

const colorClasses = {
  red: "bg-red-600",
  green: "bg-green-600",
  yellow: "bg-yellow-500",
  blue: "bg-blue-600",
};

function GreyStockOutTable() {
  const [submittedData, setSubmittedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingLotId, setEditingLotId] = useState(null);
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    lotNumber: "",
    partyName: "",
    quality: "",
    challanNumber: "",
    shade: "",
    process: "",
    status: "",
    kg: "",
    meter: "",
    roll: "",
  });
  const [deletingLotId, setDeletingLotId] = useState(null);
  const [selectedPartyNames, setSelectedPartyNames] = useState([]);
  const [selectedQualities, setSelectedQualities] = useState([]);
  const [selectedLotNumbers, setSelectedLotNumbers] = useState([]);
  const [uniquePartyNames, setUniquePartyNames] = useState([]);
  const [uniqueQualities, setUniqueQualities] = useState([]);
  const [uniqueLotNumbers, setUniqueLotNumbers] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  const [coloredRows, setColoredRows] = useState({});
  const [showColoredRows, setShowColoredRows] = useState(false);
  const [sortColorOrder, setSortColorOrder] = useState("");

  useEffect(() => {
    fetchSubmittedData();
  }, []);

  useEffect(() => {
    const uniqueParties = [
      ...new Set(submittedData.map((item) => item.partyName)),
    ];
    const uniqueLots = [...new Set(submittedData.map((item) => item.lotNumber))];
    setUniquePartyNames(uniqueParties);
    setUniqueLotNumbers(uniqueLots);
  }, [submittedData]);

  useEffect(() => {
    const filteredQualities = selectedPartyNames.length
      ? [
          ...new Set(
            submittedData
              .filter((item) => selectedPartyNames.includes(item.partyName))
              .map((item) => item.quality)
          ),
        ]
      : [...new Set(submittedData.map((item) => item.quality))];
    setUniqueQualities(filteredQualities);
  }, [submittedData, selectedPartyNames]);

  const fetchSubmittedData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/lots", {
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

  const handleSearch = () => {
    let filteredData = submittedData.filter(
      (item) =>
        (!selectedPartyNames.length ||
          selectedPartyNames.includes(item.partyName)) &&
        (!selectedQualities.length || selectedQualities.includes(item.quality)) &&
        (!selectedLotNumbers.length || selectedLotNumbers.includes(item.lotNumber))
    );

    if (showColoredRows) {
      filteredData = filteredData.filter((lot) =>
        lot.entries.some((entry) => coloredRows[entry._id])
      );
    }

    if (sortOrder) {
      filteredData.sort((a, b) => {
        if (sortOrder === "asc") {
          return a.partyName.localeCompare(b.partyName);
        } else if (sortOrder === "desc") {
          return b.partyName.localeCompare(a.partyName);
        }
        return 0;
      });
    }

    if (sortColorOrder) {
      filteredData = filteredData.filter((lot) =>
        lot.entries.some((entry) => coloredRows[entry._id] === sortColorOrder)
      );
    }

    return filteredData.filter(
      (item) =>
        item.partyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.lotNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.entries.some((entry) =>
          entry.challanNumber.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
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

  const groupByAttributes = (data) => {
    const grouped = data.reduce((acc, lot) => {
      const key = `${lot.lotNumber}-${lot.partyName}-${lot.quality}-${lot.shade}-${lot.processType}-${lot.status}`;
      if (!acc[key]) {
        acc[key] = { ...lot, entries: [] };
      }
      acc[key].entries = [...acc[key].entries, ...lot.entries];
      return acc;
    }, {});
    return Object.values(grouped);
  };

  const handleEditClick = (lotId, entry) => {
    setEditingLotId(lotId);
    setEditingEntryId(entry._id);
    const lot = submittedData.find((lot) => lot._id === lotId);
    setEditFormData({
      lotNumber: lot.lotNumber,
      partyName: lot.partyName,
      quality: lot.quality,
      challanNumber: entry.challanNumber,
      shade: lot.shade,
      process: lot.processType,
      status: lot.status,
      kg: entry.kg,
      meter: entry.meter,
      roll: entry.roll,
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "process") {
      const selectedProcess = processes.find((proc) => proc.value === value);
      setEditFormData((prevData) => ({
        ...prevData,
        [name]: value,
        status: selectedProcess.status,
      }));
    } else {
      setEditFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();

    const { challanNumber, kg, meter, roll, shade } = editFormData;
    if (
      !challanNumber ||
      !kg ||
      !meter ||
      !roll ||
      isNaN(kg) ||
      isNaN(meter) ||
      isNaN(roll)
    ) {
      alert("Please fill all fields correctly.");
      return;
    }

    try {
      const lot = submittedData.find((lot) => lot._id === editingLotId);
      const updatedEntries = lot.entries.map((entry) =>
        entry._id === editingEntryId
          ? {
              ...entry,
              challanNumber,
              kg: Number(kg),
              meter: Number(meter),
              roll: Number(roll),
            }
          : entry
      );
      const response = await axios.put(
        `http://localhost:4000/api/lots/${editingLotId}`,
        { ...lot, entries: updatedEntries, shade },
        {
          withCredentials: true,
        }
      );
      setEditingLotId(null);
      setEditingEntryId(null);
      const updatedData = submittedData.map((lot) =>
        lot._id === editingLotId
          ? { ...lot, entries: updatedEntries, shade }
          : lot
      );
      setSubmittedData(updatedData);
    } catch (error) {
      console.error(
        "Error updating entry:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleDeleteClick = (lotId) => {
    setDeletingLotId(lotId);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/lots/${deletingLotId}`,
        {
          withCredentials: true,
        }
      );
      const updatedData = submittedData.filter(
        (lot) => lot._id !== deletingLotId
      );
      setSubmittedData(updatedData);
      setDeletingLotId(null);
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  const cancelDelete = () => {
    setDeletingLotId(null);
  };

  const handleRowColorToggle = (entryId, color) => {
    setColoredRows((prev) => {
      const newColoredRows = { ...prev };
      if (color) {
        newColoredRows[entryId] = color;
      } else {
        delete newColoredRows[entryId];
      }
      return newColoredRows;
    });
  };

  const calculateTotalKg = (data) => {
    return data.reduce((totalKg, lot) => {
      return (
        totalKg +
        lot.entries.reduce((sum, entry) => {
          return sum + entry.kg;
        }, 0)
      );
    }, 0);
  };

  const calculateTotalMeter = (data) => {
    return data.reduce((totalMeter, lot) => {
      return (
        totalMeter +
        lot.entries.reduce((sum, entry) => {
          return sum + entry.meter;
        }, 0)
      );
    }, 0);
  };

  const calculateTotalRoll = (data) => {
    return data.reduce((totalRoll, lot) => {
      return (
        totalRoll +
        lot.entries.reduce((sum, entry) => {
          return sum + entry.roll;
        }, 0)
      );
    }, 0);
  };

  const filteredData = groupByAttributes(handleSearch());

  const handleSelectChange = (setState) => (selectedOptions) => {
    const values = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setState(values);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full mt-6 bg-white border-nav border-2 rounded-lg">
        <div className="flex flex-col lg:flex lg:flex-row ml-4 mt-4 lg:justify-between">
          <div className="text-title font-bold">
            Grey Stock Out Table <br /> Total:{" "}
            {filteredData.reduce((total, lot) => total + lot.entries.length, 0)}
            <br /> Total KG: {calculateTotalKg(filteredData)}
            <br /> Total Meter: {calculateTotalMeter(filteredData)}
            <br /> Total Roll: {calculateTotalRoll(filteredData)}
          </div>

          <div className="flex mt-3 items-center bg-backgrnd justify-center mr-6 h-[35px] overflow-hidden rounded-full">
            <div>
              <img
                className="h-[24px] w-[24px] ml-5"
                src={require("../../assets/stockinSearch.png")}
                alt="Inventory Management System"
              />
            </div>
            <div className="h-[25px] ml-6 border-total border-[1px]"></div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Party Name..."
              className="mb-4 mt-3 w-[250px] bg-backgrnd placeholder:text-center border border-none placeholder:font-login placeholder:text-[14px] placeholder:bg-backgrnd placeholder:text-total font-medium"
            />
          </div>
        </div>

        <div className="flex justify-between items-center p-4">
          <div>
            <label htmlFor="partyNameFilter" className="mr-2">
              Party Name:
            </label>
            <Select
              id="partyNameFilter"
              isMulti
              options={uniquePartyNames.map((partyName) => ({
                value: partyName,
                label: partyName,
              }))}
              value={uniquePartyNames
                .filter((partyName) => selectedPartyNames.includes(partyName))
                .map((partyName) => ({ value: partyName, label: partyName }))}
              onChange={handleSelectChange(setSelectedPartyNames)}
              className="w-40 mt-2"
            />
          </div>

          <div>
            <label htmlFor="qualityFilter" className="mr-2">
              Quality:
            </label>
            <Select
              id="qualityFilter"
              isMulti
              options={uniqueQualities.map((quality) => ({
                value: quality,
                label: quality,
              }))}
              value={uniqueQualities
                .filter((quality) => selectedQualities.includes(quality))
                .map((quality) => ({ value: quality, label: quality }))}
              onChange={handleSelectChange(setSelectedQualities)}
              className="w-40 mt-2"
            />
          </div>

          <div>
            <label htmlFor="lotNumberFilter" className="mr-2">
              Lot Number:
            </label>
            <Select
              id="lotNumberFilter"
              isMulti
              options={uniqueLotNumbers.map((lotNumber) => ({
                value: lotNumber,
                label: lotNumber,
              }))}
              value={uniqueLotNumbers
                .filter((lotNumber) => selectedLotNumbers.includes(lotNumber))
                .map((lotNumber) => ({ value: lotNumber, label: lotNumber }))}
              onChange={handleSelectChange(setSelectedLotNumbers)}
              className="w-40 mt-2"
            />
          </div>

          <div>
            <label htmlFor="sortOrder" className="mr-2">
              Sort By Party Name:
            </label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="flex w-40 mt-2 border p-2 rounded"
            >
              <option value="">None</option>
              <option value="asc">A to Z</option>
              <option value="desc">Z to A</option>
            </select>
          </div>

          <div>
            <label htmlFor="sortColorOrder" className="mr-2">
              Sort By Color:
            </label>
            <select
              id="sortColorOrder"
              value={sortColorOrder}
              onChange={(e) => setSortColorOrder(e.target.value)}
              className="flex w-40 mt-2 border p-2 rounded"
            >
              <option value="">None</option>
              {colors
                .filter((color) => color.value)
                .map((color) => (
                  <option key={color.value} value={color.value}>
                    {color.label}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label htmlFor="showColoredRows" className="mr-2">
              Show Colored Rows:
            </label>
            <input
              type="checkbox"
              id="showColoredRows"
              checked={showColoredRows}
              onChange={(e) => setShowColoredRows(e.target.checked)}
              className="border p-2 rounded "
            />
          </div>
        </div>

        {filteredData.length === 0 ? (
          <div className="text-center">
            <p
              className="text-gray-800 font-semibold text-lg"
              style={{ color: "#4A90E2" }}
            >
              Sorry, no data available at the moment.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y mt-6 divide-gray-200 border overflow">
              <thead className="bg-header text-header-font font-header">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                    Date & Time
                  </th>
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
                    Shade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                    Process
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                    Status
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
                    Actions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase">
                    Color
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-login font-header text-[16px] font-medium divide-gray-200">
                {filteredData.map((lot) => (
                  <React.Fragment key={lot._id}>
                    {lot.entries.map((entry, index) => (
                      <tr
                        key={entry._id}
                        className={
                          coloredRows[entry._id]
                            ? colorClasses[coloredRows[entry._id]]
                            : ""
                        }
                      >
                        {index === 0 && (
                          <>
                            <td
                              className="px-6 py-4 whitespace-nowrap"
                              rowSpan={lot.entries.length}
                            >
                              {formatDateTime(lot.createdAt)}
                            </td>
                            <td
                              className="px-6 py-4 whitespace-nowrap"
                              rowSpan={lot.entries.length}
                            >
                              {lot.lotNumber}
                            </td>
                            <td
                              className="px-6 py-4 whitespace-nowrap text-gray-900"
                              rowSpan={lot.entries.length}
                            >
                              {lot.partyName}
                            </td>
                            <td
                              className="px-6 py-4 whitespace-nowrap"
                              rowSpan={lot.entries.length}
                            >
                              {lot.quality}
                            </td>
                            <td
                              className="px-6 py-4 whitespace-nowrap"
                              rowSpan={lot.entries.length}
                            >
                              {lot.shade}
                            </td>
                            <td
                              className="px-6 py-4 whitespace-nowrap"
                              rowSpan={lot.entries.length}
                            >
                              {lot.processType}
                            </td>
                            <td
                              className="px-6 py-4 whitespace-nowrap"
                              rowSpan={lot.entries.length}
                            >
                              {lot.status}
                            </td>
                          </>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {entry.challanNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {entry.kg}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {entry.meter}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {entry.roll}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            className="inline-flex mt-1 px-4 py-2 text-sm font-medium font-login text-white bg-darkgray rounded-md hover:bg-white hover:text-darkgray outline"
                            onClick={() => handleEditClick(lot._id, entry)}
                          >
                            Edit
                          </button>
                          <button
                            className="inline-flex mt-1 ml-3 px-4 py-2 text-sm font-medium font-login text-white bg-red-700 rounded-md hover:bg-white hover:text-darkgray hover:outline outline-red-800"
                            onClick={() => handleDeleteClick(lot._id)}
                          >
                            Delete
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Select
                            options={colors}
                            value={colors.find(
                              (color) => color.value === coloredRows[entry._id]
                            )}
                            onChange={(selectedOption) =>
                              handleRowColorToggle(
                                entry._id,
                                selectedOption ? selectedOption.value : null
                              )
                            }
                            className="w-40 mt-2"
                          />
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {editingLotId && (
        <div className="flex flex-col items-center mt-8">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md border-2">
            <h2 className="text-xl mb-4 font-semibold text-gray-700 font-login">
              Edit Entry
            </h2>
            <form
              className="flex flex-col items-center"
              onSubmit={handleEditFormSubmit}
            >
              <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-3 shadow-sm shadow-darkgray">
                <label className="block text-lg font-login ml-4 mt-4 text-gray-700">
                  Lot Number<span className="text-red-600 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="lotNumber"
                  value={editFormData.lotNumber}
                  readOnly
                  className="block w-[300px] mt-2 p-2 border-2 rounded mb-4 cursor-not-allowed ml-4"
                />
              </div>
              <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-3 shadow-sm shadow-darkgray">
                <label className="block text-lg font-login ml-4 mt-4 text-gray-700">
                  Party Name<span className="text-red-600 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="partyName"
                  value={editFormData.partyName}
                  readOnly
                  className="block w-[300px] mt-2 p-2 border-2 rounded mb-4 cursor-not-allowed ml-4"
                />
              </div>
              <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-3 shadow-sm shadow-darkgray">
                <label className="block text-lg font-login ml-4 mt-4 text-gray-700">
                  Quality<span className="text-red-600 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="quality"
                  value={editFormData.quality}
                  readOnly
                  className="block w-[300px] mt-2 p-2 border-2 rounded mb-4 cursor-not-allowed ml-4"
                />
              </div>
              <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-3 shadow-sm shadow-darkgray">
                <label className="block text-lg font-login ml-4 mt-4 text-gray-700">
                  Challan Number<span className="text-red-600 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="challanNumber"
                  value={editFormData.challanNumber}
                  readOnly
                  className="block w-[300px] mt-2 p-2 border-2 rounded mb-4 cursor-not-allowed ml-4"
                />
              </div>
              <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-3 shadow-sm shadow-darkgray">
                <label className="block text-lg font-login ml-4 mt-4 text-gray-700">
                  Shade<span className="text-red-600 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="shade"
                  value={editFormData.shade}
                  onChange={handleEditFormChange}
                  className="block w-[300px] mt-2 p-2 border-2 rounded mb-4 ml-4"
                />
              </div>
              <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-3 shadow-sm shadow-darkgray">
                <label className="block text-lg font-login ml-4 mt-4 text-gray-700">
                  Process<span className="text-red-600 ml-1">*</span>
                </label>
                <select
                  name="process"
                  value={editFormData.process}
                  onChange={handleEditFormChange}
                  className="block w-[300px] mt-2 p-2 border-2 rounded mb-4 ml-4"
                >
                  {processes.map((proc) => (
                    <option key={proc.value} value={proc.value}>
                      {proc.value}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-3 shadow-sm shadow-darkgray">
                <label className="block text-lg font-login ml-4 mt-4 text-gray-700">
                  Status<span className="text-red-600 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="status"
                  value={editFormData.status}
                  readOnly
                  className="block w-[300px] mt-2 p-2 border-2 rounded mb-4 cursor-not-allowed ml-4"
                />
              </div>
              <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-3 shadow-sm shadow-darkgray">
                <label className="block text-lg font-login ml-4 mt-4 text-gray-700">
                  Kg<span className="text-red-600 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="kg"
                  value={editFormData.kg}
                  onChange={handleEditFormChange}
                  className="block w-[300px] mt-2 p-2 border-2 rounded mb-4 ml-4"
                />
              </div>
              <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-3 shadow-sm shadow-darkgray">
                <label className="block text-lg font-login ml-4 mt-4 text-gray-700">
                  Meter<span className="text-red-600 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="meter"
                  value={editFormData.meter}
                  onChange={handleEditFormChange}
                  className="block w-[300px] mt-2 p-2 border-2 rounded mb-4 ml-4"
                />
              </div>
              <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-3 shadow-sm shadow-darkgray">
                <label className="block text-lg font-login ml-4 mt-4 text-gray-700">
                  Roll<span className="text-red-600 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="roll"
                  value={editFormData.roll}
                  onChange={handleEditFormChange}
                  className="block w-[300px] mt-2 p-2 border-2 rounded mb-4 ml-4"
                />
              </div>
              <div className="mt-6 flex space-x-12">
                <button
                  type="submit"
                  className="inline-flex mt-4 px-8 py-2 text-sm font-medium text-white bg-darkgray rounded-md hover:bg-white hover:text-darkgray outline"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="inline-flex mt-4 px-8 py-2 text-sm font-medium text-white bg-darkgray rounded-md hover:bg-white hover:text-darkgray outline"
                  onClick={() => {
                    setEditingLotId(null);
                    setEditingEntryId(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deletingLotId && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4 overflow-auto max-h-full">
            <h2 className="text-xl mb-4 font-semibold text-gray-700">
              Confirm Delete
            </h2>
            <p>Are you sure you want to delete this entry?</p>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="mr-2 px-4 py-2 text-sm font-medium font-login text-white bg-red-700 rounded-md hover:bg-white hover:text-darkgray hover:outline outline-red-800 hover:font-semibold"
                onClick={confirmDelete}
              >
                Delete
              </button>
              <button
                type="button"
                className="mr-2 font-login px-4 py-2 text-sm font-medium text-white bg-darkgray rounded-md hover:bg-white hover:text-darkgray outline hover:font-semibold"
                onClick={cancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GreyStockOutTable;
