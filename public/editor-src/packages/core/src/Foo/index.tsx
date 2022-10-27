import React, { FC } from "react";

export interface Props {
  name: string;
}

export const Foo: FC<Props> = (props) => {
  return <div>Example Component: {props.name}</div>;
};
