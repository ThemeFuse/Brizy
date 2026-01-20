import parchment from "parchment";
import Attributor from "parchment/dist/src/attributor/attributor";
import ClassAttributor from "parchment/dist/src/attributor/class";
import StyleAttributor from "parchment/dist/src/attributor/style";
import Quill from "quill";
import { GetConfig } from "visual/providers/ConfigProvider/types";
import { RenderType, isEditor } from "visual/providers/RenderProvider";
import { getBackgroundGradient } from "./formats/BackgroundGradient";
import { getBackgroundImage } from "./formats/BackgroundImage";
import BlockColor from "./formats/BlockColor";
import BlockOpacity from "./formats/BlockOpacity";
import CustomListItem from "./formats/CustomListItem";
import DCBlock from "./formats/DCBlock";
import Link from "./formats/Link";
import PlainClipboard from "./formats/PlainClipboard";
import Population from "./formats/Population";
import Pre from "./formats/Pre";
import { getTextBackgroundGradient } from "./formats/TextBackgroundGradient";
import Tooltip from "./formats/Tooltip";
import { blockValues, inlineValues, legacyValues } from "./transforms";
import { Values } from "./transforms/defaultValues";

type Attributors = ClassAttributor | StyleAttributor | Attributor;
type P = typeof parchment;
type Scope = "block" | "inline";

function getQuill(renderContext: RenderType, getConfig: GetConfig) {
  if (isEditor(renderContext)) {
    const Parchment: P = Quill.import("parchment");
    Quill.debug("error");

    function getParchment(
      key: string,
      prefix: string,
      type = "class",
      scopeType: Scope = "block"
    ): Attributors {
      const scope = {
        scope:
          scopeType === "inline"
            ? Parchment.Scope.INLINE
            : Parchment.Scope.BLOCK
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

    function registerParchmentScope(values: Values, scope: Scope): void {
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

    Quill.register(getBackgroundImage(getConfig));
    Quill.register(Population);
    Quill.register(Link);
    Quill.register(BlockColor);
    Quill.register(BlockOpacity);
    Quill.register(CustomListItem);
    Quill.register(Pre, true);
    Quill.register(DCBlock, true);
    Quill.register(getBackgroundGradient(getConfig), true);
    Quill.register(getTextBackgroundGradient(getConfig), true);
    Quill.register(Tooltip, true);

    Quill.register("modules/clipboard", PlainClipboard, true);
  }

  return Quill;
}

export default getQuill;

export const Delta = Quill.import("delta");
export const Keyboard = Quill.import("modules/keyboard");
export const Parchment = Quill.import("parchment");
