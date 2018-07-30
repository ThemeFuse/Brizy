export default function objectTraverse(obj, cb, ...cbExtraArgs) {
  for (let key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    if (!!obj[key] && typeof obj[key] === "object")
      objectTraverse(obj[key], cb, ...cbExtraArgs);

    cb(key, obj[key], obj, ...cbExtraArgs);
  }
}
