const wpExceptions = [
  ".media-modal", // class of the WP media modal
  ".media-modal-backdrop"
];
const cloudExceptions = [".brz-ed-media-gallery-modal"];

export const targetExceptions =
  TARGET === "WP" ? wpExceptions : cloudExceptions;
