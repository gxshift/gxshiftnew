import { create } from 'zustand';

interface GlobalState {
  whatsappNumber: string;
  setWhatsappNumber: (num: string) => void;
  activeGameId: string | null;
  setActiveGameId: (id: string | null) => void;
}

export const useStore = create<GlobalState>((set) => ({
  whatsappNumber: '6282120002589', 
  // SEMENTARA KITA MATIKAN FUNGSI TIMPA-NYA UNTUK TESTING
  setWhatsappNumber: (num) => console.log("Mencoba menimpa WA, tapi ditahan oleh sistem!"), 
  activeGameId: null,
  setActiveGameId: (id) => set({ activeGameId: id }),
}));