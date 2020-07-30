import * as Color from "visual/component/Controls/ColorPickerSelect/entities";
import { Meta } from "./entities";

export const fromColorMeta = (m: Color.Meta): Meta => ({
  isChanged: m.isChanged === "select" ? "type" : m.isChanged,
  opacityDragEnd: m.opacityDragEnd
});
