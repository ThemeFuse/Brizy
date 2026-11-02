import type { ConnectedProps } from "react-redux";
import type { ElementModel } from "visual/component/Elements/Types";
import type { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import type { WithClassName } from "visual/types/attributes";
import type { connector } from "./connector";

export type Value = ElementModel;

export interface OwnProps extends WithClassName {
  meta: ComponentsMeta;
  attributes: Record<string, string | number>;
}

type ConnectorProps = ConnectedProps<typeof connector>;
export type Props = ConnectorProps & OwnProps;
