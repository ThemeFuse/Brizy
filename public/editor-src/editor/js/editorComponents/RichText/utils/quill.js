import Quill from "quill";
import Link from "./formats/Link";
import BlockColor from "./formats/BlockColor";
import BlockOpacity from "./formats/BlockOpacity";
import CustomListItem from "./formats/CustomListItem";
import Population from "./formats/Population";
import Pre from "./formats/Pre";
import DCBlock from "./formats/DCBlock";
import BackgroundImage from "./formats/BackgroundImage";
import BackgroundGradient from "./formats/BackgroundGradient";

if (IS_EDITOR) {
  let Parchment = Quill.import("parchment");
  Quill.debug("error");

  const registerParchment = (
    id,
    type,
    attributorType = "class",
    scopeType = "block"
  ) => {
    const scope = {
      scope:
        scopeType === "inline" ? Parchment.Scope.INLINE : Parchment.Scope.BLOCK
    };

    let parchment;
    switch (attributorType) {
      case "class":
        parchment = new Parchment.Attributor.Class(id, type, scope);
        break;
      case "style":
        parchment = new Parchment.Attributor.Style(id, type, scope);
        break;
      default:
        parchment = new Parchment.Attributor.Attribute(id, type, scope);
    }

    Quill.register(parchment);
  };

  registerParchment("lineHeight", "brz-lh-lg");
  registerParchment("intermediateTabletLineHeight", "brz-lh-sm-im");
  registerParchment("intermediateMobileLineHeight", "brz-lh-xs-im");
  registerParchment("tabletLineHeight", "brz-lh-sm");
  registerParchment("mobileLineHeight", "brz-lh-xs");
  registerParchment("fontSize", "brz-fs-lg");
  registerParchment("intermediateTabletFontSize", "brz-fs-sm-im");
  registerParchment("intermediateMobileFontSize", "brz-fs-xs-im");
  registerParchment("tabletFontSize", "brz-fs-sm");
  registerParchment("mobileFontSize", "brz-fs-xs");
  registerParchment("desktopHorizontalAlign", "brz-text-lg");
  registerParchment("tabletHorizontalAlign", "brz-text-sm");
  registerParchment("mobileHorizontalAlign", "brz-text-xs");
  registerParchment("letterSpacing", "brz-ls-lg");
  registerParchment("intermediateTabletLetterSpacing", "brz-ls-sm-im");
  registerParchment("intermediateMobileLetterSpacing", "brz-ls-xs-im");
  registerParchment("tabletLetterSpacing", "brz-ls-sm");
  registerParchment("mobileLetterSpacing", "brz-ls-xs");
  registerParchment("fontFamily", "brz-ff");
  registerParchment("fontFamilyType", "brz-ft");
  registerParchment("fontWeight", "brz-fw-lg");
  registerParchment("intermediateTabletWeight", "brz-fw-sm-im");
  registerParchment("intermediateMobileWeight", "brz-fw-xs-im");
  registerParchment("tabletFontWeight", "brz-fw-sm");
  registerParchment("mobileFontWeight", "brz-fw-xs");
  registerParchment("desktopMarginTop", "brz-mt-lg");
  registerParchment("desktopMarginBottom", "brz-mb-lg");
  registerParchment("tabletMarginTop", "brz-mt-sm");
  registerParchment("mobileMarginTop", "brz-mt-xs");
  registerParchment("tabletMarginBottom", "brz-mb-sm");
  registerParchment("mobileMarginBottom", "brz-mb-xs");
  registerParchment("fontStyle", "brz-tp");
  registerParchment("colorPalette", "brz-cp", "class", "inline");
  registerParchment("block-colorPalette", "brz-bcp", "class", "block");
  registerParchment("shadowColorPalette", "brz-scp", "class", "inline");
  registerParchment("prepopulation", "brz-pre-population", "class", "inline");

  registerParchment("opacity", "opacity", "style", "inline");
  registerParchment("shadow", "text-shadow", "style", "inline");
  registerParchment("populationColor", "data-color", "attribute");

  Quill.register(BackgroundImage);
  Quill.register(Population);
  Quill.register(Link);
  Quill.register(BlockColor);
  Quill.register(BlockOpacity);
  Quill.register(CustomListItem);
  Quill.register(Pre, true);
  Quill.register(DCBlock, true);
  Quill.register(BackgroundGradient, true);
}

export const Delta = Quill.import("delta");
export const Keyboard = Quill.import("modules/keyboard");
export default Quill;
