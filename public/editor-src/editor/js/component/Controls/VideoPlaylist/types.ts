import { MouseEventHandler, Attributes } from "react";

interface BaseProps {
  coverImageSrc?: string;
  videoSrc: string;
  attributes: Attributes;
}

export interface ControlProps {
  hasUnmuteIcon: boolean;
  hasPauseIcon: boolean;
}

export interface VideoProps extends BaseProps, ControlProps {
  start: number;
  end: number;
  controls: "on" | "off";
  loop: "on" | "off";
  type: string;
  handleCoverIconClick: MouseEventHandler<HTMLElement>;
}

export type ExternalVideoEdit = Pick<
  VideoProps,
  "coverImageSrc" | "videoSrc" | "attributes" | "handleCoverIconClick"
>;

export interface SidebarProps extends BaseProps {
  title: string;
  subTitle: string;
  coverUrl: string;
  imgHref: string;
  className?: string;
  type: string;
  onClick: MouseEventHandler<HTMLElement>;
  handleTitleChange: (title: string) => void;
  handleSubtitleChange: (subTitle: string) => void;
}

export interface CoverProps {
  attributes: Attributes;
  handleCoverIconClick: VideoProps["handleCoverIconClick"];
}
