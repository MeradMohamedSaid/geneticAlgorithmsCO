import React from "react";

const Alert = ({ message, type, onClose }) => {
  const alertStyles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    warning: "bg-yellow-500 text-black",
  };

  return (
    <div
      className={`fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 px-6 py-4 rounded-lg shadow-lg ${alertStyles[type]}`}
    >
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-lg font-bold">
          X
        </button>
      </div>
    </div>
  );
};

export default Alert;
