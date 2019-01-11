const filterMap = {};

export function addFilter(name, cb, priority = 10) {
  if (filterMap[name] === undefined) {
    filterMap[name] = [];
  }

  const toBeAdded = {
    cb,
    priority
  };

  const insertionIndex = filterMap[name].findIndex(
    ({ priority }) => toBeAdded.priority < priority
  );

  if (insertionIndex !== -1) {
    filterMap[name].splice(insertionIndex, 0, toBeAdded);
  } else {
    filterMap[name].push(toBeAdded);
  }
}

export function applyFilter(name, value, ...extraArgs) {
  if (filterMap[name] === undefined) {
    return value;
  }

  return filterMap[name].reduce((acc, { cb }) => {
    return cb(acc, ...extraArgs);
  }, value);
}

export async function applyAsyncFilter(name, value, ...extraArgs) {
  if (filterMap[name] === undefined) {
    return Promise.resolve(value);
  }

  let result = value;
  for (let { cb } of filterMap[name]) {
    result = await cb(result, ...extraArgs);
  }

  return result;
}
