import { ReactNode } from "react";

export interface PromptViewProp {
  img: string;
  title: string;
  description: ReactNode;
  onClickSave: VoidFunction;
  onClickCancel: VoidFunction;
  isSaving: boolean;
  isCanceling: boolean;
  error?: string | null;
  children?: ReactNode;
}
