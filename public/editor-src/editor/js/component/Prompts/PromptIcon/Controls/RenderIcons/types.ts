import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { Props as BaseProps } from "../types";

export type Props = Omit<BaseProps, "opened" | "onTabClick" | "onClose"> & {
  config: ConfigCommon;
};

export type CustomIconProps = Pick<
  Props,
  "name" | "type" | "typeId" | "onIconClick"
>;
