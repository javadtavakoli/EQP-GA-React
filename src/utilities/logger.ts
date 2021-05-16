import { Population } from "../GA/popultaion";

export const logRoutes = (pop: Population, gi: number) => {
  const popRoutes = pop.layouts.map((r) => r.layoutUniqueID());
  console.log(
    popRoutes.filter((p, i) => popRoutes.findIndex((r) => p == r) == i),
    gi
  );
};
