import { persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';
import {
	DEFAULT_THEME,
	PREFERENCES_KEY,
	PREFERENCES_VERSION,
} from '@/constants';
import {
	createStateSetterFunction,
	type SetStateFunction,
	syncPersist,
} from '../helpers';

export type ResolvedTheme = 'light' | 'dark';
export type Theme = ResolvedTheme | 'system';

export interface PreferencesState {
	theme: Theme;
	blogAdmin: boolean;
	setTheme: SetStateFunction<Theme>;
	setBlogAdmin: SetStateFunction<boolean>;
}

export const preferencesStore = createStore<PreferencesState>()(
	syncPersist(
		persist(
			(set) => ({
				theme: DEFAULT_THEME,
				blogAdmin: false,
				setTheme: createStateSetterFunction(set, 'theme'),
				setBlogAdmin: createStateSetterFunction(set, 'blogAdmin'),
			}),
			{
				name: PREFERENCES_KEY,
				version: PREFERENCES_VERSION,
			},
		),
		{
			storage: 'local',
		},
	),
);
