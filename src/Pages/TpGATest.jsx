import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import Alert from "../Components/Alert";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const costMatrix = [
  [0, 12, 26, 11, 47, 23, 46, 44, 52, 35],
  [12, 0, 44, 20, 49, 43, 90, 92, 27, 91],
  [26, 44, 0, 50, 35, 21, 11, 82, 1, 92],
  [11, 20, 50, 0, 5, 57, 69, 62, 74, 91],
  [47, 49, 35, 5, 0, 61, 89, 26, 28, 80],
  [23, 43, 21, 57, 61, 0, 11, 8, 73, 36],
  [46, 90, 11, 69, 89, 11, 0, 16, 55, 61],
  [44, 92, 82, 62, 26, 8, 16, 0, 83, 71],
  [52, 27, 1, 74, 28, 73, 55, 83, 0, 74],
  [35, 91, 92, 91, 80, 36, 61, 71, 74, 0],
];

const TpGATest = () => {
  const [alert, setAlert] = useState(null);

  const [numberOfCities, setNumberOfCities] = useState(10);
  const [populationSize, setPopulationSize] = useState(100);
  const [mutationRate, setMutationRate] = useState(0.01);
  const [maxGenerations, setMaxGenerations] = useState(100);
  const [crossoverRate, setCrossoverRate] = useState(0.96);
  const [elitismCount, setElitismCount] = useState(2);

  const [populationSizeInput, setPopulationSizeInput] = useState(
    populationSize.toString()
  );
  const [mutationRateInput, setMutationRateInput] = useState(
    mutationRate.toString()
  );
  const [maxGenerationsInput, setMaxGenerationsInput] = useState(
    maxGenerations.toString()
  );
  const [crossoverRateInput, setCrossoverRateInput] = useState(
    crossoverRate.toString()
  );
  const [elitismCountInput, setElitismCountInput] = useState(
    elitismCount.toString()
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submit clicked");

    const populationSizeNum = parseInt(populationSizeInput, 10);
    const mutationRateNum = parseFloat(mutationRateInput);
    const maxGenerationsNum = parseInt(maxGenerationsInput, 10);
    const crossoverRateNum = parseFloat(crossoverRateInput);
    const elitismCountNum = parseInt(elitismCountInput, 10);

    if (
      populationSizeNum < 50 ||
      populationSizeNum > 1000 ||
      populationSizeNum % 2 !== 0
    ) {
      setAlert({
        message: "Population size must be an even number between 50 and 1000.",
        type: "error",
      });
      return;
    }

    if (mutationRateNum < 0.001 || mutationRateNum > 0.05) {
      setAlert({
        message: "Mutation rate must be between 0.1% and 5%.",
        type: "error",
      });
      return;
    }

    if (maxGenerationsNum < 10 || maxGenerationsNum > 500) {
      setAlert({
        message: "Max generations must be between 10 and 500.",
        type: "error",
      });
      return;
    }

    if (crossoverRateNum < 0.5 || crossoverRateNum > 1) {
      setAlert({
        message: "Crossover rate must be between 50% and 100%.",
        type: "error",
      });
      return;
    }

    if (elitismCountNum >= populationSizeNum * 0.1) {
      setAlert({
        message: "Elitism count must be less than 10% of population size.",
        type: "error",
      });
      return;
    }

    setPopulationSize(populationSizeNum);
    setMutationRate(mutationRateNum);
    setMaxGenerations(maxGenerationsNum);
    setCrossoverRate(crossoverRateNum);
    setElitismCount(elitismCountNum);
    setSettings(false);

    console.log("Updated Successfully", {
      populationSizeNum,
      mutationRateNum,
      maxGenerationsNum,
      crossoverRateNum,
      elitismCountNum,
    });
  };

  //
  //
  //
  //
  const handleAlertClose = () => {
    setAlert(null);
  };
  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => {
    if (alert) {
      setShowAlert((old) => true);
      const timer = setTimeout(() => {
        setShowAlert(false);
        setAlert(null);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowAlert((old) => false);
    }
  }, [Alert]);
  const [bestFitness, setBestFitness] = useState(null);
  const [bestPath, setBestPath] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [generation, setGeneration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [fitnessHistory, setFitnessHistory] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (currentPath.length > 0) drawPath();
  }, [currentPath]);

  const computeCircularPositions = (centerX, centerY, radius, numPoints) => {
    const positions = [];
    for (let i = 0; i < numPoints; i++) {
      const angle = (2 * Math.PI * i) / numPoints;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      positions.push([x, y]);
    }
    return positions;
  };

  var cityPositions = computeCircularPositions(200, 150, 100, numberOfCities);

  const drawPath = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, 400, 300);

    const circleRadius = 8;
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const colors = [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "purple",
      "cyan",
      "magenta",
    ];

    for (let i = 0; i < currentPath.length; i++) {
      const fromIdx = currentPath[i];
      const toIdx = currentPath[(i + 1) % currentPath.length];
      const [fromX, fromY] = cityPositions[fromIdx];
      const [toX, toY] = cityPositions[toIdx];

      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.strokeStyle = colors[i % colors.length];
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    cityPositions.forEach(([x, y], index) => {
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(x, y, circleRadius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = "black";
      ctx.fillText(index, x, y);
    });
  };

  const generateInitialPopulation = () => {
    const population = [];
    for (let i = 0; i < populationSize; i++) {
      const path = Array.from({ length: numberOfCities }, (_, index) => index);
      for (let j = path.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [path[j], path[k]] = [path[k], path[j]];
      }
      population.push(path);
    }
    return population;
  };

  const cumulativeProbabilities = (indexedFitnesses) => {
    const n = indexedFitnesses.length;
    const rankedFitnesses = indexedFitnesses.map((ind, idx) => ({
      ...ind,
      rank: n - idx,
    }));
    const totalRank = rankedFitnesses.reduce((sum, ind) => sum + ind.rank, 0);
    let cumulativeProbabilities = [];
    let cumulativeSum = 0;
    for (let i = 0; i < rankedFitnesses.length; i++) {
      cumulativeSum += rankedFitnesses[i].rank / totalRank;
      cumulativeProbabilities.push(cumulativeSum);
    }
    return cumulativeProbabilities;
  };

  const roulleteSelectParent = (population, indexedFitnesses, cumProbs) => {
    const randomValue = Math.random();
    for (let i = 0; i < cumProbs.length; i++) {
      if (randomValue <= cumProbs[i]) {
        return population[indexedFitnesses[i].index];
      }
    }
    return population[indexedFitnesses[indexedFitnesses.length - 1].index];
  };

  const calculateFitnessedIndex = (fitnesses) => {
    const indexedFitnesses = fitnesses.map((fitness, index) => ({
      fitness,
      index,
    }));
    indexedFitnesses.sort((a, b) => a.fitness - b.fitness);
    return indexedFitnesses;
  };

  const crossover = (parent1, parent2) => {
    const length = numberOfCities;
    let point1 = Math.floor(Math.random() * length);
    let point2 = Math.floor(Math.random() * length);
    if (point1 > point2) [point1, point2] = [point2, point1];

    const child1 = Array(length).fill(null);
    const child2 = Array(length).fill(null);

    for (let i = point1; i <= point2; i++) {
      child1[i] = parent1[i];
      child2[i] = parent2[i];
    }

    const fillRemaining = (child, parent) => {
      let index = (point2 + 1) % length;
      for (let i = 0; i < length; i++) {
        const gene = parent[(point2 + 1 + i) % length];
        if (!child.includes(gene)) {
          child[index] = gene;
          index = (index + 1) % length;
        }
      }
    };

    fillRemaining(child1, parent2);
    fillRemaining(child2, parent1);

    return [mutate(child1), mutate(child2)];
  };

  const mutate = (array) => {
    if (Math.random() < mutationRate) {
      const idx1 = Math.floor(Math.random() * array.length);
      const idx2 = Math.floor(Math.random() * array.length);
      [array[idx1], array[idx2]] = [array[idx2], array[idx1]];
    }
    return array;
  };

  const calculateFitness = (path) => {
    let fitness = 0;
    for (let i = 0; i < path.length - 1; i++) {
      fitness += costMatrix[path[i]][path[i + 1]];
    }
    fitness += costMatrix[path[path.length - 1]][path[0]];
    return fitness;
  };

  const runGA = async () => {
    setIsRunning(true);
    let population = generateInitialPopulation();
    let fitnesses = population.map(calculateFitness);
    let indexedFitnesses = calculateFitnessedIndex(fitnesses);
    let bestFit = indexedFitnesses[0].fitness;
    let bestPathNow = population[indexedFitnesses[0].index];
    let history = [];

    for (let gen = 0; gen < maxGenerations; gen++) {
      const cumProbs = cumulativeProbabilities(indexedFitnesses);
      const newPopulation = [];

      for (let i = 0; i < populationSize - elitismCount; i++) {
        newPopulation.push(
          roulleteSelectParent(population, indexedFitnesses, cumProbs)
        );
      }
      for (let i = 0; i < elitismCount; i++) {
        newPopulation.push(population[indexedFitnesses[i].index]);
      }

      population = [];
      for (let i = 0; i < populationSize; i += 2) {
        let [child1, child2] =
          Math.random() < crossoverRate
            ? crossover(newPopulation[i], newPopulation[i + 1])
            : [
                mutate([...newPopulation[i]]),
                mutate([...newPopulation[i + 1]]),
              ];
        population.push(child1, child2);
      }

      fitnesses = population.map(calculateFitness);
      indexedFitnesses = calculateFitnessedIndex(fitnesses);
      if (indexedFitnesses[0].fitness <= bestFit) {
        bestFit = indexedFitnesses[0].fitness;
        bestPathNow = population[indexedFitnesses[0].index];
      }

      history.push(bestFit);

      setBestFitness(bestFit);
      setBestPath(bestPathNow);
      setCurrentPath(population[indexedFitnesses[0].index]);
      setGeneration((old) => gen + 1);
      setFitnessHistory([...history]);
      await new Promise((r) => setTimeout(r, 30));
    }
    setCurrentPath([...bestPath]);
    setIsRunning(false);
  };

  // ==================
  const [settings, setSettings] = useState(false);
  const handleSetting = () => {
    if (!settings) {
      setAlert((old) => null);
    }
    setSettings((old) => !old);
  };

  const chartData = {
    labels: fitnessHistory.map((_, i) => `Gen ${i}`),
    datasets: [
      {
        label: "Best Fitness",
        data: fitnessHistory,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "Fitness",
        },
      },
      x: {
        title: {
          display: false,
          text: "Generation",
        },
      },
    },
  };

  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 sm:p-6 relative">
      {/* Settings Modal (Mobile Responsive) */}
      {settings && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/80 flex justify-center items-center px-4 py-8 overflow-y-auto z-50">
          <div className="w-full max-w-md rounded-xl bg-gradient-to-r from-gray-600 to-gray-800 p-6 box-border flex justify-center items-center flex-col gap-4">
            <div className="w-full flex justify-between items-center">
              <span className="text-2xl sm:text-3xl md:text-4xl font-medium text-white">
                Settings
              </span>
              <span
                className="text-xl sm:text-2xl font-medium flex items-center justify-center py-1 px-3 sm:py-2 sm:px-4 text-center bg-red-500 rounded cursor-pointer"
                onClick={handleSetting}
              >
                ✕
              </span>
            </div>

            {/* Alert Component */}
            {alert && (
              <Alert
                message={alert.message}
                type={alert.type}
                onClose={handleAlertClose}
              />
            )}

            {/* Input Fields with Responsive Styling */}
            <div className="w-full space-y-4">
              {/* Population Size */}
              <div className="w-full">
                <label
                  htmlFor="populationSizeInput"
                  className="block text-white text-sm sm:text-base"
                >
                  Population Size (even, 50-1000)
                </label>
                <input
                  id="populationSizeInput"
                  type="number"
                  value={populationSizeInput}
                  onChange={(e) =>
                    setPopulationSizeInput(Number(e.target.value))
                  }
                  className="w-full p-2 mt-2 bg-gray-700 text-white rounded-md text-sm sm:text-base"
                />
              </div>

              {/* Mutation Rate */}
              <div className="w-full">
                <label
                  htmlFor="mutationRateInput"
                  className="block text-white text-sm sm:text-base"
                >
                  Mutation Rate (0.1% - 5%)
                </label>
                <input
                  id="mutationRateInput"
                  type="number"
                  step="0.001"
                  value={mutationRateInput}
                  onChange={(e) => setMutationRateInput(Number(e.target.value))}
                  className="w-full p-2 mt-2 bg-gray-700 text-white rounded-md text-sm sm:text-base"
                />
              </div>

              {/* Max Generations */}
              <div className="w-full">
                <label
                  htmlFor="maxGenerationsInput"
                  className="block text-white text-sm sm:text-base"
                >
                  Max Generations (10-500)
                </label>
                <input
                  id="maxGenerationsInput"
                  type="number"
                  value={maxGenerationsInput}
                  onChange={(e) =>
                    setMaxGenerationsInput(Number(e.target.value))
                  }
                  className="w-full p-2 mt-2 bg-gray-700 text-white rounded-md text-sm sm:text-base"
                />
              </div>

              {/* Crossover Rate */}
              <div className="w-full">
                <label
                  htmlFor="crossoverRateInput"
                  className="block text-white text-sm sm:text-base"
                >
                  Crossover Rate (50% - 100%)
                </label>
                <input
                  id="crossoverRateInput"
                  type="number"
                  step="0.01"
                  value={crossoverRateInput}
                  onChange={(e) =>
                    setCrossoverRateInput(Number(e.target.value))
                  }
                  className="w-full p-2 mt-2 bg-gray-700 text-white rounded-md text-sm sm:text-base"
                />
              </div>

              {/* Elitism Count */}
              <div className="w-full">
                <label
                  htmlFor="elitismCountInput"
                  className="block text-white text-sm sm:text-base"
                >
                  Elitism Count (under 10% of Population Size)
                </label>
                <input
                  id="elitismCountInput"
                  type="number"
                  value={elitismCountInput}
                  onChange={(e) => setElitismCountInput(Number(e.target.value))}
                  className="w-full p-2 mt-2 bg-gray-700 text-white rounded-md text-sm sm:text-base"
                />
              </div>

              {/* Submit Button */}
              <div className="w-full">
                <button
                  onClick={(e) => handleSubmit(e)}
                  type="submit"
                  className="w-full py-2 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm sm:text-base"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header with Responsive Typography */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 flex flex-col sm:flex-row items-center justify-center w-full gap-2 sm:gap-4 text-center">
        <span
          className="text-xs sm:text-sm font-normal rounded p-1 sm:p-2 bg-amber-50 text-black hover:bg-amber-200 transition cursor-pointer mb-2 sm:mb-0"
          onClick={() => navigate("/")}
        >
          Home
        </span>
        TSP Genetic Algorithm - MERAD Mohamed Said
      </h1>

      {/* Responsive Information Sections */}
      <div className="w-full mb-6 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6">
        <div className="bg-gray-800 p-4 rounded w-full max-w-md mb-2 sm:mb-0">
          <p className="mb-2 text-sm sm:text-base">
            <span className="font-semibold">Number Of Cities:</span>{" "}
            {numberOfCities}
          </p>
          <p className="mb-2 text-sm sm:text-base">
            <span className="font-semibold">Population Size:</span>{" "}
            {populationSize}
          </p>
          <p className="text-sm sm:text-base">
            <span className="font-semibold">Generations:</span> {maxGenerations}
          </p>
        </div>

        <div className="bg-gray-800 p-4 rounded w-full max-w-md mb-2 sm:mb-0">
          <p className="mb-2 text-sm sm:text-base">
            <span className="font-semibold">Best Fitness:</span>{" "}
            {bestFitness !== null ? bestFitness : "Not computed yet"}
          </p>
          <p className="mb-2 text-sm sm:text-base">
            <span className="font-semibold">Best Path:</span>{" "}
            {bestPath.length > 0 ? bestPath.join(" → ") : "Not computed yet"}
          </p>
          <p className="text-sm sm:text-base">
            <span className="font-semibold">Generation:</span>{" "}
            {`${generation}/${maxGenerations}`}
          </p>
        </div>

        <div className="bg-gray-800 p-4 rounded w-full max-w-md">
          <p
            className="mb-2 text-sm sm:text-base"
            title="How much genetic material is exchanged between individuals to create new offspring. , must be between [50%] and [100%]."
          >
            <span className="font-semibold">CrossOver Rate:</span>{" "}
            {crossoverRate}
          </p>
          <p
            className="mb-2 text-sm sm:text-base"
            title="The probability that random changes (mutations) are applied to individuals [0.1%-5%]."
          >
            <span className="font-semibold">Mutation Rate:</span> {mutationRate}
          </p>
          <p
            className="text-sm sm:text-base"
            title="The number of top-performing individuals automatically carried over unchanged to the next generation, must be less than [10%] of population size."
          >
            <span className="font-semibold">Elitism Count:</span> {elitismCount}
          </p>
        </div>
      </div>

      {/* Responsive Canvas */}
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="mb-6 max-w-full h-auto max-h-200"
      />

      {/* Responsive Buttons */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mb-6">
        <button
          onClick={runGA}
          disabled={isRunning}
          className={`w-full sm:w-auto px-4 py-2 rounded ${
            isRunning
              ? "bg-orange-500 hover:bg-orange-600 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 cursor-pointer"
          } transition duration-200 ease-in-out text-sm sm:text-base`}
        >
          {isRunning ? "GA Running..." : "Start"}
        </button>

        <button
          onClick={handleSetting}
          disabled={isRunning}
          className="w-full sm:w-auto px-4 py-2 bg-green-500 hover:bg-green-600 rounded cursor-pointer text-sm sm:text-base"
        >
          Settings
        </button>
      </div>

      {/* Responsive Convergence Graph */}
      <div className="bg-gray-800 p-4 rounded w-full max-w-md box-border">
        <h2 className="text-base sm:text-lg font-semibold mb-2">
          Convergence Graph - Best fitness:{" "}
          {bestFitness !== null ? bestFitness : " */* "}
        </h2>
        <div className="relative w-full pb-[56.25%]">
          {" "}
          {/* 16:9 Aspect Ratio Container */}
          <div className="absolute top-0 left-0 w-full h-full">
            <Line
              data={{
                labels: fitnessHistory.map((_, idx) => idx + 1),
                datasets: [
                  {
                    label: "Best Fitness",
                    data: fitnessHistory,
                    borderColor: "lime",
                    backgroundColor: "rgba(50,205,50,0.2)",
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                layout: {
                  padding: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: false,
                    ticks: {
                      color: "white",
                      title: true,
                      text: "Fitness",
                    },
                    grid: {
                      color: "rgba(255,255,255,0.1)",
                    },
                  },
                  x: {
                    ticks: {
                      color: "white",
                    },
                    grid: {
                      color: "rgba(255,255,255,0.1)",
                    },
                  },
                },
                plugins: {
                  legend: {
                    labels: {
                      color: "white",
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TpGATest;
