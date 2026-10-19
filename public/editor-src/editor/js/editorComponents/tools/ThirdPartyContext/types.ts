import type { ElementModel } from "visual/component/Elements/Types";
import type { Props as EdProps } from "visual/editorComponents/EditorComponent";

export type ThirdPartyContextType = {
  // biome-ignore lint/suspicious/noExplicitAny: migrated from eslint
  editorProps: EdProps<ElementModel, Record<string, any>>;
};

export interface Props {
  // biome-ignore lint/suspicious/noExplicitAny: migrated from eslint
  editorProps: EdProps<ElementModel, Record<string, any>>;
  children: React.ReactNode;
}
