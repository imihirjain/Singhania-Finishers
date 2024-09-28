// src/components/Modal.js

import React from 'react';

const Modal = ({ isOpen, title, message, onConfirm, onCancel, showCloseButton }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-1/3 p-6 relative">
        {showCloseButton && (
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={onCancel}
          >
            &times;
          </button>
        )}
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onCancel}
            className="bg-gray-500 text-darkgray py-2 px-4 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white py-2 px-4 rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
