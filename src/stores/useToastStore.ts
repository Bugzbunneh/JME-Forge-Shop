import { create } from "zustand";

const TOAST_DURATION_MS = 3200;

interface Toast {
  id: number;
  message: string;
}

interface ToastState {
  toasts: Toast[];
  showToast: (message: string) => void;
  dismissToast: (id: number) => void;
}

let nextToastId = 1;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  showToast: (message) => {
    const id = nextToastId++;
    set((state) => ({ toasts: [...state.toasts, { id, message }] }));
    window.setTimeout(() => get().dismissToast(id), TOAST_DURATION_MS);
  },
  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}));
