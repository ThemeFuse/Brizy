import React from "react";
import EmailApp from "../EmailApp";

const restrictions = {
  existLists: false,
  maxFields: 0,
  excludePages: ["list"]
};

export default props => <EmailApp {...props} restrictions={restrictions} />;
