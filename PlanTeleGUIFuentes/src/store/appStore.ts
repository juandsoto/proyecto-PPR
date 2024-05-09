import { create } from 'zustand';
import { BasicResult } from '../types';

interface AppStore {
	dznFile: string | null;
	setDznFile: (file: string) => void;
	basicResult: BasicResult | null;
	setBasicResult: (result: BasicResult) => void;
}

export const useAppStore = create<AppStore>((set) => ({
	dznFile: null,
	setDznFile: file => set({ dznFile: file }),
	basicResult: null,
	setBasicResult: result => set({ basicResult: result }),
}));