import { Hex } from "visual/utils/color/Hex";
import { Opacity } from "visual/utils/cssProps/opacity";
import { Style } from "visual/utils/options/Border/entities/style";
import { Width } from "visual/utils/options/Border/entities/width";
import { WidthType } from "visual/utils/options/Border/entities/widthType";
import { Palette } from "visual/utils/options/ColorPicker/entities/palette";

export interface Value {
  style: Style;
  tempStyle: Style;
  hex: Hex;
  opacity: Opacity;
  tempOpacity: Opacity;
  palette: Palette;
  tempPalette: Palette;
  widthType: WidthType;
  width: Width;
  tempWidth: Width;
  topWidth: Width;
  tempTopWidth: Width;
  rightWidth: Width;
  tempRightWidth: Width;
  bottomWidth: Width;
  tempBottomWidth: Width;
  leftWidth: Width;
  tempLeftWidth: Width;
}
