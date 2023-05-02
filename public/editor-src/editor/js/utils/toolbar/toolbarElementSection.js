export const getInstanceParentId = (key, type) => {
  if (key && type === "popup") {
    return key.split("_")[0];
  }

  return undefined;
};
