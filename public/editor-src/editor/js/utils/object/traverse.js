export const traverse = (obj, cb, ...cbExtraArgs) => {
  for (let key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    if (!!obj[key] && typeof obj[key] === "object")
      traverse(obj[key], cb, ...cbExtraArgs);

    cb(key, obj[key], obj, ...cbExtraArgs);
  }
};

export const traverse2 = (obj, cb) => {
  for (let key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }

    if (!!obj[key] && typeof obj[key] === "object") {
      traverse2(obj[key], cb);
    }
  }

  cb(obj);
};
