import { Layout } from "./route";

export class Population {
  public layouts: Layout[] = [];
  constructor(intialize: boolean = true, length?: number) {
    if (intialize && length) {
      this.initializePopulation(length);
    }
  }
  private initializePopulation = (length: number) => {
    for (let index = 0; index < length; index++) {
      let newLayout: Layout;
      do {
        newLayout = new Layout(true);
      } while (
        this.layouts.findIndex(
          (r) => r.layoutUniqueID() == newLayout.layoutUniqueID()
        ) != -1
      );

      this.layouts.push(newLayout);
    }
  };
  public addLayout = (route: Layout) => {
    if (
      this.layouts.findIndex(
        (r) => r.layoutUniqueID() === route.layoutUniqueID()
      ) == -1
    ) {
      this.layouts.push(route);
    }
  };
  public getFittest = (): Layout => {
    if (this.layouts.length == 0) throw "Routes length zero";

    let maxFitness = this.layouts[0].getFitness();
    let bestRoute: Layout = this.layouts[0];
    for (let index = 1; index < this.layouts.length; index++) {
      
      const currentRoute = this.layouts[index];
      const currentFittness = currentRoute.getFitness();
      if (currentFittness > maxFitness) {
        maxFitness = currentFittness;
        bestRoute = currentRoute;        
      }
    }    
    return bestRoute;
  };
}
