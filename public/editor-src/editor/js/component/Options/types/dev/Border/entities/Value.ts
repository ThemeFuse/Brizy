import { Style } from "visual/component/Options/types/dev/Border/entities/style";
import { Palette } from "visual/component/Options/types/dev/ColorPicker/entities/palette";
import { WidthType } from "visual/component/Options/types/dev/Border/entities/widthType";
import { Hex } from "visual/utils/color/Hex";
import { Opacity } from "visual/utils/cssProps/opacity";
import { Width } from "visual/component/Options/types/dev/Border/entities/width";

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
