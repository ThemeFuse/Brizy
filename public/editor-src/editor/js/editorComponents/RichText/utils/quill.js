import Quill from "quill";
import Link from "./formats/Link";
import Population from "./formats/Population";
import Pre from "./formats/Pre";

if (IS_EDITOR) {
  let Parchment = Quill.import("parchment");
  Quill.debug("error");

  const registerBlockParchment = (...args) => {
    Quill.register(
      new Parchment.Attributor.Class(...args, {
        scope: Parchment.Scope.BLOCK
      }),
      true
    );
  };

  const registerInlineParchment = (id, type, isStyle = false) => {
    const scope = {
      scope: Parchment.Scope.INLINE
    };

    let parchment;
    if (isStyle) {
      parchment = new Parchment.Attributor.Style(id, type, scope);
    } else {
      parchment = new Parchment.Attributor.Class(id, type, scope);
    }

    Quill.register(parchment);
  };

  registerBlockParchment("desktopHeight", "brz-lh-lg");
  registerBlockParchment("intermediateHeight", "brz-lh-im");
  registerBlockParchment("mobileHeight", "brz-lh-xs");
  registerBlockParchment("desktopSize", "brz-fs-lg");
  registerBlockParchment("intermediateSize", "brz-fs-im");
  registerBlockParchment("mobileSize", "brz-fs-xs");
  registerBlockParchment("desktopHorizontalAlign", "brz-text-lg");
  registerBlockParchment("mobileHorizontalAlign", "brz-text-xs");
  registerBlockParchment("desktopLetterSpacing", "brz-ls-lg");
  registerBlockParchment("intermediateLetterSpacing", "brz-ls-im");
  registerBlockParchment("mobileLetterSpacing", "brz-ls-xs");
  registerBlockParchment("font", "brz-ff");
  registerBlockParchment("desktopWeight", "brz-fw-lg");
  registerBlockParchment("intermediateWeight", "brz-fw-im");
  registerBlockParchment("mobileWeight", "brz-fw-xs");
  registerBlockParchment("desktopMarginTop", "brz-mt-lg");
  registerBlockParchment("desktopMarginBottom", "brz-mb-lg");
  registerBlockParchment("mobileMarginTop", "brz-mt-xs");
  registerBlockParchment("mobileMarginBottom", "brz-mb-xs");
  registerBlockParchment("fontStyle", "brz-tp");
  registerInlineParchment("colorPalette", "brz-cp");
  registerInlineParchment("opacity", "opacity", true);
  registerInlineParchment("prepopulation", "brz-pre-population");
  Quill.register(Population);
  Quill.register(Link);
  Quill.register(Pre, true);
}

export const Delta = Quill.import("delta");
export const Keyboard = Quill.import("modules/keyboard");
export default Quill;
