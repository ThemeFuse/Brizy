export const setHoverOptions = (data: KeyframeEffectOptions) => {
  return JSON.stringify(data, (_, value) =>
    value === Infinity ? "Infinity" : value
  );
};

export const getHoverOptions = (data: string): KeyframeEffectOptions =>
  JSON.parse(data, (_, value) => {
    return value === "Infinity" ? Infinity : value;
  });
