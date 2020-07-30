export default function imagePopulationUrl(
  population,
  options = {
    cW: 5000,
    cH: 0
  }
) {
  const { cW, cH } = options;

  if (!population || typeof cW !== "number" || typeof cH !== "number") {
    throw new Error("Invalid arguments");
  }

  return `{{${population.replace(/{{|}}/g, "")} cW='${cW}' cH='${cH}'}}`;
}
