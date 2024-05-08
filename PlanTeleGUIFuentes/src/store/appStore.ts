import { create } from 'zustand';
import { BasicResult } from '../types';

interface AppStore {
	dznFile: File | null;
	setDznFile: (file: File) => void;
	basicResult: BasicResult | null;
	setBasicResult: (result: BasicResult) => void;
}

export const useAppStore = create<AppStore>((set) => ({
	dznFile: null,
	setDznFile: file => set({ dznFile: file }),
	basicResult: null,
	setBasicResult: result => set({ basicResult: result }),
}));