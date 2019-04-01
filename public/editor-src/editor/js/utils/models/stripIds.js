export default function stripIds(componentValue) {
  const replacer = (key, value) => (key === "_id" ? undefined : value);
  return JSON.parse(JSON.stringify(componentValue, replacer));
}
