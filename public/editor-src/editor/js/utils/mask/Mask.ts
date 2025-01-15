import { Choice } from "visual/component/Options/types/dev/Select/types";
import { t } from "../i18n";

export const getMaskShapes = (): Choice[] => [
  { title: t("None"), value: "none" },
  { title: "", value: "circle", icon: { name: "nc-mask-shape-circle" } },
  { title: "", value: "rhombus", icon: { name: "nc-mask-shape-rhombus" } },
  { title: "", value: "star", icon: { name: "nc-mask-shape-star" } },
  { title: "", value: "flower", icon: { name: "nc-mask-shape-flower" } },
  { title: "", value: "square", icon: { name: "nc-mask-shape-square" } },
  { title: "", value: "triangle", icon: { name: "nc-mask-shape-triangle" } },
  { title: "", value: "hexagon", icon: { name: "nc-mask-shape-hexagon" } },
  { title: "", value: "blob1", icon: { name: "nc-mask-shape-blob1" } },
  { title: "", value: "blob2", icon: { name: "nc-mask-shape-blob2" } },
  { title: "", value: "blob3", icon: { name: "nc-mask-shape-blob3" } },
  { title: "", value: "blob4", icon: { name: "nc-mask-shape-blob4" } },
  { title: "", value: "brush1", icon: { name: "nc-mask-shape-brush1" } },
  { title: "", value: "brush2", icon: { name: "nc-mask-shape-brush2" } },
  { title: "", value: "brush3", icon: { name: "nc-mask-shape-brush3" } },
  { title: "", value: "brush4", icon: { name: "nc-mask-shape-brush4" } },
  { title: "", value: "poly1", icon: { name: "nc-mask-shape-poly1" } },
  { title: "", value: "poly2", icon: { name: "nc-mask-shape-poly2" } },
  { title: "", value: "poly3", icon: { name: "nc-mask-shape-poly3" } },
  { title: "", value: "poly4", icon: { name: "nc-mask-shape-poly4" } },
  { title: t("Custom"), value: "custom" }
];

export const getMaskPositions = (): Choice[] => [
  { title: t("Center Center"), value: "center center" },
  { title: t("Center Left"), value: "center left" },
  { title: t("Center Right"), value: "center right" },
  { title: t("Top Center"), value: "top center" },
  { title: t("Top Right"), value: "top right" },
  { title: t("Top Left"), value: "top left" },
  { title: t("Bottom Center"), value: "bottom center" },
  { title: t("Bottom Left"), value: "bottom left" },
  { title: t("Bottom Right"), value: "bottom right" },
  { title: t("Custom"), value: "custom" }
];

export const getMaskRepeat = (): Choice[] => [
  { title: t("No Repeat"), value: "no-repeat" },
  { title: t("Repeat"), value: "repeat" },
  { title: t("Repeat-X"), value: "repeat-x" },
  { title: t("Repeat-Y"), value: "repeat-y" },
  { title: t("Space"), value: "space" },
  { title: t("Round"), value: "round" }
];

export const getMaskSizes = (): Choice[] => [
  { title: t("Fit"), value: "contain" },
  { title: t("Fill"), value: "cover" },
  { title: t("Custom"), value: "custom" }
];
