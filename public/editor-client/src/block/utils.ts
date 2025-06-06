export const createBlockId = (id: string, isPro: boolean): string => {
  return isPro ? `${id}:1` : `${id}:0`;
};
