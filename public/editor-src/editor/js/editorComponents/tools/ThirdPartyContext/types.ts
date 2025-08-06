import { ElementModel } from "visual/component/Elements/Types";
import { Props as EdProps } from "visual/editorComponents/EditorComponent";

export type ThirdPartyContextType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editorProps: EdProps<ElementModel, Record<string, any>>;
};

export interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editorProps: EdProps<ElementModel, Record<string, any>>;
  children: React.ReactNode;
}
