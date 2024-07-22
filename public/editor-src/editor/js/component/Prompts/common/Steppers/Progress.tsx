import classnames from "classnames";
import React, { ReactElement } from "react";
import { FCC } from "visual/utils/react/types";

type ProgressProps = {
  stage?: string;
};

const Progress: FCC<ProgressProps> = (props) => {
  const { stage, children } = props;

  return (
    <div className="brz-ed-popup-integrations__progress">
      {React.Children.map(children, (child) => {
        return child && React.cloneElement(child as ReactElement, { stage });
      })}
    </div>
  );
};

export default Progress;

type StageProps = {
  stage?: string;
  num?: string;
  text?: string;
  img?: string;
};

export const Stage = ({ stage, num, text, img }: StageProps): ReactElement => {
  const className = classnames("brz-ed-popup-integrations__progress-stage", {
    "brz-ed-popup-integrations__progress-stage--active": num === stage
  });

  return (
    <div className={className}>
      <span className="brz-span">
        {img && <img className="brz-img" src={img} alt="Logo" />}
        {text}
      </span>
    </div>
  );
};
