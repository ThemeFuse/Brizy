import { useSyncExternalStore } from "react";
import {
  getEmbedCodeConsent,
  subscribeToEmbedCodeConsent
} from "./consentStore";

// Subscribes a component to the consent decision. Every consumer re-renders on
// change, which is what makes a single toggle reach every EmbedCode element on
// the page at once — including ones inside global blocks and popups.
export const useEmbedCodeConsent = (): boolean =>
  useSyncExternalStore(
    subscribeToEmbedCodeConsent,
    getEmbedCodeConsent,
    getEmbedCodeConsent
  );
