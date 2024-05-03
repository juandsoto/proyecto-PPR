import { create } from 'zustand';

interface AppStore {
	dznFile: File | null;
	setDznFile: (file: File) => void;
}

export const useAppStore = create<AppStore>((set) => ({
	dznFile: null,
	setDznFile: file => set({ dznFile: file })
}));