import { Props as BaseProps } from "../types";

export type Props = Omit<BaseProps, "opened" | "onTabClick" | "onClose">;

export type CustomIconProps = Pick<
  Props,
  "name" | "type" | "typeId" | "onIconClick"
>;
