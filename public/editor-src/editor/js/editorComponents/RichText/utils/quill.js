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

  // is using for old projects. Quill will remove this classNames
  // if they wouldn't be added here
  registerParchment("fontStyle", "brz-tp");

  registerParchment("newFontStyle", "brz-tp-lg");
  registerParchment("tabletFontStyle", "brz-tp-sm");
  registerParchment("mobileFontStyle", "brz-tp-xs");

  registerParchment("fontFamily", "brz-ff");
  registerParchment("fontFamilyType", "brz-ft");

  registerParchment("fontSize", "brz-fs-lg");
  registerParchment("tabletFontSize", "brz-fs-sm");
  registerParchment("mobileFontSize", "brz-fs-xs");

  registerParchment("fontSizeSuffix", "brz-fss-lg");
  registerParchment("tabletFontSizeSuffix", "brz-fss-sm");
  registerParchment("mobileFontSizeSuffix", "brz-fss-xs");

  registerParchment("fontWeight", "brz-fw-lg");
  registerParchment("tabletFontWeight", "brz-fw-sm");
  registerParchment("mobileFontWeight", "brz-fw-xs");

  registerParchment("lineHeight", "brz-lh-lg");
  registerParchment("tabletLineHeight", "brz-lh-sm");
  registerParchment("mobileLineHeight", "brz-lh-xs");

  registerParchment("letterSpacing", "brz-ls-lg");
  registerParchment("tabletLetterSpacing", "brz-ls-sm");
  registerParchment("mobileLetterSpacing", "brz-ls-xs");

  registerParchment("desktopHorizontalAlign", "brz-text-lg");
  registerParchment("tabletHorizontalAlign", "brz-text-sm");
  registerParchment("mobileHorizontalAlign", "brz-text-xs");

  registerParchment("desktopMarginTop", "brz-mt-lg");
  registerParchment("tabletMarginTop", "brz-mt-sm");
  registerParchment("mobileMarginTop", "brz-mt-xs");

  registerParchment("desktopMarginBottom", "brz-mb-lg");
  registerParchment("tabletMarginBottom", "brz-mb-sm");
  registerParchment("mobileMarginBottom", "brz-mb-xs");

  registerParchment("block-colorPalette", "brz-bcp", "class", "block");
  registerParchment("colorPalette", "brz-cp", "class", "inline");
  registerParchment("shadowColorPalette", "brz-scp", "class", "inline");

  registerParchment("populationColor", "data-color", "attribute");
  registerParchment("prepopulation", "brz-pre-population", "class", "inline");

  registerParchment("capitalize", "brz-capitalize", "class", "inline");
  registerParchment("opacity", "opacity", "style", "inline");
  registerParchment("shadow", "text-shadow", "style", "inline");

  registerParchment("intermediateTabletFontSize", "brz-fs-sm-im");
  registerParchment("intermediateMobileFontSize", "brz-fs-xs-im");

  registerParchment("intermediateTabletFontSizeSuffix", "brz-fs-s-sm-im");
  registerParchment("intermediateMobileFontSizeSuffix", "brz-fs-s-xs-im");

  registerParchment("intermediateTabletLineHeight", "brz-lh-sm-im");
  registerParchment("intermediateMobileLineHeight", "brz-lh-xs-im");

  registerParchment("intermediateTabletWeight", "brz-fw-sm-im");
  registerParchment("intermediateMobileWeight", "brz-fw-xs-im");

  registerParchment("intermediateTabletLetterSpacing", "brz-ls-sm-im");
  registerParchment("intermediateMobileLetterSpacing", "brz-ls-xs-im");

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
