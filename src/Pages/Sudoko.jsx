import React from "react";
import { useNavigate } from "react-router-dom";

const Sudoko = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 position-relative">
      <h1 className="text-3xl font-bold mb-4 flex items-center justify-center w-full gap-4 flex-col">
        {" [Under Construction] "}
        <span
          className="text-sm font-normal rounded p-2 bg-amber-50 text-black hover:bg-amber-200 transition cursor-pointer"
          onClick={() => navigate("/")}
        >
          Go Back Home
        </span>
      </h1>
    </div>
  );
};

export default Sudoko;
