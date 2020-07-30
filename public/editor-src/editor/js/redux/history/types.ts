// temporary stub type until we migrate all our redux stuff to TS
export type Reducer<State, Action> = (state: State, action: Action) => State;

export type UnknownDict = { [k: string]: unknown };

export type HistoryEnhancerState<
  State extends UnknownDict,
  TrackedKeys extends keyof State
> = State & {
  history: {
    currSnapshot: { [k in TrackedKeys]: State[k] } | null;
    prevSnapshot: { [k in TrackedKeys]: State[k] } | null;
    canUndo: boolean;
    canRedo: boolean;
  };
};

export type HistoryEnhancerConfig<
  State extends UnknownDict,
  TrackedKeys extends keyof State
> = {
  keysToTrack: TrackedKeys[];
  maxSize?: number;
  collapseFrequency?: number;
  onBeforeUpdate?: <Action>(
    state: State,
    action: Action,
    history: History<{ [k in TrackedKeys]: State[k] }>
  ) => void;
};

export const UNDO = "UNDO";
export const REDO = "REDO";

export type UndoAction = {
  type: typeof UNDO;
};

export type RedoAction = {
  type: typeof REDO;
};

export class History<Snapshot extends UnknownDict> {
  private snapshots: (Snapshot | null)[] = [];

  private config: {
    maxSize: number;
    collapseFrequency: number;
  } = {
    maxSize: 10,
    collapseFrequency: 2000
  };

  private currentIndex = -1;

  private previousIndex = -1;

  private lastSnapshotTimestamp = 0;

  private canUndo_ = false;

  private canRedo_ = false;

  constructor(config?: { maxSize: number; collapseFrequency: number }) {
    if (config) {
      this.config = config;
    }

    this.snapshots = new Array(this.config.maxSize).fill(null);
  }

  getSnapshots(): (Snapshot | null)[] {
    return this.snapshots;
  }

  getCurrentSnapshot(): Snapshot | null {
    return this.snapshots[this.currentIndex] ?? null;
  }

  getPreviousSnapshot(): Snapshot | null {
    return this.snapshots[this.previousIndex] ?? null;
  }

  getSnapshot(index: number): Snapshot | null {
    if (index > 0) {
      // 1 based indexing, for it to be aligned better
      // with negative indexes, meaning that
      // 1 will be the first and -1 will be the last
      const index_ = index - 1;
      return this.snapshots[index_] ?? null;
    } else {
      const index_ = this.snapshots.filter(s => s !== null).length + index;
      return this.snapshots[index_] ?? null;
    }
  }

  update(state: Snapshot, options?: { replacePresent: boolean }): void {
    const newStateIsDifferent = Object.keys(state).some(key => {
      return state[key] !== this.snapshots[this.currentIndex]?.[key];
    });

    if (newStateIsDifferent) {
      const nextSnapshot = state;
      const currentTimestamp = Date.now();

      if (options?.replacePresent) {
        this.snapshots[this.currentIndex] = nextSnapshot;
      } else {
        if (
          this.snapshots[this.currentIndex + 1] &&
          this.snapshots[this.currentIndex + 1] !== null
        ) {
          // shifted history mode
          // when user is not at the latest snapshot
          // and altered history from that point
          this.previousIndex = this.currentIndex;
          this.currentIndex++;
          this.snapshots[this.currentIndex] = nextSnapshot;
          for (
            let i = this.currentIndex + 1;
            i <= this.snapshots.length - 1;
            i++
          ) {
            this.snapshots[i] = null;
          }
        } else {
          const enoughTimePassed =
            currentTimestamp - this.lastSnapshotTimestamp >
            this.config.collapseFrequency;

          if (enoughTimePassed) {
            const historyIsFull =
              this.currentIndex === this.snapshots.length - 1;

            if (historyIsFull) {
              for (let i = 0; i <= this.snapshots.length - 2; i++) {
                this.snapshots[i] = this.snapshots[i + 1];
              }
              this.snapshots[this.snapshots.length - 1] = nextSnapshot;
            } else {
              this.previousIndex = this.currentIndex;
              this.currentIndex++;
              this.snapshots[this.currentIndex] = nextSnapshot;
            }
          } else {
            this.snapshots[this.currentIndex] = nextSnapshot;
          }
        }

        this.updateFlags();
        this.lastSnapshotTimestamp = currentTimestamp;
      }
    }
  }

  replaceSnapshots(snapshots: (Snapshot | null)[]): void {
    if (snapshots.length !== this.snapshots.length) {
      throw new Error("History. snapshots must be of same lengths");
    }

    for (let i = 0; i < this.snapshots.length; i++) {
      if (
        (this.snapshots[i] === null && snapshots[i] !== null) ||
        (this.snapshots[i] !== null && snapshots[i] === null)
      ) {
        throw new Error("History. only patch snapshots supported for now");
      }
    }

    this.snapshots = snapshots;
  }

  canUndo(): boolean {
    return this.canUndo_;
  }

  undo(): void {
    if (this.canUndo()) {
      this.previousIndex = this.currentIndex;
      this.currentIndex--;
      this.updateFlags();
    }
  }

  canRedo(): boolean {
    return this.canRedo_;
  }

  redo(): void {
    if (this.canRedo()) {
      this.previousIndex = this.currentIndex;
      this.currentIndex++;
      this.updateFlags();
    }
  }

  private updateFlags(): void {
    this.canUndo_ = this.currentIndex > 0;
    this.canRedo_ = Boolean(
      this.snapshots[this.currentIndex + 1] &&
        this.snapshots[this.currentIndex + 1] !== null
    );
  }
}
