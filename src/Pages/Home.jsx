import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 gap-4">
      <h2 className="text-2xl font-semibold mb-4">
        Please, select which genetic algorithm you wanna try:
      </h2>

      <button
        className="px-8 py-4 font-medium text-3xl rounded bg-amber-50 text-black hover:bg-amber-200 transition cursor-pointer"
        onClick={() => navigate("/tspga")}
      >
        TSP
      </button>

      <button
        className="px-8 py-4 font-medium text-3xl rounded bg-amber-50 text-black hover:bg-amber-200 transition cursor-pointer"
        onClick={() => navigate("/sudoku")}
      >
        Sudoku solver
      </button>
    </div>
  );
};

export default Home;
