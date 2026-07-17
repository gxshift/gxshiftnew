import { create } from 'zustand';

interface GlobalState {
  whatsappNumber: string;
  setWhatsappNumber: (num: string) => void;
  activeGameId: string | null;
  setActiveGameId: (id: string | null) => void;
}

export const useStore = create<GlobalState>((set) => ({
  whatsappNumber: '6281234567890', // Fallback default
  setWhatsappNumber: (num) => set({ whatsappNumber: num }),
  activeGameId: null,
  setActiveGameId: (id) => set({ activeGameId: id }),
}));