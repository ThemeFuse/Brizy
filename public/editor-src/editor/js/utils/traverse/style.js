export const styleTraverse = (data, conditions) => {
  for (let key in data) {
    if (!data.hasOwnProperty(key)) {
      continue;
    }

    if (typeof conditions[key] === "function") {
      conditions[key](data[key]);
    }
  }
};
