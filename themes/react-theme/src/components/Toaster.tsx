import { Toaster as Sonner } from '@themes/ui/components/sonner';
import type { ComponentProps } from 'react';
import { useStore } from 'zustand/react';
import { preferencesStore } from '@/stores/preferences';

export default function Toaster({
	...props
}: Omit<ComponentProps<typeof Sonner>, 'theme'>) {
	const theme = useStore(preferencesStore, (state) => state.theme);

	return <Sonner {...props} theme={theme} />;
}
