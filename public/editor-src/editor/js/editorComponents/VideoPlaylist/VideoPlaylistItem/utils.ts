import { makeDataAttr } from "visual/utils/i18n/attribute";
import { Attributes } from "react";

interface SidebarProps {
  videoSrc: string;
  start: number;
  end: number;
  loop: "on" | "off";
  controls: "on" | "off";
}

export const getVideoAttributes = ({
  videoSrc,
  start,
  end,
  loop,
  controls
}: SidebarProps): Attributes => {
  const attributes = [
    { name: "link", value: videoSrc },
    { name: "start", value: start },
    { name: "end", value: end },
    { name: "loop", value: loop },
    { name: "controls", value: controls }
  ];

  return Object.assign({}, ...attributes.map(makeDataAttr));
};
