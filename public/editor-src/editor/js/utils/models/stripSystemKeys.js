const systemKeys = [
  "_id",
  "_thumbnailSrc",
  "_thumbnailWidth",
  "_thumbnailHeight",
  "_thumbnailTime"
];

export function stripSystemKeys(componentValue, { exclude = [] } = {}) {
  const finalKeys = systemKeys.filter(key => !exclude.includes(key));

  return JSON.parse(
    JSON.stringify(componentValue, (key, value) => {
      if (finalKeys.includes(key)) {
        return undefined;
      }

      return value;
    })
  );
}
