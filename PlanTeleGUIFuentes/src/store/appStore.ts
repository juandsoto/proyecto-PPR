import { create } from 'zustand';
import { BasicResult, ExtendedResult } from '../types';

interface AppStore {
	filename: string | null;
	setFilename: (name: string | null) => void;
	dznFile: string | null;
	setDznFile: (content: string | null) => void;
	basicResult: BasicResult | null;
	setBasicResult: (result: BasicResult | null) => void;
	extendedResult: ExtendedResult | null;
	setExtendedResult: (result: ExtendedResult | null) => void;
	isLoading: boolean;
	setIsLoading: (value: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
	filename: null,
	setFilename: name => set({ filename: name }),
	dznFile: null,
	setDznFile: content => set({ dznFile: content }),
	basicResult: null,
	setBasicResult: result => set({ basicResult: result }),
	extendedResult: null,
	setExtendedResult: result => set({ extendedResult: result }),
	isLoading: false,
	setIsLoading: value => set({ isLoading: value })
}));