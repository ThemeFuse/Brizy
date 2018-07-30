import React from "react";
import EmailApp from "../EmailApp";

const restrictions = {
  existLists: false,
  existFields: false,
  excludePages: ["list"]
};

export default props => <EmailApp {...props} restrictions={restrictions} />;
