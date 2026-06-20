// TODO: currently experimenting with this one

import { type CSSProperties, useEffect, useRef, useState } from 'react';

export interface ThumbnailProps {
	logo: string;
	organization: string;
	title: string;
	description: string;
}

export default function Thumbnail({
	logo,
	description,
	organization,
	title,
}: ThumbnailProps) {
	const [wrapperStyle, setWrapperStyle] = useState<CSSProperties>({});
	const [artStyle, setArtStyle] = useState<CSSProperties>({});
	const wrapperRef = useRef<HTMLDivElement>(null);
	const artRef = useRef<HTMLDivElement>(null);

	const artWidth = 640;
	const artHeight = 360;

	useEffect(() => {
		const scale = () => {
			if (!wrapperRef.current || !artRef.current) {
				return;
			}

			const wrapperWidth = wrapperRef.current.clientWidth;
			const factor = wrapperWidth / artWidth;

			setWrapperStyle({
				height: `${artHeight * factor}px`,
			});
			setArtStyle({
				transformOrigin: 'top left',
				transform: `scale(${factor})`,
			});
		};

		scale();

		window.addEventListener('resize', scale);
		return () => {
			window.removeEventListener('resize', scale);
		};
	}, []);

	return (
		<div
			ref={wrapperRef}
			style={wrapperStyle}
			className="max-w-2xl w-full mx-auto overflow-hidden rounded-md border"
		>
			<div
				ref={artRef}
				style={{
					width: 640,
					height: 360,
					...artStyle,
				}}
				className="p-[20px] relative bg-purple-50 text-gray-900 dark:text-gray-50 dark:bg-card"
			>
				<span className="absolute left-0 right-0 top-12 border-t border-border" />
				<span className="absolute top-0 bottom-0 right-12 border-r border-border" />
				<span className="absolute left-0 right-0 bottom-12 border-b border-border" />
				<span className="absolute top-0 bottom-0 left-12 border-l border-border" />

				<div className="absolute flex items-center left-12 right-12 top-12 gap-3">
					<img
						alt={organization}
						src={logo}
						className="object-cover object-center shrink-0 rounded-md size-8"
					/>
					<div className="truncate font-[440] grow text-xl">{organization}</div>
				</div>
				<div className="absolute grid gap-3 left-12 right-12 bottom-12">
					<div className="font-[500] line-clamp-2 text-4xl/[1.2]">{title}</div>
					<div className="line-clamp-2 text-xl/[1.25]">{description}</div>
				</div>
			</div>
		</div>
	);
}
