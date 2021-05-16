import React, { useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Layout } from "./GA/route";
import { Population } from "./GA/popultaion";
import {
  CrossOver,
  hasProgress,
  Mutation,
  SortLayouts,
  TournaumentSelection,
} from "./GA/functions";
import { logRoutes } from "./utilities/logger";

import { fireEvent } from "@testing-library/react";
import { Chart, ChartData } from "./chart";
import { CONF } from "./config";

function App() {
  const [layout, setLayout] = useState<number[]>([]);
  const [chessSize, setChessSize] = useState(CONF.chessSize);
  const [lineData, setLineData] = useState<ChartData[]>([]);
  const [routeIds, setRouteIds] = useState<string[]>([]);
  const [currentGeneration, setCurrentGeneration] = useState(0);
  const mutationReteRef = useRef(0.12);
  const populationSizeRef = useRef(500);
  const generationsCountRef = useRef(1000);
  const tornaumentSizeRef = useRef(5);
  const fitnessHistory = useRef<number[]>([]);
  const stopRef = useRef(false);

  const delay = async (amount: number): Promise<void> => {
    return new Promise((resolve, rejects) => {
      setTimeout(() => {
        resolve();
      }, amount);
    });
  };
  const changeChessSize = (size: number) => {
    setChessSize(size);
    CONF.chessSize = size;
  };

  const solve = async () => {
    let currentPopulation = new Population(true, populationSizeRef.current);
    fitnessHistory.current = [];

    for (
      let generationIndex = 0;
      generationIndex < generationsCountRef.current;
      generationIndex++
    ) {
      if (
        stopRef.current ||
        !hasProgress(
          generationsCountRef.current,
          generationIndex,
          fitnessHistory.current
        )
      ) {
        stopRef.current = false;
        break;
      }
      const childPopulation = new Population(false);
      childPopulation.layouts = [currentPopulation.getFittest()];
      // Crossover
      do {
        const chromosomeA = TournaumentSelection(
          currentPopulation,
          tornaumentSizeRef.current
        );
        let chromosomeB: Layout;
        do {
          chromosomeB = TournaumentSelection(
            currentPopulation,
            tornaumentSizeRef.current
          );
        } while (chromosomeA.layoutUniqueID() == chromosomeB.layoutUniqueID());

        const [childA, childB] = CrossOver(chromosomeA, chromosomeB);
        childPopulation.addLayout(childA);
        childPopulation.addLayout(childB);
      } while (childPopulation.layouts.length < populationSizeRef.current);


      // Mutation

      for (let index = 0; index < childPopulation.layouts.length; index++) {
        const child = Mutation(
          childPopulation.layouts[index],
          mutationReteRef.current
        );
        childPopulation.layouts[index] = child;
      }
      setCurrentGeneration(generationIndex + 1);
      currentPopulation = childPopulation;
      const fittest = currentPopulation.getFittest();
      const fittestFitness = fittest.getFitness();
      setLayout(fittest.places);
      setLineData((_lineData) =>
        _lineData.concat({
          name: generationIndex.toString(),
          fitness: fittestFitness,
        } as ChartData)
      );
      fitnessHistory.current = [...fitnessHistory.current, fittestFitness];
      setRouteIds((_ids) => _ids.concat(fittest.layoutUniqueID()));
      await delay(1);
      if (fittestFitness == 10) {
        break;
      }
    }
  };
  useEffect(() => {
    reset();
    setLayout([]);
  }, []);
  const reset = () => {
    setLayout([]);
    setRouteIds([]);
    setLineData([]);
  };
  return (
    <div className="wrapper">
      <div className="container">
        <div className="playground">
          {[...new Array(chessSize)].map((v, rowIndex) => (
            <div className="row">
              {[...new Array(chessSize)].map((v, colIndex) => (
                <div
                  className={`col ${
                    layout[rowIndex] === colIndex
                      ? "queen"
                      : (rowIndex + colIndex) % 2 == 0
                      ? "black"
                      : "white"
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="controls">
          <div className="description">
            <div className="label">Generation Number</div>
            <div className="value">
              <div>{currentGeneration}</div>
            </div>
          </div>
          <div className="description">
            <div className="label">Best Layout</div>
            <div className="value">
              <div>{routeIds.length > 0 && routeIds[routeIds.length - 1]}</div>
            </div>
          </div>
          <div className="description">
            <div className="label">Chess Size</div>
            <div className="value">
              <input
                value={chessSize}
                onChange={(e) =>
                  changeChessSize(Number.parseInt(e.target.value))
                }
              />
            </div>
          </div>
          <div className="description">
            <div className="label">Mutation Rate</div>
            <div className="value">
              <input
                defaultValue={mutationReteRef.current}
                onChange={(e) => {
                  mutationReteRef.current = Number.parseFloat(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="description">
            <div className="label">Popultaion Size</div>
            <div className="value">
              <input
                defaultValue={populationSizeRef.current}
                onChange={(e) => {
                  populationSizeRef.current = Number.parseInt(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="description">
            <div className="label">Generation Count</div>
            <div className="value">
              <input
                defaultValue={generationsCountRef.current}
                onChange={(e) => {
                  generationsCountRef.current = Number.parseInt(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="description">
            <div className="label">Tornaument Size</div>
            <div className="value">
              <input
                defaultValue={tornaumentSizeRef.current}
                onChange={(e) => {
                  tornaumentSizeRef.current = Number.parseInt(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="buttons">
            <button onClick={solve} className="reset-button">
              Solve
            </button>

            <button onClick={reset} className="initial-button">
              Reset
            </button>
            <button
              onClick={() => {
                setRouteIds((_ids) => _ids.concat(["stopped"]));
                stopRef.current = true;
              }}
              className="stop-button"
            >
              Stop
            </button>
          </div>
        </div>
      </div>
      <div>
        <div className="chart">
          <Chart data={lineData} />
        </div>
      </div>
      <div>
        <h4>Layouts</h4>
        <div className="route-ids">
          {routeIds.map((r, i) => (
            <div>
              {i}: {r}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
