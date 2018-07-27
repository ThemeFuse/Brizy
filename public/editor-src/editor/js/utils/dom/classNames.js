const _ = require("underscore");

function classMatches(className, match) {
  if (_.isString(match)) {
    return className === match;
  }

  if (_.isRegExp(match)) {
    return match.test(className);
  }

  throw Error("unknown match type");
}

export function parseClass(className) {
  return className.split(/\s+/).filter(Boolean);
}

export function addClass(className, toAdd) {
  const classes = parseClass(className);
  const toAddNormalized = _.isArray(toAdd) ? toAdd : [toAdd];

  return _.uniq(classes.concat(toAddNormalized)).join(" ");
}

export function removeClass(className, toRemove) {
  const classes = parseClass(className);
  const toRemoveNormalized = _.isArray(toRemove) ? toRemove : [toRemove];
  const notInToRemove = className =>
    _.some(toRemoveNormalized, item => classMatches(className, item)) === false;

  return _.filter(classes, notInToRemove).join(" ");
}

export function replaceClass(className, toRemove, toAdd) {
  const classes = parseClass(className);
  const toRemoveIndex = _.findIndex(classes, className =>
    classMatches(className, toRemove)
  );

  if (toRemoveIndex === -1) {
    return className;
  } else {
    classes.splice(toRemoveIndex, 1, toAdd);

    return classes.join(" ");
  }
}
