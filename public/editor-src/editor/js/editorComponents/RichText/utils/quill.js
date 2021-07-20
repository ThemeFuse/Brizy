/* eslint-disable no-inner-declarations */
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

import PlainClipboard from "./formats/PlainClipboard";

import { blockValues, inlineValues, legacyValues } from "./transforms";

if (IS_EDITOR) {
  let Parchment = Quill.import("parchment");
  Quill.debug("error");

  function getParchment(key, prefix, type = "class", scopeType = "block") {
    const scope = {
      scope:
        scopeType === "inline" ? Parchment.Scope.INLINE : Parchment.Scope.BLOCK
    };

    switch (type) {
      case "class":
        return new Parchment.Attributor.Class(key, prefix, scope);
      case "style":
        return new Parchment.Attributor.Style(key, prefix, scope);
      default:
        return new Parchment.Attributor.Attribute(key, prefix, scope);
    }
  }

  function registerParchmentScope(values, scope) {
    Object.entries(values).forEach(([type, value]) => {
      if (value) {
        Object.entries(value).forEach(([key, { prefix }]) => {
          const parchment = getParchment(key, prefix, type, scope);

          Quill.register(parchment);
        });
      }
    });
  }

  registerParchmentScope(legacyValues, "block");
  registerParchmentScope(blockValues, "block");
  registerParchmentScope(inlineValues, "inline");

  Quill.register(
    getParchment("generated-css", "data-generated-css", "attribute")
  );
  Quill.register(getParchment("uniq-id", "data-uniq-id", "attribute"));

  Quill.register(BackgroundImage);
  Quill.register(Population);
  Quill.register(Link);
  Quill.register(BlockColor);
  Quill.register(BlockOpacity);
  Quill.register(CustomListItem);
  Quill.register(Pre, true);
  Quill.register(DCBlock, true);
  Quill.register(BackgroundGradient, true);

  Quill.register("modules/clipboard", PlainClipboard, true);
}

export const Delta = Quill.import("delta");
export const Keyboard = Quill.import("modules/keyboard");
export default Quill;
