export const capitalize = s => s[0].toUpperCase() + s.slice(1);

export const capByPrefix = (p, s) => (p === "" ? s : p + capitalize(s));

export const printf = (s, ...replacements) => {
  let i = 0;

  return s.replace(/%s/g, () => replacements[i++]);
};

export const encodeToString = value => {
  return encodeURIComponent(JSON.stringify(value));
};

export const decodeFromString = value => {
  return JSON.parse(decodeURIComponent(value));
};
