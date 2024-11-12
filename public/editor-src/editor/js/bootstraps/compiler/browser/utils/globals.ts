import React from "react";
import ReactDOM from "react-dom";
import "../../../initBrizyGlobal";

// The ThirdParty Components are built with external React.
// We need to create the global variables.
globalThis.React = React;
globalThis.ReactDOM = ReactDOM;
