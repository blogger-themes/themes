declare module 'spawndamnit' {
	import type { SpawnOptions } from 'node:child_process';
	import type { EventEmitter } from 'node:events';

	export default function spawn(
		cmd: string,
		args: Array<string>,
		opts?: SpawnOptions,
	): Promise<{ stdout: Buffer; code: number; stderr: Buffer }> & EventEmitter;
}
