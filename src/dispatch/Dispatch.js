import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DispatchForm = () => {
  const [lots, setLots] = useState([]);
  const [selectedLotDetails, setSelectedLotDetails] = useState({});
  const [dispatchData, setDispatchData] = useState({
    karigarName: "",
    kg: "",
    meter: "",
    roll: "",
    lotNumber: "",
    lotId: "",
    party: "",
    qualityChallanNumber: "",
    process: "",
    shade: "",
    quality: "",
  });
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    // Fetch lot status dispatch data
    axios
      .get("http://localhost:4000/api/lots/status/dispatch")
      .then((response) => {
        setLots(response.data);
        console.log("Check Dispatch Data", response.data);
      })
      .catch((error) =>
        console.error("Error fetching lot status dispatch data:", error)
      );
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "karigarName") {
      // Allow only alphabetic characters in karigarName
      if (/^[a-zA-Z\s]*$/.test(value)) {
        setDispatchData({
          ...dispatchData,
          [name]: value,
        });
      }
    } else {
      // Allow only numeric values in kg, meter, and roll
      if (/^\d*$/.test(value)) {
        setDispatchData({
          ...dispatchData,
          [name]: value,
        });
      }
    }
  };

  const handleLotChange = (e) => {
    const selectedLot = lots.find((lot) => lot.lotNumber === e.target.value);
    setDispatchData({
      ...dispatchData,
      lotNumber: e.target.value,
      lotId: selectedLot ? selectedLot._id : "",
      party: selectedLot ? selectedLot.partyName : "",
      quality: selectedLot ? selectedLot.quality : "",
      qualityChallanNumber: "",
      process: "",
      shade: "",
    });
    setSelectedLotDetails(selectedLot || {});
  };

  const handlePartyChange = (e) => {
    setDispatchData({
      ...dispatchData,
      party: e.target.value,
    });
  };

  const handleQualityChallanNumberChange = (e) => {
    setDispatchData({
      ...dispatchData,
      qualityChallanNumber: e.target.value,
    });
  };

  const handleProcessChange = (e) => {
    setDispatchData({
      ...dispatchData,
      process: e.target.value,
    });
  };

  const handleShadeChange = (e) => {
    setDispatchData({
      ...dispatchData,
      shade: e.target.value,
    });
  };

  const handleQualityChange = (e) => {
    setDispatchData({
      ...dispatchData,
      quality: e.target.value,
    });
  };

  const validateInput = () => {
    if (
      dispatchData.kg < 0 ||
      dispatchData.meter < 0 ||
      dispatchData.roll < 0
    ) {
      setValidationError("KG, Meter, and Roll values must be non-negative.");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateInput()) {
      return;
    }

    // Convert numerical fields to numbers
    const dataToSubmit = {
      ...dispatchData,
      kg: Number(dispatchData.kg),
      meter: Number(dispatchData.meter),
      roll: Number(dispatchData.roll),
    };

    console.log("Dispatch Data:", dataToSubmit);

    axios
      .post("http://localhost:4000/api/dispatch", dataToSubmit)
      .then((response) => {
        console.log("Dispatch data submitted:", response.data);
        toast.success("Dispatch data submitted successfully!");
        // Reset the form
        setDispatchData({
          karigarName: "",
          kg: "",
          meter: "",
          roll: "",
          lotNumber: "",
          lotId: "",
          party: "",
          qualityChallanNumber: "",
          process: "",
          shade: "",
          quality: "",
        });
        setSelectedLotDetails({});
      })
      .catch((error) => {
        console.error("Error submitting dispatch data:", error);
        if (error.response) {
          // Request made and server responded
          // setError(error.response.data.message || 'An error occurred');
          toast.error(error.response.data.message || "An error occurred");
        } else if (error.request) {
          // The request was made but no response was received
          setError("No response received from server");
          toast.error("No response received from server");
        } else {
          // Something happened in setting up the request that triggered an Error
          setError("Error in setting up the request");
          toast.error("Error in setting up the request");
        }
      });
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md shadow-black rounded">
      <ToastContainer position="top-center" />
      <h2 className="text-2xl font-semibold mb-4">Dispatch Form</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {validationError && (
        <div className="text-red-500 mb-4">{validationError}</div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-6 shadow-sm shadow-darkgray">
          <label
            className="block text-lg font-login ml-4 mt-4 text-gray-700"
            htmlFor="lotNumber"
          >
            Lot Number <span className="text-red-600 ml-1">*</span>
          </label>
          <select
            id="lotNumber"
            name="lotNumber"
            value={dispatchData.lotNumber}
            onChange={handleLotChange}
            className="ml-4 mt-4 mb-4 w-[90%] sm:w-auto rounded-md"
          >
            <option value="">Select Lot Number</option>
            {lots.map((lot) => (
              <option key={lot._id} value={lot.lotNumber}>
                {lot.lotNumber}
              </option>
            ))}
          </select>
        </div>
        {dispatchData.lotNumber && (
          <>
            <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-6 shadow-sm shadow-darkgray">
              <label
                className="block text-lg font-login ml-4 mt-4 text-gray-700"
                htmlFor="party"
              >
                Party Name<span className="text-red-600">*</span>
              </label>
              <select
                id="party"
                name="party"
                value={dispatchData.party}
                onChange={handlePartyChange}
                className="ml-4 mt-4 mb-4 w-[90%] sm:w-auto rounded-md"
              >
                <option value="">Select Party Name</option>
                <option value={selectedLotDetails.partyName}>
                  {selectedLotDetails.partyName}
                </option>
              </select>
            </div>
            <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-6 shadow-sm shadow-darkgray">
              <label
                className="block text-lg font-login ml-4 mt-4 text-gray-700"
                htmlFor="quality"
              >
                Quality<span className="text-red-600">*</span>
              </label>
              <select
                id="quality"
                name="quality"
                value={dispatchData.quality}
                onChange={handleQualityChange}
                className="ml-4 mt-4 mb-4 w-[90%] sm:w-auto rounded-md"
              >
                <option value="">Select Quality</option>
                <option value={selectedLotDetails.quality}>
                  {selectedLotDetails.quality}
                </option>
              </select>
            </div>
            <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-6 shadow-sm shadow-darkgray">
              <label
                className="block text-lg font-login ml-4 mt-4 text-gray-700"
                htmlFor="qualityChallanNumber"
              >
                Quality Challan Number<span className="text-red-600">*</span>
              </label>
              <select
                id="qualityChallanNumber"
                name="qualityChallanNumber"
                value={dispatchData.qualityChallanNumber}
                onChange={handleQualityChallanNumberChange}
                className="ml-4 mt-4 mb-4 w-[90%] sm:w-auto rounded-md"
              >
                <option value="">Select Challan Number</option>
                {selectedLotDetails.entries &&
                  selectedLotDetails.entries.map((entry) => (
                    <option key={entry._id} value={entry.challanNumber}>
                      {entry.challanNumber}
                    </option>
                  ))}
              </select>
            </div>
            <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-6 shadow-sm shadow-darkgray">
              <label
                className="block text-lg font-login ml-4 mt-4 text-gray-700"
                htmlFor="process"
              >
                Process<span className="text-red-600">*</span>
              </label>
              <select
                id="process"
                name="process"
                value={dispatchData.process}
                onChange={handleProcessChange}
                className="ml-4 mt-4 mb-4 w-[90%] sm:w-auto rounded-md"
              >
                <option value="">Select Process</option>
                <option value={selectedLotDetails.processType}>
                  {selectedLotDetails.processType}
                </option>
              </select>
            </div>
            <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-6 shadow-sm shadow-darkgray">
              <label
                className="block text-lg font-login ml-4 mt-4 text-gray-700"
                htmlFor="shade"
              >
                Shade<span className="text-red-600">*</span>
              </label>
              <select
                id="shade"
                name="shade"
                value={dispatchData.shade}
                onChange={handleShadeChange}
                className="ml-4 mt-4 mb-4 w-[90%] sm:w-auto rounded-md"
              >
                <option value="">Select Shade</option>
                <option value={selectedLotDetails.shade}>
                  {selectedLotDetails.shade}
                </option>
              </select>
            </div>
          </>
        )}
        <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-6 shadow-sm shadow-darkgray">
          <label
            className="block text-lg font-login ml-4 mt-4 text-gray-700"
            htmlFor="karigarName"
          >
            Karigar Name<span className="text-red-600">*</span>
          </label>
          <input
            id="karigarName"
            name="karigarName"
            value={dispatchData.karigarName}
            onChange={handleInputChange}
            type="text"
            className="ml-4 mt-4 mb-4 w-[90%] sm:w-auto rounded-md placeholder:font-login"
            placeholder="Enter Karigar Name"
            required
          />
        </div>
        <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-6 shadow-sm shadow-darkgray">
          <label
            className="block text-lg font-login ml-4 mt-4 text-gray-700"
            htmlFor="kg"
          >
            KG<span className="text-red-600">*</span>
          </label>
          <input
            id="kg"
            name="kg"
            value={dispatchData.kg}
            onChange={handleInputChange}
            type="text"
            className="ml-4 mt-4 mb-4 w-[90%] sm:w-auto rounded-md placeholder:font-login"
            placeholder="Enter Kg"
            required
          />
        </div>
        <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-6 shadow-sm shadow-darkgray">
          <label
            className="block text-lg font-login ml-4 mt-4 text-gray-700"
            htmlFor="meter"
          >
            Meter<span className="text-red-600">*</span>
          </label>
          <input
            id="meter"
            name="meter"
            value={dispatchData.meter}
            onChange={handleInputChange}
            type="text"
            className="ml-4 mt-4 mb-4 w-[90%] sm:w-auto rounded-md placeholder:font-login"
            placeholder="Enter Meter"
            required
          />
        </div>
        <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-6 shadow-sm shadow-darkgray">
          <label
            className="block text-lg font-login ml-4 mt-4 text-gray-700"
            htmlFor="roll"
          >
            Roll<span className="text-red-600">*</span>
          </label>
          <input
            id="roll"
            name="roll"
            value={dispatchData.roll}
            onChange={handleInputChange}
            type="text"
            className="ml-4 mt-4 mb-4 w-[90%] sm:w-auto rounded-md placeholder:font-login"
            placeholder="Enter Roll"
            required
          />
        </div>
        <button
          type="submit"
          className="inline-flex mt-8 px-12 py-2 text-sm font-medium text-white bg-darkgray rounded-md hover:bg-white hover:text-darkgray outline"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default DispatchForm;
