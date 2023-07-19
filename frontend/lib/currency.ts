import { Currency } from "./api/models";

export const generateStep = (currency?: Currency): number => {
  if (!currency) return 0.01;
  let step: number;
  switch (currency.decimals) {
    case 0:
      step = 1;
      break;
    case 3:
      step = 0.001;
      break;
    default:
      step = 0.01;
      break;
  }
  return step;
};
