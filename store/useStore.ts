import { create } from 'zustand';

interface AppState {
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (isOpen: boolean) => void;
  activeGameId: string | null;
  setActiveGameId: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isMobileMenuOpen: false,
  setMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),
  activeGameId: null,
  setActiveGameId: (id) => set({ activeGameId: id }),
}));