export interface MouseCoordinates {
  x: number;
  y: number;
}

export interface BoundsCoordinates {
  top: number | undefined;
  left: number | undefined;
}

export interface DraggableProps {
  bounds: "parent" | BoundsCoordinates;
  onDragStart: (arg: MouseCoordinates) => void;
  onDrag: (arg: MouseCoordinates) => void;
  onDragEnd: (arg: MouseCoordinates) => void;
  defaultPosition: {
    x: number;
    y: number;
  };
  position?: {
    x: number;
    y: number;
  };
}
export type Meta = {
  isChanged: "image" | "pointer";
};

export interface Props {
  src: string;
  x: number;
  y: number;
  extension: string;
  width: number;
  height: number;
  customUrl?: boolean;
  showPointer: boolean;
  fileName: string;
  onChange: (value: MouseCoordinates, meta: Meta) => void;
}
