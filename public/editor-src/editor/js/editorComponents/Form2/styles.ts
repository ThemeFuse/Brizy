import { isStory } from "visual/providers/EditorModeProvider";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import type { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import type { Value } from "./types";

export function styleForm(data: DynamicStylesProps<Value>): OutputStyle {
  const _isStory = isStory(data.contexts.mode);

  const styles: Styles = {
    ".brz &&": {
      standart: [...(_isStory ? ["cssStyleSizeWidthStoryOnly"] : [])]
    },
    ".brz && .brz-form": {
      standart: ["cssStyleElementForm2Margin"]
    },
    ".brz && .brz-form-ms-buttons": {
      standart: [
        "cssStyleElementForm2Padding",
        "cssStyleElementForm2MSButtonsSpacing"
      ]
    },
    ".brz && .brz-forms2__item": {
      standart: ["cssStyleElementForm2Padding"]
    },
    ".brz && .brz-forms2__item-button": {
      standart: ["cssStyleMarginAlign", "cssStyleElementForm2SubmitWidth"]
    },
    ".brz && .brz-forms2-story .brz-btn:before, .brz && .brz-form-ms-buttons--story .brz-btn:before":
      {
        standart: ["cssStyleElementForm2StoryButtonHeight"]
      },
    ".brz && .brz-form-ms-indicators": {
      standart: ["cssStyleElementForm2MSProgressMargin"]
    },
    ".brz && .brz-form-ms-next-button, .brz && .brz-form-ms-prev-button, .brz && .brz-form-ms-buttons .brz-forms2__item-button":
      {
        standart: ["cssStyleElementForm2MSButtonsAlign"]
      }
  };

  return renderStyles({ ...data, styles });
}
