import { isRegExp, isString, uniq } from "es-toolkit";
import { filter, findIndex, isArray, some } from "es-toolkit/compat";

function classMatches(className, match) {
  if (isString(match)) {
    return className === match;
  }

  if (isRegExp(match)) {
    return match.test(className);
  }

  throw Error("unknown match type");
}

export function parseClass(className) {
  return className.split(/\s+/).filter(Boolean);
}

export function addClass(className, toAdd) {
  const classes = parseClass(className);
  const toAddNormalized = isArray(toAdd) ? toAdd : [toAdd];

  return uniq(classes.concat(toAddNormalized)).join(" ");
}

export function removeClass(className, toRemove) {
  const classes = parseClass(className);
  const toRemoveNormalized = isArray(toRemove) ? toRemove : [toRemove];
  const notInToRemove = (className) =>
    some(toRemoveNormalized, (item) => classMatches(className, item)) === false;

  return filter(classes, notInToRemove).join(" ");
}

export function replaceClass(className, toRemove, toAdd) {
  const classes = parseClass(className);
  const toRemoveIndex = findIndex(classes, (className) =>
    classMatches(className, toRemove)
  );

  if (toRemoveIndex === -1) {
    return className;
  } else {
    classes.splice(toRemoveIndex, 1, toAdd);

    return classes.join(" ");
  }
}
