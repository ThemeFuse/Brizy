/**
 * Creates a React <Profiler> onRender callback that emits
 * performance.measure() entries for slow renders.
 *
 * The MeasureCollector in @brizy/perf-monitor picks these up
 * and forwards them to SigNoz as `editor.measure` spans.
 *
 * @param thresholdMs — skip renders faster than this (default: 16ms = 1 frame)
 */
export function createProfilerMeasure(thresholdMs = 16) {
  return (
    id: string,
    phase: "mount" | "update" | "nested-update",
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number
  ): void => {
    if (actualDuration < thresholdMs) return;

    try {
      performance.measure(`⚛ ${id} (${phase})`, {
        start: startTime,
        end: commitTime,
        detail: {
          profiler: id,
          phase,
          actualDuration: Math.round(actualDuration * 100) / 100,
          baseDuration: Math.round(baseDuration * 100) / 100
        }
      });
    } catch {
      // older browsers may not support measure with options
    }
  };
}
