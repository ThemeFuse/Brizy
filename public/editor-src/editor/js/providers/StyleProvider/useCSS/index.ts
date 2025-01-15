import { useStyleProvider } from "visual/providers/StyleProvider";
import { OutputStyle } from "visual/utils/cssStyle/types";
import { MValue } from "visual/utils/value";
import { createCache, createSheet } from "../Sheet";

interface Props {
  id: string;
  componentId: string;
  css: Array<string>;
}

const isCSSOutput = (css: Array<string>): css is OutputStyle =>
  css.length === 3;

export const useCSS = (props: Props): MValue<string> => {
  const { sheet } = useStyleProvider();
  const { id, componentId, css } = props;

  // Specific Case when we need to add or not css by some option
  if (isCSSOutput(css)) {
    const cache = createCache({ id, componentId, sheet });
    const { className } = createSheet({ cache, css });

    return className;
  }

  return undefined;
};
