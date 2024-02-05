import { getIn } from "timm";
import { ElementModelType } from "visual/component/Elements/Types";
import { attachMenu } from "visual/editorComponents/Page/utils/helpers/normalize";
import { hexToString } from "visual/editorComponents/RichText/toolbar/utils";
import Config from "visual/global/Config";
import { copiedElementNoRefsSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import { detectOS } from "visual/utils/dom/detectOS";
import { read } from "visual/utils/reader/string";
import { Literal } from "visual/utils/types/Literal";

type CopiedElementRef = {
  path: string[];
  value: ElementModelType;
};

type InnerElementType = {
  type: string;
  value: { [key: string]: Literal };
};

export const handleRenderText = (key: string[]) => () => {
  const os = detectOS();
  const isMac = os === "MacOS";
  const nestedKeys = key.join(" + ");
  return isMac ? `⌘ + ${nestedKeys}` : `ctrl + ${nestedKeys}`;
};

export const getInnerElement = (): InnerElementType | null => {
  let copiedElement;
  const { path, value } = copiedElementNoRefsSelector(
    getStore().getState()
  ) as unknown as CopiedElementRef;

  const config = Config.getAll();

  if (value && path.length > 0) {
    copiedElement = getIn(attachMenu({ model: value, config }), path);
  }

  if (!copiedElement) return null;

  const innerElement = getIn(copiedElement, ["value", "items", 0]) as
    | InnerElementType
    | undefined;

  return innerElement ?? null;
};

export const getStyles = (
  component: InnerElementType["value"],
  prefixes: string[]
) => {
  return Object.entries(component).reduce(
    (styles: { [key: string]: Literal }, [key, value]) => {
      const hasPrefix = prefixes.some((prefix) => key.includes(prefix));

      if (hasPrefix) styles[key] = value;
      return styles;
    },
    {}
  );
};

export const convertStylesFromDCToCustom = (styles: {
  [key: string]: Literal;
}) => {
  const config = Config.getAll();
  const { bgColorPalette, bgColorOpacity, bgColorHex } = styles;

  return {
    ...styles,
    color: hexToString(
      {
        palette: read(bgColorPalette) ?? "",
        opacity: read(bgColorOpacity) ?? "",
        hex: read(bgColorHex) ?? ""
      },
      config
    )
  };
};
