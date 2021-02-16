import { getColorPaletteColors } from "visual/utils/color";
import { makeRichTextColorPaletteCSS } from "visual/utils/color";

import { IS_EXTERNAL_POPUP } from "visual/utils/models";

export default $ => {
  let getClassName = c => c;

  // if we add external popup to brizy page - his global styles rewrite page global styles
  if (IS_EXTERNAL_POPUP) {
    const popupId = $(".brz-popup2").attr("id");

    getClassName = className => `#${popupId} ${className}`;
  }

  const richTextPaletteCSS = makeRichTextColorPaletteCSS(
    getColorPaletteColors(),
    { getClassName }
  );

  $("head").append(`<style class="brz-style">${richTextPaletteCSS}</style>`);
};
