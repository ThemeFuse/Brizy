import React, { ComponentType } from "react";

interface Props {
  Component: ComponentType;
}

const NoopComponent: ComponentType = () => <></>;

export default function CustomOption(props: Props) {
  const { Component = NoopComponent } = props;

  return <Component />;
}
