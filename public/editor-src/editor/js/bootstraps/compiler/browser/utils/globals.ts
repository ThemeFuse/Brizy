import React from "react";
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";
import "../../../initBrizyGlobal";

// The ThirdParty Components are built with external React.
// We need to create the global variables.
globalThis.React = React;
globalThis.ReactDOM = ReactDOM;

// Methods from ReactDOMServer are included in ReactDOM because ReactDOMServer is marked as external in brizy-local
// and is not available on the client side.
globalThis.ReactDOM.renderToStaticMarkup = ReactDOMServer.renderToStaticMarkup;
globalThis.ReactDOM.renderToString = ReactDOMServer.renderToString;
