// https://dev.to/viebel/structural-sharing-with-7-lines-of-javascript-2dnh
export function mapWithStructuralSharing(obj, cb) {
  let patch;

  for (let key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    if (typeof obj[key] === "object" && obj[key] !== null) {
      const r = mapWithStructuralSharing(obj[key], cb);

      if (r !== obj[key]) {
        patch = patch ?? {};
        patch[key] = r;
      }
    }
  }

  const r = cb(obj);

  return patch ? patchImmutable(patch, obj) : r;
}

function patchImmutable(patch, obj) {
  if (Array.isArray(obj)) {
    let ret;
    let retCloned = false;

    for (const key in patch) {
      if (!patch.hasOwnProperty(key)) continue;

      const keyNr = Number(key);
      if (keyNr >= 0 && keyNr <= obj.length - 1) {
        if (!retCloned) {
          ret = obj.slice(0);
          retCloned = true;
        }

        ret[key] = patch[key];
      }
    }

    return ret ? ret : obj;
  } else {
    return { ...obj, ...patch };
  }
}
