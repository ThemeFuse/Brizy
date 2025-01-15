import { Prompt } from "visual/component/Prompts/api";
import {
  ConfigCommon,
  LeftSidebarMoreOptionsIds
} from "visual/global/Config/types/configs/ConfigCommon";
import { Option } from "./index";

export const getMoreOptions = (ui: ConfigCommon["ui"]): Array<Option> => {
  const { leftSidebar = {} } = ui ?? {};
  const { options = [] } = leftSidebar.more ?? {};

  const _options: Array<Option> = [];

  if (options.length) {
    options.forEach((option) => {
      if (option.type === LeftSidebarMoreOptionsIds.shortcuts) {
        _options.push({
          ...option,
          id: option.type,
          onClick: (e: MouseEvent): void => {
            e.preventDefault();

            Prompt.open({
              mode: "stack",
              prompt: "keyHelper"
            });
          }
        });
      } else {
        _options.push({ ...option, id: option.type });
      }
    });
  }

  return _options;
};
