import {
  WithClassName,
  WithId,
  WithOnChange
} from "visual/utils/options/attributes";

export interface UploadData {
  name: string;
  fileName: string;
  uid: string;
  width: number;
  height: number;
}

export interface Props
  extends WithOnChange<Promise<UploadData>[]>,
    WithClassName {
  allowedExtensions: string[];
}

export interface SelectionData<T> extends WithId<T> {
  attributes: {
    filename: string;
  };
}
