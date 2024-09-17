import { JSX } from "react";

export interface Props {
  data: { name: string; title: string; value: string }[];
  onChange: (p1: string, p2: string) => void;
}
export interface Description {
  children: JSX.Element;
}
