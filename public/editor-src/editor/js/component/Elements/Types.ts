export type ElementModel = {
  _id?: string;
  items?: Array<ElementModelType>;
  [k: string]: unknown;
};

export interface ElementModelType {
  type: string;
  value: ElementModel;
}

export interface ElementDefaultValue {
  content?: {
    items?: Array<ElementModelType>;
    popups?: Array<ElementModelType>;

    // These keys must count all keys about images uid actually,
    // the keys is terminated with `Src` example bgImageSrc, imageSrc
    images?: Record<string, unknown>;

    [k: string]: unknown;
  };

  style?: {
    // These keys must count all keys about families name actually,
    // the keys is terminated with `Family` example fontFamily, titleFamily
    families?: Record<string, unknown>;
    [k: string]: unknown;
  };

  toolbar?: Record<string, unknown>;

  link?: Record<string, unknown>;

  [k: string]: unknown;
}
