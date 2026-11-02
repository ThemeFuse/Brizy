export const flat = (obj) => {
  const ret = {};

  for (const key in obj) {
    if (
      !Array.isArray(obj[key]) &&
      typeof obj[key] === "object" &&
      obj[key] !== null
    ) {
      Object.assign(ret, flat(obj[key]));
    } else {
      ret[key] = obj[key];
    }
  }

  return ret;
};
