import React from "react";

export default function CustomOption(props) {
  const { Component } = props;

  return <Component />;
}

CustomOption.defaultProps = {
  Component: () => {}
};
