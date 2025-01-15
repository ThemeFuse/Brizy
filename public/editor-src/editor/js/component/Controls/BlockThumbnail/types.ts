import { JSX } from "react";
import { ElementModelType2 } from "visual/component/Elements/Types";
import { Block } from "visual/types";

export interface ThumbnailImage {
  blockData: Block;
}

export interface AnchorInputProps {
  value: string;
  onChange: (e: string) => void;
  id: string;
}

export interface ThumbnailLabelProps {
  helper?: boolean;
  helperContent?: string;
  label?: JSX.Element;
}

export interface ThumbnailsProps extends Common {
  blocks: PreloadThumbnailProps[];
  value: string;
  anchorInputs: AnchorInput[];
}

interface PreloadThumbnailProps {
  blockId: string;
  type: string;
  value: {
    items?: ElementModelType2[];
    _blockVisibility?: string;
    _id: string;
  };
}

export interface AnchorInput {
  id: string;
  value?: string;
}

export interface ThumbnailBlockWithInput extends Common {
  id: string;
  block: Block;
  className?: string;
  inputValue: string;
}

interface Common {
  onClick: (id: string) => void;
  onChange: (value: string, id: string) => void;
}

interface Config {
  className: string;
  attr?: {
    className?: string;
  };
  helper?: boolean;
  helperContent?: string;
}

export interface ThumbnailSelectorProps
  extends Config,
    ThumbnailLabelProps,
    ThumbnailsProps {
  label?: JSX.Element;
}
