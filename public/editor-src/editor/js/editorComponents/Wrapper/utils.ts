import { Shortcode } from "visual/types";

export const getThirdPartyShortcodeTitle = (
  shortcodes: Shortcode[],
  thirdPartyId?: string
) => {
  const shortcode = shortcodes.find(
    (shortcode) => shortcode.component.id === thirdPartyId
  );

  return shortcode?.component?.title ?? "";
};
