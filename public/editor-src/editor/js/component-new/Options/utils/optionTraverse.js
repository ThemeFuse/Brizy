export default function optionTraverse(option, cb) {
  if (option.hasOwnProperty("id") && option.hasOwnProperty("type")) {
    cb(option);
  }

  for (let key in option) {
    if (!option.hasOwnProperty(key)) continue;

    if (typeof option[key] === "object" && option[key] !== null)
      optionTraverse(option[key], cb);
  }
}
