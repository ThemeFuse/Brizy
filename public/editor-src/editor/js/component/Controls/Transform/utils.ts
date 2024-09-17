import { t } from "visual/utils/i18n";
import { FCC } from "visual/utils/react/types";
import { MValue } from "visual/utils/value";
import { Flip } from "./components/Flip";
import { Offset } from "./components/Offset";
import { Rotate } from "./components/Rotate";
import { Scale } from "./components/Scale";
import { Skew } from "./components/Skew";
import { EffectProps } from "./types/EffectProps";
import { Effect, EffectValue } from "./types/Value";

type TransformComponent = FCC<EffectProps<EffectValue<Effect>>>;

export function getEffectComponent(e: Effect): TransformComponent {
  switch (e) {
    case "rotate":
      return Rotate as TransformComponent;
    case "offset":
      return Offset as TransformComponent;
    case "skew":
      return Skew as TransformComponent;
    case "scale":
      return Scale as TransformComponent;
    case "flip":
      return Flip as TransformComponent;
  }
}

export const getEffectIcon = (effect: Effect): string => {
  switch (effect) {
    case "rotate":
      return "nc-captcha";
    case "offset":
      return "nc-offset";
    case "skew":
      return "nc-skew";
    case "scale":
      return "nc-scale";
    case "flip":
      return "nc-flip";
  }
};

export const getEffectTitle = (effect: Effect): string => {
  switch (effect) {
    case "rotate":
      return t("Rotate");
    case "offset":
      return t("Offset");
    case "skew":
      return t("Skew");
    case "scale":
      return t("Scale");
    case "flip":
      return t("Flip");
  }
};

export const effects: Effect[] = ["rotate", "offset", "skew", "scale", "flip"];

export const isActive = (v: unknown): v is Effect =>
  effects.includes(v as Effect);

export const hasAnchorPoint = (active: MValue<Effect>): boolean => {
  switch (active) {
    case "flip":
    case "rotate":
    case "scale": {
      return true;
    }
  }

  return false;
};
