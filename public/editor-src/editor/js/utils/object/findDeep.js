export const findDeep = (obj, cb, path = []) => {
  const r = cb(obj);

  if (r) {
    return { obj, path };
  }

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    if (typeof obj[key] === "object" && obj[key] !== null) {
      const { obj: obj_, path: path_ } = findDeep(obj[key], cb, [...path, key]);

      if (obj_) {
        return { obj: obj_, path: path_ };
      }
    }
  }

  return { obj: null, path: null };
};
