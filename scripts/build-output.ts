import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { getPackages } from '@manypkg/get-packages';
import { packlist } from '@pnpm/fs.packlist';
import { detect } from 'package-manager-detector';
import * as tar from 'tar';
import { packPackage } from './lib/utils.ts';

const cwd = process.cwd();
const OUTPUT_DIR = path.resolve(cwd, '.output');
const METADATA_FILE = path.join(OUTPUT_DIR, 'metadata.json');
const README_FILE = path.join(OUTPUT_DIR, 'README.md');

const npmPackageNameRegex =
	/^(?=.{1,214}$)^(@[a-z0-9-~][a-z0-9-._~]*\/)?(?:[a-z0-9-~][a-z0-9-._~]*)$/u;

async function main(): Promise<void> {
	const { packages } = await getPackages(cwd);
	const pm = await detect({ cwd }).catch(() => null);

	await fs.rm(OUTPUT_DIR, { recursive: true, force: true });
	await fs.mkdir(OUTPUT_DIR, { recursive: true });

	const packagesToPack = packages.filter(
		(pkg) =>
			!pkg.packageJson.private &&
			npmPackageNameRegex.test(pkg.packageJson.name),
	);

	await Promise.all(
		packagesToPack.map(async (pkg) => {
			const pkgOutDir = path.join(OUTPUT_DIR, pkg.packageJson.name);
			await fs.mkdir(pkgOutDir, { recursive: true });

			if (pm?.agent === 'npm' || pm?.agent === 'pnpm') {
				const tarball = await packPackage(pm.agent, pkg.dir, OUTPUT_DIR);
				try {
					await tar.x({
						file: tarball,
						cwd: pkgOutDir,
						strip: 1,
					});
				} finally {
					await fs.unlink(tarball);
				}
			} else {
				const files = await packlist(pkg.dir);
				await Promise.all(
					files.map(async (file) => {
						const src = path.join(pkg.dir, file);
						const dest = path.join(pkgOutDir, file);
						await fs.mkdir(path.dirname(dest), { recursive: true });
						await fs.copyFile(src, dest);
					}),
				);
			}
		}),
	);

	let readmeMd = '## Packages\n\n';

	if (packagesToPack.length > 0) {
		readmeMd += '| Name | Version |\n';
		readmeMd += '|------|---------|\n';
		for (const pkg of packagesToPack) {
			readmeMd += `| \`${pkg.packageJson.name}\` | \`${pkg.packageJson.version}\` |\n`;
		}
	} else {
		readmeMd += '> Nothing to show here.\n';
	}

	const metadata = {
		packages: packagesToPack.map(({ packageJson }) => ({
			name: packageJson.name,
			version: packageJson.version,
		})),
	};

	await fs.writeFile(README_FILE, readmeMd);
	await fs.writeFile(METADATA_FILE, JSON.stringify(metadata, null, 2));

	if (packagesToPack.length > 0) {
		console.log('Packages packed:');
		for (const pkg of packagesToPack) {
			console.log(`  - ${pkg.packageJson.name}@${pkg.packageJson.version}`);
		}
	}
}

main();
