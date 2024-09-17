import { KenEffect } from "visual/component/Background/type";
import { defaultValueValue } from "visual/utils/onChange";
import { CSSValue } from "../style2/types";

export const cssStyleBgMediaSlideshow = ({ v, device }: CSSValue): string => {
  const display =
    defaultValueValue({ v, key: "media", device }) === "slideshow"
      ? "block"
      : "none";
  return `display: ${display};`;
};

export const cssStyleBgSlideshowKenBurnsEffectStart = ({
  v
}: CSSValue): string => {
  const { kenBurnsEffect, slideshowTransitionType: effect } = v;

  if (kenBurnsEffect !== KenEffect.Out) return "";

  const rotate = effect === "slide-down" ? "rotate(180deg)" : "";

  return `transform: scale(1.3) ${rotate};`;
};

export const cssStyleBgSlideshowKenBurnsEffectEnd = ({
  v
}: CSSValue): string => {
  const { kenBurnsEffect, slideshowTransitionType: effect } = v;

  if (kenBurnsEffect === KenEffect.Off) return "";

  const scale = kenBurnsEffect === KenEffect.Out ? "scale(1)" : "scale(1.3)";
  const rotate = effect === "slide-down" ? "rotate(180deg)" : "";

  return `transform:${scale} ${rotate};`;
};

export function cssStyleBgSlideshowPosition({ v, device }: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const bgPosition = dvv("bgPosition");

  return `background-position: ${bgPosition};`;
}
