export type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export type DistributiveOptional<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> & Partial<Pick<T, Extract<keyof T, K>>> : never;
