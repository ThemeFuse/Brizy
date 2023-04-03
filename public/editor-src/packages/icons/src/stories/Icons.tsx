import React from "react";
import * as Icns from "../index";
import "./icons.css";

export const Icons = () => {
  return (
    <div className={"icons-wrapper"}>
      {Object.entries(Icns).map(([name, Component]) => (
        <div key={name} className={"iconBox"}>
          <div>
            <Component />
            <div className={"iconName"}>{name}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
