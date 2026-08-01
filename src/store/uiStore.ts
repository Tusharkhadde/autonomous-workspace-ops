import { create } from 'zustand';

interface UIState {
  isCommandPaletteOpen: boolean;
  isKeyboardShortcutsOpen: boolean;

  setCommandPaletteOpen: (open: boolean) => void;
  setKeyboardShortcutsOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCommandPaletteOpen: false,
  isKeyboardShortcutsOpen: false,

  setCommandPaletteOpen: (isCommandPaletteOpen) => set({ isCommandPaletteOpen }),
  setKeyboardShortcutsOpen: (isKeyboardShortcutsOpen) => set({ isKeyboardShortcutsOpen }),
}));
