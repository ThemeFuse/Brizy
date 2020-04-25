import React, { ReactElement } from "react";
import classnames from "classnames";

type ProgressProps = {
  stage?: string;
};

const Progress: React.FC<ProgressProps> = props => {
  const { stage, children } = props;

  return (
    <div className="brz-ed-popup-integrations__progress">
      {React.Children.map(children, (child: unknown) => {
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

export const Stage: React.FC<StageProps> = ({ stage, num, text, img }) => {
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
