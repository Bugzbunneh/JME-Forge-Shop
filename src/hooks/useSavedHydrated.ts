import { useSyncExternalStore } from "react";
import { useSavedStore } from "../stores/useSavedStore";

const subscribeToHydration = (onChange: () => void) =>
  useSavedStore.persist.onFinishHydration(onChange);

const isStoreHydrated = () => useSavedStore.persist.hasHydrated();

const isServerHydrated = () => false;

export const useSavedHydrated = () =>
  useSyncExternalStore(subscribeToHydration, isStoreHydrated, isServerHydrated);
