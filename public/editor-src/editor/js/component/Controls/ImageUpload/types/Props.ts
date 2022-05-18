import { WithClassName, WithOnChange } from "visual/utils/options/attributes";

export interface UploadData {
  name: string;
}

export interface Props
  extends WithOnChange<Promise<UploadData>[]>,
    WithClassName {
  allowedExtensions: string[];
}
