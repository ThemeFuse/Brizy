import { ScrollbarProps } from "react-custom-scrollbars";

export interface Props {
  autoHeightMax?: ScrollbarProps["autoHeightMax"];
  theme: "dark" | "light";
  children: React.ReactNode;
}
