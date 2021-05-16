import { CONF } from "../config";
import { randomGenerator } from "../utilities/randomGenerator";

export class Layout {
  public places: number[] = [];
  constructor(initialize: boolean = true) {
    if (initialize) {
      this.initializeLayouts();
    }
  }
  private initializeLayouts = () => {
    for (
      let itertationIndex = 0;
      itertationIndex < CONF.chessSize;
      itertationIndex++
    ) {
      const nextGene = getRandomPlaceNotInLayout(this.places);
      this.places.push(nextGene);
    }
  };
  private countConflicts = (rowIndex: number, piecePlace: number): number => {
    let conflicts = 0;
    for (let index = 0; index < CONF.chessSize; index++) {
      if (index == rowIndex) continue;
      // Check coloumns.
      if (this.places[index] === piecePlace) conflicts += 1;

      // Check digonals.
      if (this.places[index] - index === piecePlace - rowIndex) conflicts += 1;
      if (this.places[index] + index === piecePlace + rowIndex) conflicts += 1;
    }
    return conflicts;
  };
  public layoutUniqueID = (): string => {
    return this.places.join(",");
  };
  private measureLayoutConflict = (): number => {
    let length = 0;
    for (let index = 0; index < CONF.chessSize; index++) {
      length += this.countConflicts(index, this.places[index]);
    }

    return length;
  };
  public getFitness = (): number => {
    return (1 / (this.measureLayoutConflict() + 1)) * 10;
  };
}
export const getRandomPiecePlace = () => {
  return randomGenerator(CONF.chessSize);
};
export const getRandomPlaceNotInLayout = (chromose: number[]): number => {
  while (true) {
    const peiceIndex = getRandomPiecePlace();
    if (chromose.indexOf(peiceIndex) == -1) {
      return peiceIndex;
    }
  }
};
