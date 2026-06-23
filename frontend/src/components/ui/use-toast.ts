"use client";

// Hook de toast inspirado no shadcn/ui (reducer + store em memória).
import * as React from "react";
import type { ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 4000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
};

let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type State = { toasts: ToasterToast[] };

type Action =
  | { type: "ADD"; toast: ToasterToast }
  | { type: "DISMISS"; id?: string }
  | { type: "REMOVE"; id?: string };

const listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };

const timeouts = new Map<string, ReturnType<typeof setTimeout>>();

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD":
      return { toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) };
    case "DISMISS":
      return {
        toasts: state.toasts.map((t) =>
          t.id === action.id || action.id === undefined
            ? { ...t, open: false }
            : t
        )
      };
    case "REMOVE":
      return {
        toasts:
          action.id === undefined
            ? []
            : state.toasts.filter((t) => t.id !== action.id)
      };
    default:
      return state;
  }
}

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((l) => l(memoryState));
}

function scheduleRemove(id: string) {
  if (timeouts.has(id)) return;
  const timeout = setTimeout(() => {
    timeouts.delete(id);
    dispatch({ type: "REMOVE", id });
  }, TOAST_REMOVE_DELAY);
  timeouts.set(id, timeout);
}

export function toast(props: Omit<ToasterToast, "id">) {
  const id = genId();
  dispatch({
    type: "ADD",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open: boolean) => {
        if (!open) dispatch({ type: "DISMISS", id });
      }
    }
  });
  scheduleRemove(id);
  return { id };
}

export function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const i = listeners.indexOf(setState);
      if (i > -1) listeners.splice(i, 1);
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (id?: string) => dispatch({ type: "DISMISS", id })
  };
}
