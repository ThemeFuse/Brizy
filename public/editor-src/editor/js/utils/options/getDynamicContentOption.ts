import { DCGroup } from "visual/global/Config/types/DynamicContent";
import { MValue } from "visual/utils/value";
import {
  Choice,
  OptGroup,
  getDynamicContentChoices
} from "./getDynamicContentChoices";
import { getDynamicContentHandler } from "./getDynamicContentHandler";
import { TypeChoices } from "./types";

interface Base {
  show?: boolean;
  iconOnly?: boolean;
}

interface Handler extends Base {
  handlerChoices: (
    resolve: (r: string) => void,
    reject: (r: string) => void
  ) => void;
}

interface Choices extends Base {
  choices: Array<Choice | OptGroup>;
}

interface Data {
  options?: DCGroup<"wp"> | DCGroup<"cloud">;
  type: TypeChoices;
  config?: {
    iconOnly?: boolean;
    show?: boolean;
    mockValue?: boolean;
  };
}

export const getDynamicContentOption = (
  data: Data
): MValue<Handler | Choices> => {
  const { options, type, config } = data;

  if (!options) {
    return undefined;
  }

  const dcHandler = getDynamicContentHandler(options, type);

  if (typeof dcHandler === "function") {
    return {
      ...config,
      handlerChoices: dcHandler
    };
  }

  const dcChoices = getDynamicContentChoices(options, type);

  if (dcChoices.length > 0) {
    return {
      ...config,
      show: config?.show && dcChoices.length > 0,
      choices: dcChoices
    };
  }
};
