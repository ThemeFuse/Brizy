import _ from "underscore";

export default function mergeOptions(options1, options2) {
  var merge = false;
  // has columns
  for (let i = 0; i < options2.length; i++) {
    for (let j = 0; j < options1.length; j++) {
      if (canMergeOption(options1[j], options2[i])) {
        options1[j] = mergeOption(options1[j], options2[i]);
        merge = true;
        break;
      }
      merge = false;
    }
    if (!merge) options1.push(options2[i]);
  }

  return sortOptions(options1);
}

function canMergeOption(option1, option2) {
  return (
    option1.type === option2.type &&
    option1.id &&
    option2.id &&
    option1.id === option2.id
  );
}

function mergeOption(option1, option2) {
  for (var prop of ["columns", "options", "tabs"]) {
    if (option1[prop] && option2[prop]) {
      option1[prop] = mergeOptions(option1[prop], option2[prop]);
      //option1[prop] = option1[prop].concat(option2[prop]);
    }
  }

  for (var prop of ["disabled"]) {
    if (option2[prop]) {
      option1[prop] = option2[prop];
    }
  }

  return option1;
}

function sortOptions(options) {
  if (!options || typeof options[Symbol.iterator] !== "function")
    return options;

  for (let option of options) {
    let property = "options";

    if (option["columns"]) property = "columns";

    if (option["tabs"]) property = "tabs";

    if (option[property]) option[property] = sortOptions(option[property]);
  }

  return _.sortBy(options, "position");
}
