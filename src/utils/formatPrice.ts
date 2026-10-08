const wholePoundsFormat = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const poundsAndPenceFormat = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

export const formatPrice = (price: number): string => {
  const hasPence = !Number.isInteger(price);
  return hasPence ? poundsAndPenceFormat.format(price) : wholePoundsFormat.format(price);
};
