import { useEffect } from "react";

export function useCloseOnIframeInteraction(onClose: () => void): void {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const iframe = window.parent.document.querySelector<HTMLIFrameElement>(
      "#brz-ed-iframe"
    );
    const iframeDoc = iframe?.contentDocument;

    if (!iframeDoc) {
      return;
    }

    const handleIframeInteraction = () => {
      onClose();
    };

    iframeDoc.addEventListener("pointerdown", handleIframeInteraction, true);
    iframeDoc.addEventListener("wheel", handleIframeInteraction, {
      capture: true
    });

    return () => {
      iframeDoc.removeEventListener("pointerdown", handleIframeInteraction, true);
      iframeDoc.removeEventListener("wheel", handleIframeInteraction, true);
    };
  }, [onClose]);
}
