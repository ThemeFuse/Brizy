export const formatStringFromLink = (type, formats) => {
  return encodeURIComponent(
    JSON.stringify({
      type,
      ...formats
    })
  );
};

export const formatLinkFromString = value => {
  try {
    return JSON.parse(decodeURIComponent(value));
  } catch (e) {
    return {
      linkType: "anchor",
      linkAnchor: "",
      linkExternal: "",
      linkExternalBlank: "on",
      linkExternalRel: "off"
    };
  }
};
