import React, { type JSX } from "react";
import { useThirdParty } from "visual/editorComponents/tools/ThirdPartyContext/useThirdParty";
import Items from "../Items";
import type { ContainerProps } from "../types";

export function Container(props: ContainerProps): JSX.Element {
  const { editorProps } = useThirdParty();
  const { acceptedElements, className } = props;
  return (
    <Items
      {...editorProps}
      acceptedElements={acceptedElements}
      className={className}
    />
  );
}
