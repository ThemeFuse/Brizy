export default function defaultsDeep(ob1, ob2) {
  for (const [key, value] of Object.entries(ob2)) {
    if (!(key in ob1)) {
      ob1[key] = value;
    } else {
      if (
        typeof ob1[key] === "object" &&
        typeof ob2[key] === "object" &&
        ob1[key] !== null && // typeof null === 'object'
        ob2[key] !== null // typeof null === 'object'
      ) {
        defaultsDeep(ob1[key], ob2[key]);
      }
    }
  }

  return ob1;
}
