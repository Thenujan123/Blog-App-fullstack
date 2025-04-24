import { Dispatch, SetStateAction } from "react";
import { create } from "zustand";

type Mode = "light" | "dark";

interface IthemeStore {
  state: {
    mode: Mode;
  };
  action: {
    setMode: Dispatch<SetStateAction<Mode>>;
  };
}

const useThemeStore = create<IthemeStore>((set, get) => ({
  state: {
    mode: "light",
  },
  action: {
    setMode: (value) => {
      const currentMode = get().state.mode;
      const newMode = typeof value === "function" ? value(currentMode) : value;
      set((prev) => ({
        state: {
          ...prev.state,
          mode: newMode,
        },
      }));
    },
  },
}));

export default useThemeStore;
