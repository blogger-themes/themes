import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import spawn from 'spawndamnit';

export function fileExists(filePath: string): Promise<boolean> {
	return fs.access(filePath, fs.constants.F_OK).then(
		() => true,
		() => false,
	);
}

export async function packPackage(
	pm: 'npm' | 'pnpm',
	pkgDir: string,
	destDir: string,
): Promise<string> {
	const { stdout } = await spawn(
		pm,
		['pack', '--json', '--pack-destination', path.resolve(destDir)],
		{
			cwd: path.resolve(pkgDir),
		},
	);

	const output = JSON.parse(stdout.toString()) as
		| { filename?: string }
		| { filename?: string }[];

	const filename = Array.isArray(output)
		? output[0]?.filename
		: output?.filename;

	if (typeof filename !== 'string') {
		throw new Error(`Failed to create package tarball for ${pkgDir}`);
	}

	const file = path.resolve(destDir, filename);

	if (!(await fileExists(file))) {
		throw new Error(`Packed tarball not found: ${file}`);
	}

	return file;
}
