let element: HTMLElement;

export interface EscapeHtmlOptions {
	ampersand?: boolean;
	tags?: boolean;
	quotes?: boolean;
}

export function escapeHtml(
	input: string,
	{ ampersand = true, tags = true, quotes = true }: EscapeHtmlOptions = {},
): string {
	let result = input;

	if (ampersand) {
		result = result.replace(/&/g, '&amp;');
	}
	if (tags) {
		result = result.replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}
	if (quotes) {
		result = result.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
	}

	return result;
}

export interface UnescapeHtmlOptions {
	useDOM?: boolean;
}

export function unescapeHtml(
	input: string,
	{ useDOM = true }: UnescapeHtmlOptions = {},
) {
	if (useDOM) {
		element ||= document.createElement('div');
		element.innerHTML = input;
		return element.textContent;
	}

	return input
		.replace(/&#39;/g, "'")
		.replace(/&apos;/g, "'")
		.replace(/&quot;/g, '"')
		.replace(/&gt;/g, '>')
		.replace(/&lt;/g, '<')
		.replace(/&amp;/g, '&');
}
