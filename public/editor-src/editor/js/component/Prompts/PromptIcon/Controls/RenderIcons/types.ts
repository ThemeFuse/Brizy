import { Props as BaseProps } from "../types";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

export type Props = Omit<BaseProps, "opened" | "onTabClick" | "onClose"> & {
  config: ConfigCommon;
};

export type CustomIconProps = Pick<
  Props,
  "name" | "type" | "typeId" | "onIconClick"
>;
