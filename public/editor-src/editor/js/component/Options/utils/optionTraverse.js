import { isOption } from "visual/component/Options/utils/index";

export default function optionTraverse(option, cb) {
  if (isOption(option)) {
    cb(option);
  }

  for (let key in option) {
    if (!option.hasOwnProperty(key)) continue;

    if (typeof option[key] === "object" && option[key] !== null)
      optionTraverse(option[key], cb);
  }
}
