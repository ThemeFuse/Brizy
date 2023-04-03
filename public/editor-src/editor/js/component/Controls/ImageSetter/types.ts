import { Meta } from "visual/component/Controls/ImageSetter/index.cloud";

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

export interface ImageProps {
  src: string;
  x: number;
  y: number;
  extension: string;
  width: number;
  height: number;
  customUrl?: boolean;
  showPointer: boolean;
  onChange: (value: MouseCoordinates, meta: Meta) => void;
}
