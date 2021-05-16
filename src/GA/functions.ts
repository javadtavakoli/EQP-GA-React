import { fireEvent } from "@testing-library/react";
import { ListFormat } from "typescript";
import { ChartData } from "../chart";
import { logRoutes } from "../utilities/logger";
import { calcPercent } from "../utilities/percent";
import { randomGenerator } from "../utilities/randomGenerator";
import { Population } from "./popultaion";
import { getRandomPlaceNotInLayout, Layout } from "./route";
const GENE_PLACEHOLDER = -1;
export const CrossOver = (layoutA: Layout, layoutB: Layout): [Layout, Layout] => {
  const routeLength = layoutA.places.length;
  const chromosomeA: number[] = [];
  const chromosomeB: number[] = [];
  const mutationPoint = randomGenerator(routeLength);

  // Intitial chromosomes.
  for (let geneIndex = 0; geneIndex < routeLength; geneIndex++) {
    if (geneIndex < mutationPoint) {
      chromosomeA.push(layoutA.places[geneIndex]);
      chromosomeB.push(GENE_PLACEHOLDER);
    } else {
      chromosomeB.push(layoutB.places[geneIndex]);
      chromosomeA.push(GENE_PLACEHOLDER);
    }
  }

  // Fill other part.
  for (let geneIndex = 0; geneIndex < routeLength; geneIndex++) {
    if (geneIndex < mutationPoint) {
      const gene = layoutA.places[geneIndex];
      if (chromosomeB.findIndex((c) => c == gene) == -1) {
        chromosomeB[geneIndex] = gene;
      }
    } else {
      const gene = layoutB.places[geneIndex];
      if (chromosomeA.findIndex((c) => c == gene) == -1) {
        chromosomeA[geneIndex] = gene;
      }
    }
  }
  // Fill placeholders in chromosomeA.
  while (chromosomeA.findIndex((g) => g === GENE_PLACEHOLDER) !== -1) {
    const placeholderIndex = chromosomeA.findIndex(
      (g) => g === GENE_PLACEHOLDER
    );
    chromosomeA[placeholderIndex] = getRandomPlaceNotInLayout(chromosomeA);
  }
  // Fill placeholders in chromosomeB.
  while (chromosomeB.findIndex((g) => g === GENE_PLACEHOLDER) !== -1) {
    const placeholderIndex = chromosomeB.findIndex(
      (g) => g === GENE_PLACEHOLDER
    );
    chromosomeB[placeholderIndex] = getRandomPlaceNotInLayout(chromosomeB);
  }
  // Create routes.
  const childRouteA = new Layout(false);
  childRouteA.places = chromosomeA;
  const childRouteB = new Layout(false);
  childRouteB.places = chromosomeB;
  return [childRouteA, childRouteB];
};
export const Mutation = (layout: Layout, mutationRate: number): Layout => {
  const chromosome = [...layout.places];

  const mutateR = Math.random();
  if (mutationRate > mutateR) {
    const randMutiationPointA = randomGenerator(chromosome.length - 1);
    const randMutiationPointB = randomGenerator(chromosome.length - 1);
    const temp = chromosome[randMutiationPointA];
    chromosome[randMutiationPointA] = chromosome[randMutiationPointB];
    chromosome[randMutiationPointB] = temp;
    
  }
  const newRoute = new Layout(false);
  newRoute.places = [...chromosome];
  return layout;
};
export const TournaumentSelection = (
  population: Population,
  tornaumentSize: number
): Layout => {
  const populationRoutes = population.layouts;
  const populationLength = population.layouts.length;
  const k = tornaumentSize;
  const tornaumentPopulation = new Population(false);
  for (let index = 0; index < k; index++) {
    const randomIndex = randomGenerator(populationLength - 1);
    tornaumentPopulation.layouts.push(populationRoutes[randomIndex]);
  }
  const fittest = tornaumentPopulation.getFittest();

  return fittest;
};
export const SortLayouts = (layouts: Layout[]): Layout[] => {
  const routesWithFitness = layouts.map(
    (layout) => ({ layout, fitness: layout.getFitness() } as LayoutFitness)
  );
  const sortedRoutes = routesWithFitness
    .sort((a, b) => a.fitness - b.fitness)
    .map((r) => r.layout);
  return sortedRoutes;
};
type LayoutFitness = {
  layout: Layout;
  fitness: number;
};
export const hasProgress = (
  populationSize: number,
  currentGeneration: number,
  fitnessData: number[]
): boolean => {
  if (calcPercent(populationSize, 10) > currentGeneration) {
    return true;
  }
  const item80Percent = calcPercent(fitnessData.length, 80);
  const lastItem = fitnessData.length - 1;
  return fitnessData[item80Percent] < fitnessData[lastItem];
};
