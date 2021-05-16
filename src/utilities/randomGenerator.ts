export const randomGenerator = (max: number, min: number = 0) => {
  return Math.floor(Math.random() * (max - min)) + min; // You can remove the Math.floor if you don't want it to be an integer
};
