import React, { useEffect, useRef, useState } from "react";

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
//maxFitness = maxCostInMatrix * numberOfCities = 92 * 10 = 920
const maxFitness = 92 * 10;

const numberOfCities = 10;
const populationSize = 50;
const mutationRate = 0.01;
const maxGenerations = 200;
const crossoverRate = 0.94;
const elitismCount = 4;

const TspGa = () => {
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
    console.log("Initial Population: ", population);
    return population;
  };

  const cumulativeProbabilities = (indexedFitnesses, totalFitness) => {
    const n = indexedFitnesses.length;
    const rankedFitnesses = indexedFitnesses.map((ind, idx) => ({
      ...ind,
      rank: n - idx,
    }));
    //console.log("rankedFitnesses", rankedFitnesses);
    const totalRank = rankedFitnesses.reduce((sum, ind) => sum + ind.rank, 0);
    let cumulativeProbabilities = [];
    let cumulativeSum = 0;
    for (let i = 0; i < rankedFitnesses.length; i++) {
      cumulativeSum += rankedFitnesses[i].rank / totalRank;
      cumulativeProbabilities.push(cumulativeSum);
    }
    console.log(cumulativeProbabilities);
    return cumulativeProbabilities;
  };

  const roulleteSelectParent = (
    population,
    indexedFitnesses,
    cumulativeProbabilities
  ) => {
    const randomValue = Math.random();
    for (let i = 0; i < cumulativeProbabilities.length; i++) {
      if (randomValue <= cumulativeProbabilities[i]) {
        return population[indexedFitnesses[i].index];
      }
    }
    return population[indexedFitnesses[indexedFitnesses.length - 1].index];
  };

  const [bestFitness, setBestFitness] = useState(Infinity);
  const [bestPath, setBestPath] = useState(null);

  const calculateFitnessedIndex = (fitnesses) => {
    const indexedFitnesses = fitnesses.map((fitness, index) => ({
      fitness: fitness,
      index: index,
    }));
    indexedFitnesses.sort((a, b) => a.fitness - b.fitness);
    return indexedFitnesses;
  };

  const crossover = (parent1, parent2) => {
    const length = numberOfCities;
    let point1 = Math.floor(Math.random() * length);
    let point2 = Math.floor(Math.random() * length);
    point1 > point2 && ([point1, point2] = [point2, point1]);

    const child1 = Array(length).fill(null);
    const child2 = Array(length).fill(null);

    for (let i = point1; i <= point2; i++) {
      child1[i] = parent1[i];
      child2[i] = parent2[i];
    }

    const fillRemaining = (child, parent) => {
      let index = (point2 + 1) % length;
      for (let i = 0; i < length; i++) {
        const parentGene = parent[(point2 + 1 + i) % length];
        if (!child.includes(parentGene)) {
          child[index] = parentGene;
          index = (index + 1) % length;
        }
      }
    };

    fillRemaining(child1, parent2);
    fillRemaining(child2, parent1);

    // console.log(point1, point2);
    // console.log("Parent1: ", parent1);
    // console.log("Parent2: ", parent2);
    // console.log("Child 1: ", child1);
    // console.log("Child 2: ", child2);
    return [mutate(child1), mutate(child2)];
  };

  const mutate = (array) => {
    if (Math.random() < mutationRate) {
      const index1 = Math.floor(Math.random() * array.length);
      const index2 = Math.floor(Math.random() * array.length);
      [array[index1], array[index2]] = [array[index2], array[index1]];
      const index3 = Math.floor(Math.random() * array.length);
      const index4 = Math.floor(Math.random() * array.length);
      [array[index3], array[index4]] = [array[index4], array[index3]];
    }
    return array;
  };

  const GA = () => {
    var population = generateInitialPopulation();
    let generation = 0;
    var fitnesses = population.map(calculateFitness);
    console.log("Fitnesses: ", fitnesses);
    var indexedFitnesses = calculateFitnessedIndex(fitnesses);
    console.log("Indexed Fitnesses: ", indexedFitnesses);
    var newPopulation = [];
    var totalFitness = indexedFitnesses.reduce(
      (sum, individual) => sum + individual.fitness,
      0
    );
    console.log("Total Fitness: ", totalFitness);
    console.log("Best Fitness: ", indexedFitnesses[0].fitness);
    console.log("Best Configuration: ", population[indexedFitnesses[0].index]);
    // setBestFitness((old) => indexedFitnesses[0].fitness);
    // setBestPath((old) => population[indexedFitnesses[0].index]);
    var bestFitnessIn = indexedFitnesses[0].fitness;
    var bestPathIn = population[indexedFitnesses[0].index];
    var currentBest = indexedFitnesses[0];
    while (generation < maxGenerations) {
      console.log(
        "-----------------------------GENERATION ",
        generation + 1,
        "---------------------"
      );
      var cumulativeProbabilitiesArray = cumulativeProbabilities(
        indexedFitnesses,
        totalFitness
      );
      newPopulation = [];
      for (let i = 0; i < populationSize - elitismCount; i++) {
        newPopulation.push(
          roulleteSelectParent(
            population,
            indexedFitnesses,
            cumulativeProbabilitiesArray
          )
        );
      }
      for (let i = 0; i < elitismCount; i++) {
        newPopulation.push(population[indexedFitnesses[i].index]);
      }
      console.log("New Population: ", newPopulation);
      population = [];
      for (let i = 0; i < populationSize; i += 2) {
        var child1, child2;
        if (Math.random() < crossoverRate) {
          [child1, child2] = crossover(newPopulation[i], newPopulation[i + 1]);
        } else {
          child1 = mutate([...newPopulation[i]]);
          child2 = mutate([...newPopulation[i + 1]]);
        }
        // var [child1, child2] = crossover(
        //   newPopulation[i],
        //   newPopulation[i + 1]
        // );
        population.push(child1, child2);
      }
      console.log("New Population After Cross: ", population);
      fitnesses = population.map(calculateFitness);
      console.log("Fitnesses: ", fitnesses);
      indexedFitnesses = calculateFitnessedIndex(fitnesses);
      console.log("Indexed Fitnesses: ", indexedFitnesses);
      totalFitness = indexedFitnesses.reduce(
        (sum, individual) => sum + individual.fitness,
        0
      );

      currentBest = indexedFitnesses[0];
      if (currentBest.fitness < bestFitnessIn) {
        bestFitnessIn = currentBest.fitness;
        bestPathIn = population[currentBest.index];
        console.log("New Best Fitness: ", currentBest.fitness);
      }
      generation++;
    }
  };

  const calculateFitness = (path) => {
    let fitness = 0;
    for (let i = 0; i < path.length - 1; i++) {
      fitness += costMatrix[path[i]][path[i + 1]];
    }
    fitness += costMatrix[path[path.length - 1]][path[0]];
    return fitness;
  };

  GA();
  return (
    <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center p-4"></div>
  );
};

export default TspGa;
