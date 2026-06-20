import { Button } from '@themes/ui/components/button';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@themes/ui/components/dropdown-menu';
import { MonitorIcon, Moon, MoonStarIcon, Sun, SunIcon } from 'lucide-react';
import { type MouseEvent, useRef } from 'react';
import { useStore } from 'zustand/react';
import {
	preferencesStore,
	type ResolvedTheme,
	type Theme,
} from '@/stores/preferences';

export function ThemeToggle() {
	const currentTheme = useStore(preferencesStore, (state) => state.theme);
	const setCurrentTheme = useStore(preferencesStore, (state) => state.setTheme);
	const darkMQRef = useRef<MediaQueryList | null>(
		window.matchMedia('(prefers-color-scheme: dark)'),
	);

	const resolveTheme = (theme: Theme): ResolvedTheme => {
		if (theme === 'system') {
			return darkMQRef.current?.matches ? 'dark' : 'light';
		}
		return theme;
	};

	const setTheme = (theme: Theme, event?: MouseEvent) => {
		if (
			event &&
			resolveTheme(theme) !== resolveTheme(currentTheme) &&
			!document.documentElement.hasAttribute('data-astro-transition') &&
			!/^((?!chrome|android).)*safari/i.test(navigator.userAgent) &&
			'startViewTransition' in document
		) {
			const x = event.clientX;
			const y = event.clientY;
			const width = window.innerWidth;
			const height = window.innerHeight;
			const endRadius = Math.hypot(
				Math.max(x, width - x),
				Math.max(y, height - y),
			);

			const transition = document.startViewTransition(() => {
				setCurrentTheme(theme);
			});

			transition.ready.then(() => {
				const duration = 600;
				document.documentElement.animate(
					{
						clipPath: [
							`circle(0px at ${x}px ${y}px)`,
							`circle(${endRadius}px at ${x}px ${y}px)`,
						],
					},
					{
						duration,
						easing: 'cubic-bezier(.76,.32,.29,.99)',
						pseudoElement: '::view-transition-new(root)',
					},
				);
			});
		} else {
			setCurrentTheme(theme);
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
					<Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuGroup>
					<DropdownMenuLabel>Appearance</DropdownMenuLabel>
					{(
						[
							{ theme: 'light', name: 'Light', icon: SunIcon },
							{ theme: 'dark', name: 'Dark', icon: MoonStarIcon },
							{ theme: 'system', name: 'System', icon: MonitorIcon },
						] as const
					).map(({ theme, name, icon: Icon }) => (
						<DropdownMenuCheckboxItem
							key={theme}
							checked={currentTheme === theme}
							onClick={(event) => setTheme(theme, event)}
						>
							<Icon /> {name}
						</DropdownMenuCheckboxItem>
					))}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
