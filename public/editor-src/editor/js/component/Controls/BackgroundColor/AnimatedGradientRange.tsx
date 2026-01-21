import { Num } from "@brizy/readers";
import classNames from "classnames";
import { HandleProps as ControlHandleProps, Handle, Range } from "rc-slider";
import React, {
  MouseEvent,
  ReactElement,
  ReactNode,
  useCallback,
  useMemo,
  useRef
} from "react";
import { hexToRgb } from "visual/utils/color";
import { roundTo } from "visual/utils/math";
import { GradientStop } from "./entities";

type HandleProps = ControlHandleProps & {
  index: number;
  dragging: boolean;
};

export type Props = {
  stops: GradientStop[];
  activeStopIndex: number;
  onStopsChange: (stops: GradientStop[]) => void;
  onActiveStopChange: (index: number) => void;
  onStopAdd?: (
    position: number,
    color: { hex: string; opacity: number; palette: string }
  ) => void;
};

const MAX_STOPS = 5;

export const AnimatedGradientRange = ({
  stops,
  activeStopIndex,
  onStopsChange,
  onActiveStopChange,
  onStopAdd
}: Props): ReactElement => {
  const railRef = useRef<HTMLDivElement>(null);

  // Assume stops come in sorted order from parent (rc-slider maintains sorted order)
  const values = useMemo(() => stops.map((stop) => stop.position), [stops]);

  const gradientString = useMemo(
    () => stops.map((stop) => stop.hex).join(", "),
    [stops]
  );

  const hexToRgbTuple = useCallback((hex: string): [number, number, number] => {
    const rgb = hexToRgb(hex);
    if (!rgb) {
      return [0, 0, 0];
    }
    const [r, g, b] = rgb.split(",").map((channel) => Num.read(channel.trim()));
    return [r ?? 0, g ?? 0, b ?? 0];
  }, []);

  // Get color at a specific position by interpolating between stops
  const getColorAtPosition = useCallback(
    (position: number): { hex: string; opacity: number; palette: string } => {
      if (stops.length === 0) {
        return { hex: "#000000", opacity: 1, palette: "" };
      }

      // Find the two stops that bracket this position
      let leftStop = stops[0];
      let rightStop = stops[stops.length - 1];

      for (let i = 0; i < stops.length - 1; i++) {
        if (
          position >= stops[i].position &&
          position <= stops[i + 1].position
        ) {
          leftStop = stops[i];
          rightStop = stops[i + 1];
          break;
        }
      }

      // If position is exactly on a stop, return that stop's color
      const exactStop = stops.find(
        (s) => Math.abs(s.position - position) < 0.1
      );
      if (exactStop) {
        return {
          hex: exactStop.hex,
          opacity: exactStop.opacity,
          palette: exactStop.palette
        };
      }

      // Interpolate between left and right stops
      const range = rightStop.position - leftStop.position;
      const t = range > 0 ? (position - leftStop.position) / range : 0;

      const [r1, g1, b1] = hexToRgbTuple(leftStop.hex);
      const [r2, g2, b2] = hexToRgbTuple(rightStop.hex);

      const r = Math.round(r1 + (r2 - r1) * t);
      const g = Math.round(g1 + (g2 - g1) * t);
      const b = Math.round(b1 + (b2 - b1) * t);
      const opacity = roundTo(
        leftStop.opacity + (rightStop.opacity - leftStop.opacity) * t,
        2
      );

      const hex = `#${[r, g, b]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("")}`;

      return {
        hex,
        opacity,
        palette: leftStop.palette
      };
    },
    [stops, hexToRgbTuple]
  );

  const handleRailMouseDown = useCallback(
    (e: MouseEvent<HTMLDivElement>): void => {
      if (
        !onStopAdd ||
        e.button !== 0 ||
        stops.length >= MAX_STOPS ||
        !railRef.current
      ) {
        return;
      }

      const clientX = e.clientX;

      const rect = railRef.current.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      const percentage = Math.round((relativeX / rect.width) * 100);
      const position = Math.max(0, Math.min(100, percentage));

      const tooClose = stops.some(
        (stop) => Math.abs(stop.position - position) < 2
      );
      if (tooClose) {
        return;
      }

      const color = getColorAtPosition(position);
      onStopAdd(position, color);
    },
    [onStopAdd, stops, getColorAtPosition]
  );

  const handleChange = useCallback(
    (newValues: number[]): void => {
      // rc-slider returns values in sorted order, update stops accordingly
      const updatedStops = stops.map((stop, index) => ({
        ...stop,
        position: newValues[index] ?? stop.position
      }));
      // Return stops (rc-slider maintains sorted order)
      onStopsChange(updatedStops);
    },
    [stops, onStopsChange]
  );

  const handle = (props: unknown): ReactNode => {
    const {
      className,
      index,
      // we need to ignore this prop
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      dragging,
      ...other
    } = props as HandleProps;

    // Index matches stops array (assumed sorted)
    const isActive = index === activeStopIndex;

    const _className = classNames(className, {
      "brz-ed-rc-slider-handle": true,
      "brz-ed-rc-slider-handle--active": isActive
    });

    return (
      <Handle
        {...other}
        key={index}
        className={_className}
        style={{
          zIndex: 1000
        }}
        // @ts-expect-error: missing props onMouseDown in ts
        onMouseDown={(): void => {
          if (index >= 0 && index < stops.length) {
            onActiveStopChange(index);
          }
        }}
      />
    );
  };

  const isMaxStopsReached = stops.length >= MAX_STOPS;

  return (
    <div className="brz-ed-control__animated-gradient-range">
      <div ref={railRef} className="brz-ed-control__range">
        <Range
          value={values}
          min={0}
          max={100}
          step={1}
          allowCross={false}
          railStyle={{
            backgroundImage: `linear-gradient(to right, ${gradientString})`
          }}
          handle={handle}
          onChange={handleChange}
        />
        {!isMaxStopsReached && (
          <div
            className="brz-ed-control__animated-gradient-range__add-stop"
            onMouseDown={handleRailMouseDown}
          />
        )}
      </div>
    </div>
  );
};
