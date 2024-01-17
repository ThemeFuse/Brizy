import type { ComponentProps } from "react";
import UIState from "visual/global/UIState";
import type { PromptKey, PromptTypes, PromptsMode } from ".";

export const Prompt = {
  open<K extends PromptKey>(data: {
    prompt: K;
    mode: PromptsMode;
    props?: ComponentProps<PromptTypes[K]>;
  }): void {
    UIState.set("prompt", data);
  },
  close(promptName: PromptKey) {
    UIState.set("closePrompt", promptName);
  }
};
