type PositionState = "above" | "below";

let positionState: PositionState = "above";

export const getPosition = (): PositionState => positionState;

export const setPosition = (p: PositionState): void => {
  positionState = p;
};
