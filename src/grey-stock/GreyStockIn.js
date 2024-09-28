import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import GenerateLot from "../grey-stock/GenerateLot";
import GreyInputField from "../grey-stock/GreyInputField";
import GreyPreviewTable from "../grey-stock/GreyPreviewTable";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LotManagement = () => {
  const [formData, setFormData] = useState({
    partyName: "",
    quality: "",
    challanNumber: "",
    kg: "",
    meter: "",
    roll: "",
  });

  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [lotNumber, setLotNumber] = useState("");
  const [tableData, setTableData] = useState([]);
  const [partyName, setPartyName] = useState(null);
  const [quality, setQuality] = useState(null);
  const [challanNumber, setChallanNumber] = useState(null);
  const [shade, setShade] = useState("");
  const [initialShade, setInitialShade] = useState(""); // New state for initial shade value
  const [kg, setKg] = useState("");
  const [meter, setMeter] = useState("");
  const [roll, setRoll] = useState("");
  const [processType, setProcessType] = useState("Full");
  const [lots, setLots] = useState([]);
  const [status, setStatus] = useState("heat");
  const [parties, setParties] = useState([]);
  const [qualities, setQualities] = useState([]);
  const [challanNumbers, setChallanNumbers] = useState([]);
  const [isEditable, setIsEditable] = useState(true);
  const [isShadeEditable, setIsShadeEditable] = useState(true); // New state for shade editability
  const [isProcessTypeEditable, setIsProcessTypeEditable] = useState(true); // New state for processType editability

  useEffect(() => {
    fetchLotsByStatus(status);
    fetchParties();
  }, [status]);

  useEffect(() => {
    if (partyName) {
      fetchQualities(partyName.value);
    } else {
      setQualities([]);
      setQuality(null);
      setChallanNumbers([]);
      setChallanNumber(null);
    }
  }, [partyName]);

  useEffect(() => {
    if (partyName && quality) {
      fetchChallanNumbers(partyName.value, quality.value);
    } else {
      setChallanNumbers([]);
      setChallanNumber(null);
    }
  }, [quality]);

  const fetchLotsByStatus = async (status) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/lots/status/${status}`
      );
      setLots(response.data);
    } catch (error) {
      console.error("Error fetching lots:", error);
    }
  };

  const fetchParties = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/parties");
      setParties(
        response.data.map((party) => ({
          value: party.partyName,
          label: party.partyName,
        }))
      );
    } catch (error) {
      console.error("Error fetching parties:", error);
    }
  };

  const fetchQualities = async (selectedParty) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/parties/${selectedParty}/qualities`
      );
      if (response.data && Array.isArray(response.data.qualities)) {
        setQualities(
          response.data.qualities.map((quality) => ({
            value: quality,
            label: quality,
          }))
        );
      } else {
        console.error("Qualities response is not as expected:", response.data);
      }
    } catch (error) {
      console.error("Error fetching qualities:", error);
    }
  };

  const fetchChallanNumbers = async (partyName, quality) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/parties/${partyName}/qualities/${quality}/challans`
      );
      if (Array.isArray(response.data)) {
        setChallanNumbers(
          response.data.map((challan) => ({ value: challan, label: challan }))
        );
      } else {
        console.error(
          "Challan numbers response is not an array:",
          response.data
        );
      }
    } catch (error) {
      console.error("Error fetching challan numbers:", error);
    }
  };

  const handleAdd = () => {
    if (
      !partyName ||
      !quality ||
      !challanNumber ||
      !kg ||
      !meter ||
      !roll ||
      !shade ||
      !processType
    ) {
      toast.error("Please fill all mandatory fields.");
      return;
    }

    const currentDateTime = new Date().toISOString(); // Store date and time in ISO format

    const newEntry = {
      lotNumber,
      partyName: partyName ? partyName.label : "",
      quality: quality ? quality.label : "",
      challanNumber: challanNumber ? challanNumber.label : "",
      kg,
      meter,
      roll,
      shade,
      processType,
      dateTime: currentDateTime,
    };

    if (isEditMode && selectedEntry) {
      // Update existing entry
      const updatedTableData = tableData.map((entry) =>
        entry.challanNumber === selectedEntry.challanNumber ? newEntry : entry
      );
      setTableData(updatedTableData);
      setIsEditMode(false);
      setSelectedEntry(null);
    } else {
      // Add new entry
      setTableData([...tableData, newEntry]);
      if (tableData.length === 0) {
        setInitialShade(shade); // Set the initial shade value
      }
    }

    setIsEditable(false); // Make fields non-editable
    setIsShadeEditable(false); // Make shade field non-editable
    setIsProcessTypeEditable(false); // Make process type field non-editable

    setChallanNumber(null);
    setKg("");
    setMeter("");
    setRoll("");
    // Preserve the shade and process type values

    toast.success("Data Added Successfully");
  };

  const handleEdit = (entry) => {
    setPartyName({ value: entry.partyName, label: entry.partyName });
    setQuality({ value: entry.quality, label: entry.quality });
    setChallanNumber({
      value: entry.challanNumber,
      label: entry.challanNumber,
    });
    setKg(entry.kg);
    setMeter(entry.meter);
    setRoll(entry.roll);
    setShade(entry.shade); // Ensure shade is updated correctly
    setProcessType(entry.processType);

    setSelectedEntry(entry);
    setIsEditMode(true);
    setIsEditable(true);
    setIsShadeEditable(true); // Make shade field editable in edit mode
    setIsProcessTypeEditable(true); // Make process type field editable in edit mode
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        lotNumber, // Include the lot number in the payload
        entries: tableData.map((entry) => ({
          partyName: entry.partyName,
          quality: entry.quality, // Ensure quality is included
          challanNumber: entry.challanNumber,
          shade: entry.shade,
          kg: entry.kg,
          meter: entry.meter,
          roll: entry.roll,
          processType: entry.processType,
          dateTime: entry.dateTime,
          status: entry.status || processType.toLowerCase(),
        })),
      };

      const response = await axios.post("http://localhost:4000/api/lots", payload);
      console.log("Response for new lot submission:", response.data);

      setTableData([]);
      setPartyName(null);
      setQuality(null);
      setChallanNumber(null);
      setInitialShade(""); // Clear initial shade
      setKg("");
      setMeter("");
      setRoll("");
      setProcessType("Full");
      fetchLotsByStatus(status);
      setIsEditable(true);
      setIsShadeEditable(true); // Make shade field editable after submission
      setIsProcessTypeEditable(true); // Make process type field editable after submission
      toast.success("Lot submitted successfully!");
    } catch (error) {
      console.error("Error creating lot:", error);
      if (error.response) {
        console.error("Server response:", error.response.data);
      }
      toast.error("Error submitting lot.");
    }
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  const handleMarkComplete = async (lotId) => {
    try {
      await axios.post("http://localhost:4000/api/lots/status", {
        lotId,
        status: "complete",
      });
      fetchLotsByStatus(status);
    } catch (error) {
      console.error("Error updating lot status:", error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <ToastContainer position="top-center" />
      <div className="border-2 w-full sm:w-[500px] rounded-lg h-[170px] lg:h-[150px] overflow-hidden">
        <div className="mt-4 ml-4 font-semibold">Grey - Stock IN</div>
        <div className="bg-black w-full h-[1px] mt-4"></div>
        <div className="font-login mt-3 flex lg:flex-row flex-col">
          <span className="text-blue-700 ml-4 text-xs font-login">
            jainmanav180@gmail.com
          </span>
          <span className="text-red-500 lg:ml-14 ml-4 font-login text-sm">
            Change Account
          </span>
        </div>
        <div className="bg-darkgray h-3 mt-2"></div>
      </div>
      <form className="flex flex-col sm:w-[500px] w-full items-center" onSubmit={handleSubmit}>
        <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-6 shadow-sm shadow-darkgray">
          <label className="block text-lg font-login ml-4 mt-4 text-gray-700">
            Lot Number <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={lotNumber}
            onChange={(e) => setLotNumber(e.target.value)}
            className="ml-4 mt-4 mb-4 w-[90%] rounded-md"
            placeholder="Enter Lot Number"
          />
        </div>

        <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-6 shadow-sm shadow-darkgray">
          <label className="block text-lg font-login ml-4 mt-4 text-gray-700">
            Party Name<span className="text-red-600 ml-1">*</span>
          </label>
          <Select
            value={partyName}
            onChange={setPartyName}
            options={parties}
            className="ml-4 mt-4 mb-4 w-[90%] sm:w-auto rounded-md"
            placeholder="Select Party Name"
            isDisabled={!isEditable}
          />
        </div>

        <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-6 shadow-sm shadow-darkgray">
          <label className="block text-lg font-login ml-4 mt-4 text-gray-700">
            Quality <span className="text-red-600">*</span>
          </label>
          <Select
            value={quality}
            onChange={setQuality}
            options={qualities}
            className="ml-4 mt-4 mb-4 w-[90%] sm:w-auto rounded-md"
            placeholder="Select Quality"
            isDisabled={!isEditable}
          />
        </div>
        <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-6 shadow-sm shadow-darkgray">
          <label className="block text-lg font-login ml-4 mt-4 text-gray-700">
            Challan Number <span className="text-red-600">*</span>
          </label>
          <Select
            value={challanNumber}
            onChange={setChallanNumber}
            options={challanNumbers}
            className="ml-4 mt-4 mb-4 w-[90%] sm:w-auto rounded-md"
            placeholder="Select Challan Number"
          />
        </div>

        <GreyInputField
          text="KG"
          value={kg}
          onChange={(e) => setKg(e.target.value)}
        />

        <GreyInputField
          text="Meter"
          value={meter}
          onChange={(e) => setMeter(e.target.value)}
        />

        <GreyInputField
          text="Roll"
          value={roll}
          onChange={(e) => setRoll(e.target.value)}
        />

        <GreyInputField
          text="Shade"
          value={shade} // Directly use shade state value
          onChange={(e) => setShade(e.target.value)}
          isDisabled={!isShadeEditable} // Make shade field non-editable when not in edit mode
        />

        <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-6 shadow-sm shadow-darkgray">
          <label className="block text-lg font-login ml-4 mt-4 text-gray-700">
            Process Type <span className="text-red-600">*</span>
          </label>
          <select
            value={processType}
            onChange={(e) => setProcessType(e.target.value)}
            className="ml-4 mt-4 mb-4 w-[90%] rounded-md focus:ring-darkgray border-1 focus:border-darkgray"
            disabled={!isProcessTypeEditable}
          >
            <option value="Full">Full Process</option>
            <option value="Half">Half Process</option>
            <option value="Finish">Finish Process</option>
          </select>
        </div>

        <div className="flex flex-row space-x-[200px] lg:justify-center">
          <button
            type="button"
            className="inline-flex mt-6 justify-center px-4 py-2 text-sm font-medium text-white bg-darkgray rounded-md hover:bg-white hover:text-darkgray outline"
            onClick={handleAdd}
          >
            {isEditMode ? "Update" : "Add"}
          </button>

          <button
            type="button"
            className="inline-flex mt-6 justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-white hover:text-darkgray outline"
            onClick={() => setIsEditMode(!isEditMode)}
          >
            {isEditMode ? "Cancel Edit" : "Edit"}
          </button>
        </div>

        <GreyPreviewTable
          data={tableData}
          isEditMode={isEditMode}
          onEdit={handleEdit}
        />

        <button
          type="submit"
          className="inline-flex mt-4 px-12 py-2 text-sm font-medium text-white bg-darkgray rounded-md hover:bg-white hover:text-darkgray outline"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default LotManagement;
