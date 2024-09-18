import { BaseKey } from "visual/component/Prompts/common/GlobalApps/BaseApp";

export interface Error {
  error: string | null;
}

export interface OnBeforeLoadProps {
  onChangeNext: (_nextStage?: BaseKey) => void;
}

export interface Typekit {
  typekit: string;
}
