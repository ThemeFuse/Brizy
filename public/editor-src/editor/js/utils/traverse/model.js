export const modelTraverse = (data, conditions) => {
  for (let key in data) {
    if (!data.hasOwnProperty(key)) {
      continue;
    }

    if (!!data[key] && typeof data[key] === "object") {
      modelTraverse(data[key], conditions);
    }

    const model = conditions[data.type] || conditions["Component"];

    if (typeof model === "function" && data.type && data.value) {
      model(data);
    }
  }
};
