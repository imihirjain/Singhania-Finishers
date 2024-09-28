import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Party from "../components/Party";
import Quality from "../components/Quality";
import InputField from "../components/InputField";
import Table from "../components/Table";

const AccountEntries = () => {
  const [formData, setFormData] = useState({
    partyName: "",
    quality: "",
    challanNumber: "",
    kg: "",
    meter: "",
    roll: "",
  });

  const [tableData, setTableData] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [parties, setParties] = useState([]);
  const [isPartyFixed, setIsPartyFixed] = useState(false);
  const [isChallanFixed, setIsChallanFixed] = useState(false);

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/party");
        setParties(response.data);
      } catch (error) {
        console.error("Error fetching parties:", error);
      }
    };

    fetchParties();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddData = () => {
    if (
      formData.partyName &&
      formData.quality &&
      formData.challanNumber &&
      formData.kg &&
      formData.meter &&
      formData.roll
    ) {
      const currentDate = new Date();
      const party = parties.find((party) => party._id === formData.partyName);
      const newData = {
        ...formData,
        partyName: party ? party.name : formData.partyName, // Convert party ID to party name
        date: currentDate.toLocaleDateString("en-US"),
        time: currentDate.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
      };
      console.log("Adding data:", newData);
      const existingEntryIndex = tableData.findIndex(
        (entry) => entry.quality === formData.quality
      );

      if (existingEntryIndex !== -1) {
        // Update existing entry with same quality
        const updatedData = tableData.map((entry, index) =>
          index === existingEntryIndex ? newData : entry
        );
        setTableData(updatedData);
        toast.success("Data updated successfully!");
      } else if (selectedEntry) {
        // Update existing entry
        const updatedData = tableData.map((entry) =>
          entry === selectedEntry ? newData : entry
        );
        setTableData(updatedData);
        toast.success("Data updated successfully!");
        setSelectedEntry(null); // Clear selected entry
      } else {
        // Add new entry
        setTableData([...tableData, newData]);
        toast.success("Data added successfully!");

        if (tableData.length === 0) {
          setIsPartyFixed(true);
          setIsChallanFixed(true);
        }
      }
      setIsPartyFixed(true);
      // Clear form data except for partyName and challanNumber
      setFormData({
        ...formData,
        quality: "",
        kg: "",
        meter: "",
        roll: "",
      });
    } else {
      toast.error("All fields are required");
    }
  };

  const handleSubmit = async () => {
    if (tableData.length > 0) {
      try {
        console.log("Submitting data:", tableData);
        await axios.post("http://localhost:4000/api/entries", {
          entries: tableData,
        });
        toast.success("Data submitted successfully!");
        setTableData([]); // Clear table data after submission
        // Allow changing party name and challan number after submission
        setFormData({
          partyName: "",
          quality: "",
          challanNumber: "",
          kg: "",
          meter: "",
          roll: "",
        });
        setIsPartyFixed(false); // Enable party name field
        setIsChallanFixed(false); // Enable challan number field
      } catch (error) {
        toast.error("Error submitting data");
        console.error("Error submitting data:", error);
      }
    } else {
      toast.error("No data to submit");
    }
  };

  const handleEdit = (entry) => {
    const party = parties.find((party) => party.name === entry.partyName);
    setFormData({
      ...entry,
      partyName: party ? party._id : entry.partyName, // Set partyName to party's _id
    });
    setSelectedEntry(entry);
    setIsEditMode(true); // Enter edit mode
  };

  return (
    <>
      <ToastContainer position="top-center" />
      <div className="flex flex-col items-center mt-8">
        <div className="border-2 w-full sm:w-[500px] rounded-lg h-[150px] overflow-hidden">
          <div className="mt-4 ml-4 font-semibold">Account - Stock IN</div>
          <div className="bg-black w-full h-[1px] mt-4"></div>
          <div className="font-login mt-3 flex lg:flex-row flex-col">
            <span className="text-blue-700 ml-4 text-xs font-login">
              jainmanav180@gmail.com
            </span>
            <span className=" text-red-500 lg:ml-14 ml-4 font-login text-sm">
              Change Account
            </span>
          </div>
          <div className="bg-darkgray h-4 mt-2"></div>
        </div>

        <Party
          text="Party Name"
          value={formData.partyName}
          onChange={handleInputChange}
          disabled={isPartyFixed}
          options={parties.map((party) => ({
            value: party._id,
            label: party.name,
          }))} // Pass party options with _id and name
        />

        <InputField
          text="Challan Number"
          name="challanNumber"
          value={formData.challanNumber}
          onChange={handleInputChange}
          disabled={isChallanFixed}
        />

        <Quality
          text="Quality"
          value={formData.quality}
          onChange={handleInputChange}
          selectedParty={formData.partyName}
        />

        <InputField
          text="KG"
          name="kg"
          value={formData.kg}
          onChange={handleInputChange}
        />

        <InputField
          text="Meter"
          name="meter"
          value={formData.meter}
          onChange={handleInputChange}
        />

        <InputField
          text="Roll"
          name="roll"
          value={formData.roll}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex flex-row space-x-[200px] lg:justify-center">
        <button
          type="button"
          className="inline-flex mt-6 justify-center px-4 py-2 text-sm font-medium text-white bg-darkgray rounded-md hover:bg-white hover:text-darkgray outline"
          onClick={handleAddData}
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

      <Table data={tableData} isEditMode={isEditMode} onEdit={handleEdit} />
      <div className="justify-center flex">
        <button
          type="button"
          className="inline-flex mt-4 px-12 py-2 text-sm font-medium text-white bg-darkgray rounded-md hover:bg-white hover:text-darkgray outline"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </>
  );
};

export default AccountEntries;
