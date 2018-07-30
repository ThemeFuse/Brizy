import React from "react";
import EmailApp from "../EmailApp";

const restrictions = {
  maxFields: 30
};

export default props => <EmailApp {...props} restrictions={restrictions} />;
