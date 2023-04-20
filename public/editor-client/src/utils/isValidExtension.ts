export const isValidExtension = (
  extension: string,
  acceptedExtensions: Array<string>
): boolean => {
  return acceptedExtensions.includes(extension);
};
