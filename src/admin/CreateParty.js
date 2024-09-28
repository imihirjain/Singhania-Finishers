// src/components/PartyManager.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import Modal from "./Modal";

const PartyManager = () => {
  const [parties, setParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);
  const [qualityPartyId, setQualityPartyId] = useState(null);
  const [selectedQuality, setSelectedQuality] = useState(null);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    action: null,
    partyId: null,
    qualityId: null,
  });
  const { register, handleSubmit, reset } = useForm();
  const {
    register: registerQuality,
    handleSubmit: handleQualitySubmit,
    reset: resetQuality,
  } = useForm();

  useEffect(() => {
    fetchParties();
  }, []);

  const fetchParties = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/party");
      setParties(response.data);
    } catch (error) {
      console.error("Error fetching parties:", error);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (selectedParty) {
        await axios.put(
          `http://localhost:4000/api/party/${selectedParty._id}`,
          data
        );
      } else {
        await axios.post("http://localhost:4000/api/party", data);
      }
      fetchParties();
      reset();
      setSelectedParty(null);
    } catch (error) {
      console.error("Error saving party:", error);
    }
  };

  const onQualitySubmit = async (data) => {
    try {
      if (selectedQuality) {
        await axios.put(
          `http://localhost:4000/api/party/${qualityPartyId}/qualities/${selectedQuality._id}`,
          { newQuality: data.quality }
        );
      } else {
        await axios.post(
          `http://localhost:4000/api/party/${qualityPartyId}/qualities`,
          data
        );
      }
      fetchParties();
      resetQuality();
      setQualityPartyId(null);
      setSelectedQuality(null);
      closeModal();
    } catch (error) {
      console.error("Error saving quality:", error);
    }
  };

  const editParty = (party) => {
    setSelectedParty(party);
    reset(party);
  };

  const deleteParty = async (partyId) => {
    try {
      await axios.delete(`http://localhost:4000/api/party/${partyId}`);
      fetchParties();
      closeModal();
    } catch (error) {
      console.error("Error deleting party:", error);
    }
  };

  const deleteQuality = async (partyId, qualityId) => {
    try {
      await axios.delete(
        `http://localhost:4000/api/party/${partyId}/qualities/${qualityId}`
      );
      fetchParties();
      closeModal();
    } catch (error) {
      console.error("Error deleting quality:", error);
    }
  };

  const addQualityToParty = (partyId) => {
    setQualityPartyId(partyId);
    resetQuality();
    setSelectedQuality(null);
  };

  const editQuality = (partyId, quality, qualityId) => {
    setQualityPartyId(partyId);
    setSelectedQuality({ quality, _id: qualityId });
    resetQuality({ quality });
  };

  const openModal = (action, partyId, qualityId) => {
    setModalConfig({ isOpen: true, action, partyId, qualityId });
  };

  const closeModal = () => {
    setModalConfig({
      isOpen: false,
      action: null,
      partyId: null,
      qualityId: null,
    });
  };

  const handleConfirm = () => {
    const { action, partyId, qualityId } = modalConfig;
    if (action === "deleteParty") {
      deleteParty(partyId);
    } else if (action === "deleteQuality") {
      deleteQuality(partyId, qualityId);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="container mx-auto p-4 flex flex-col items-center">
      <h1 className="text-2xl font-login font-bold mb-4 text-center">
        {" "}
        Create Party And Quality
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-4 bg-white p-6 rounded-lg shadow-md"
      >
        <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-6 shadow-sm shadow-darkgray">
          <label className="block text-lg font-login ml-2 mt-2 text-gray-700">Name</label>
          <input
            type="text"
            {...register("name", { required: true })}
            className="ml-2 mt-2 mb-2 w-[90%] sm:w-auto rounded-md focus:ring-darkgray border-1 focus:border-darkgray placeholder:font-login"
          placeholder="Enter Name"
          />
        </div>
        <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-6 shadow-sm shadow-darkgray">
          <label className="block text-lg font-login ml-2 mt-2 text-gray-700">Location</label>
          <input
            type="text"
            {...register("location", { required: true })}
            className="ml-2 mt-2 mb-2 w-[90%] sm:w-auto rounded-md focus:ring-darkgray border-1 focus:border-darkgray placeholder:font-login"
          placeholder="Enter Location"
          />
        </div>
        <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-6 shadow-sm shadow-darkgray">
          <label className="block text-lg font-login ml-2 mt-2 text-gray-700">Date</label>
          <input
            type="date"
            {...register("date", { required: true })}
            className="ml-2 mt-2 mb-2 w-[90%] sm:w-auto rounded-md focus:ring-darkgray border-1 focus:border-darkgray placeholder:font-login"
          />
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="inline-flex mt-4 px-12 py-2 text-sm font-medium text-white bg-darkgray rounded-md hover:bg-white hover:text-darkgray outline"
          >
            {selectedParty ? "Update Party" : "Create Party"}
          </button>
          {selectedParty && (
            <button
              type="button"
              onClick={() => {
                reset();
                setSelectedParty(null);
              }}
              className="bg-red-500 text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {qualityPartyId && (
        <form
          onSubmit={handleQualitySubmit(onQualitySubmit)}
          className="mb-4 bg-white p-6 rounded-lg shadow-md"
        >
          <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-6 shadow-sm shadow-darkgray">
            <label className="block text-lg font-login ml-2 mt-2 text-gray-700">
              Quality
            </label>
            <input
              type="text"
              {...registerQuality("quality", { required: true })}
              className="ml-2 mt-2 mb-2 w-[90%] sm:w-auto rounded-md focus:ring-darkgray border-1 focus:border-darkgray placeholder:font-login"
              placeholder="Add Quality"
            />
          </div>
          <button
            type="submit"
            className="inline-flex mt-4 px-12 py-2 text-sm font-medium text-white bg-darkgray rounded-md hover:bg-white hover:text-darkgray outline"
          >
            {selectedQuality ? "Update Quality" : "Add Quality"}
          </button>
        </form>
      )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y mt-6 divide-gray-200 border overflow-hidden">
          <thead className="bg-header text-header-font font-header">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase font-login">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase font-login">Location</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase font-login">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[14px] uppercase font-login ">Qualities</th>
              <th className="px-12 py-3 text-left text-xs font-semibold text-[14px] uppercase font-login">Actions</th>
            </tr>
          </thead>
          <tbody>
            {parties.map((party) => (
              <tr key={party._id}>
                <td className="border px-5 py-3 font-login font-semibold">
                  {party.name}
                </td>
                <td className="border px-5 py-3 font-login font-semibold ">
                  {party.location}
                </td>
                <td className="border px-5 py-3 font-login font-semibold ">
                  {new Date(party.date).toLocaleDateString()}
                </td>
                <td className="border px-2 py-3 font-login ">
                  <ul>
                    {party.qualities.map((quality, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center font-semibold"
                      >
                        {quality}
                        <div className="flex">
                          <button
                            onClick={() =>
                              editQuality(party._id, quality, index)
                            }
                            className="bg-yellow-500 text-white py-1 px-2 mt-3 rounded mr-2 ml-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              openModal("deleteQuality", party._id, index)
                            }
                            className="bg-red-500 text-white py-1 px-2 mt-3 rounded mr-2"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="border p-2 flex flex-col space-y-4">
                  <button
                    onClick={() => editParty(party)}
                    className="bg-yellow-500 text-white py-1 px-2 rounded mr-2 font-login"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openModal("deleteParty", party._id)}
                    className="bg-red-500 text-white py-1 px-2 rounded mr-2 font-login"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => addQualityToParty(party._id)}
                    className="bg-blue-500 text-white py-1 px-2 rounded font-login"
                  >
                    Add Quality
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalConfig.isOpen}
        title="Confirmation"
        message="Are you sure you want to proceed?"
        onConfirm={handleConfirm}
        onCancel={closeModal}
        showCloseButton={true}
      />
    </div>
  );
};

export default PartyManager;
