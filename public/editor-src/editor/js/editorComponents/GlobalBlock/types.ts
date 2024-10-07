import { ConnectedProps } from "react-redux";
import { ElementModel } from "visual/component/Elements/Types";
import { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import { WithClassName } from "visual/types/attributes";
import { connector } from "./connector";

export type Value = ElementModel;

export interface OwnProps extends WithClassName {
  meta: ComponentsMeta;
  attributes: Record<string, string | number>;
}

type ConnectorProps = ConnectedProps<typeof connector>;
export type Props = ConnectorProps & OwnProps;
