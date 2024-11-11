import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CombinedForm = () => {
  const [dispatchData, setDispatchData] = useState([]);
  const [filteredDispatchData, setFilteredDispatchData] = useState([]);
  const [formData, setFormData] = useState({
    party: "",
    qualityChallanNumber: "",
    quality: "",
    lotNumber: "",
    kg: "",
    meter: "",
    roll: "",
    dispatchId: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/dispatch")
      .then((response) => {
        setDispatchData(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the dispatch data!", error);
        setError("Error fetching data");
        setIsLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "lotNumber") {
      filterDispatchData(value);
    }
    if (
      ["party", "qualityChallanNumber", "quality", "lotNumber"].includes(name)
    ) {
      updateDispatchId({ ...formData, [name]: value });
    }
  };

  const filterDispatchData = (selectedLotNumber) => {
    const filteredData = dispatchData.filter(
      (dispatch) => dispatch.lotNumber === selectedLotNumber
    );
    setFilteredDispatchData(filteredData);
  };

  const updateDispatchId = (updatedFormData) => {
    const selectedDispatch = dispatchData.find(
      (dispatch) =>
        dispatch.lotNumber === updatedFormData.lotNumber &&
        dispatch.party === updatedFormData.party &&
        dispatch.qualityChallanNumber ===
          updatedFormData.qualityChallanNumber &&
        dispatch.quality === updatedFormData.quality
    );

    setFormData((prevState) => ({
      ...prevState,
      dispatchId: selectedDispatch ? selectedDispatch._id : "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form data
    if (
      !formData.party ||
      !formData.qualityChallanNumber ||
      !formData.quality ||
      !formData.lotNumber ||
      !formData.kg ||
      !formData.meter ||
      !formData.roll ||
      !formData.dispatchId
    ) {
      toast.error("All fields are required.");
      return;
    }

    console.log("Form Data: ", formData);

    axios
      .post("http://localhost:4000/api/entryOut", formData)
      .then((response) => {
        console.log("Data submitted successfully", response);
        // Reset form after successful submission
        setFormData({
          party: "",
          qualityChallanNumber: "",
          quality: "",
          lotNumber: "",
          kg: "",
          meter: "",
          roll: "",
          dispatchId: "",
        });
        setError(null);
        toast.success("Data submitted successfully");
      })
      .catch((error) => {
        console.error("There was an error submitting the form data!", error);
        if (error.response) {
          toast.error(error.response.data.message || "Error submitting data");
        }
      });
  };

  const uniqueOptions = (field) => {
    return [...new Set(filteredDispatchData.map((item) => item[field]))];
  };

  return (
    <div className="flex flex-col items-center">
      <div className="border-2 w-full sm:w-[500px] rounded-lg h-30 overflow-hidden">
        <div className="mt-4 ml-4 text-4xl font-semibold">
          Account - Stock Out
        </div>

        <div className="bg-darkgray h-4 mt-10"></div>
      </div>
      <ToastContainer position="top-center" />
      {error && <div className="text-red-500">{error}</div>}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-6 shadow-sm shadow-darkgray">
            <label className="block text-lg font-login ml-4 mt-4 text-gray-700">
              Lot Number<span className="text-red-600 ml-1">*</span>
            </label>
            <select
              name="lotNumber"
              value={formData.lotNumber}
              onChange={handleChange}
              className="ml-4 mt-4 mb-4 w-[90%] sm:w-auto rounded-md"
            >
              <option value="">Select Lot Number</option>
              {[...new Set(dispatchData.map((item) => item.lotNumber))].map(
                (option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                )
              )}
            </select>
          </div>

          {formData.lotNumber && (
            <>
              <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-6 shadow-sm shadow-darkgray">
                <label className="block text-lg font-login ml-4 mt-4 text-gray-700">
                  Party<span className="text-red-600 ml-1">*</span>
                </label>
                <select
                  name="party"
                  value={formData.party}
                  onChange={handleChange}
                  className="ml-4 mt-4 mb-4 w-[90%] sm:w-auto rounded-md"
                >
                  <option value="">Select Party</option>
                  {uniqueOptions("party").map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-6 shadow-sm shadow-darkgray">
                <label className="block text-lg font-login ml-4 mt-4 text-gray-700">
                  Quality<span className="text-red-600 ml-1">*</span>
                </label>
                <select
                  name="quality"
                  value={formData.quality}
                  onChange={handleChange}
                  className="ml-4 mt-4 mb-4 w-[90%] sm:w-auto rounded-md"
                >
                  <option value="">Select Quality</option>
                  {uniqueOptions("quality").map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-6 shadow-sm shadow-darkgray">
                <label className="block text-lg font-login ml-4 mt-4 text-gray-700">
                  Challan Number<span className="text-red-600 ml-1">*</span>
                </label>
                <select
                  name="qualityChallanNumber"
                  value={formData.qualityChallanNumber}
                  onChange={handleChange}
                  className="ml-4 mt-4 mb-4 w-[90%] sm:w-auto rounded-md"
                >
                  <option value="">Select Challan Number</option>
                  {uniqueOptions("qualityChallanNumber").map(
                    (option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    )
                  )}
                </select>
              </div>
            </>
          )}
          {["kg", "meter", "roll"].map((field, index) => (
            <div
              key={index}
              className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-6 shadow-sm shadow-darkgray"
            >
              <label className="block text-lg font-login ml-4 mt-4 text-gray-700">
                {field.charAt(0).toUpperCase() + field.slice(1)}
                <span className="text-red-600 ml-1">*</span>
              </label>
              <input
                type="number"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="ml-4 mt-4 mb-4 w-[90%] sm:w-auto rounded-md placeholder:font-login"
                placeholder={`Enter ${
                  field.charAt(0).toUpperCase() + field.slice(1)
                }`}
              />
            </div>
          ))}
          <button
            type="submit"
            className="inline-flex mt-6 px-12 py-2 text-sm font-medium text-white bg-darkgray rounded-md hover:bg-white hover:text-darkgray outline"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default CombinedForm;
