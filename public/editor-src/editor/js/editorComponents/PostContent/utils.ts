export const getPlaceholder = (
  sourceType?: string,
  sourceID?: string
): string => {
  if (sourceType && sourceID) {
    return `{{brizy_dc_post_content type="${sourceType}" id="${sourceID}"}}`;
  }
  return "{{brizy_dc_post_content}}";
};
