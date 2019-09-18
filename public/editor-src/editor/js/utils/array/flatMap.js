export const flatMap = (arr, fn) => {
  return arr.reduce((acc, curr) => {
    return acc.concat(fn(curr));
  }, []);
};
