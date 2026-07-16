/**
 * Isolates a plugin slot contribution's render errors so a crashing
 * plugin cannot take down the surrounding editor UI.
 */
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class SlotErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    console.error("[plugins] slot contribution crashed:", error);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}
