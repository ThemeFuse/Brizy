import { Props as OptionProps } from "visual/component/Options/Type";
import { SimpleValue } from "visual/component/Options/Type";
import { WithConfig } from "visual/types/attributes";
import { ElementModelType2 } from "visual/component/Elements/Types";

interface GlobalBlockData extends PreloadThumbnailProps {
  _id: string;
}

export interface GlobalBlocks {
  [key: string]: {
    data: GlobalBlockData;
  };
}

interface Config {
  className: string;
  attr?: {
    className?: string;
  };
  helper?: boolean;
  helperContent?: string;
}

export interface Props
  extends OptionProps<SimpleValue<string>>,
    WithConfig<Config> {
  display: "block" | "inline";
}

export interface PreloadThumbnailProps {
  blockId: string;
  type: string;
  value: {
    items?: ElementModelType2[];
    _blockVisibility?: string;
    _id: string;
  };
}
