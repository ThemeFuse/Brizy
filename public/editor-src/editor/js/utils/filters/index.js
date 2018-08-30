const filterMap = {};

export function addFilter(name, cb) {
  if (filterMap[name] === undefined) {
    filterMap[name] = [];
  }

  filterMap[name].push(cb);
}

export function applyFilter(name, value, ...extraArgs) {
  if (filterMap[name] === undefined) {
    return value;
  }

  return filterMap[name].reduce((acc, cb) => {
    return cb(acc, ...extraArgs);
  }, value);
}
