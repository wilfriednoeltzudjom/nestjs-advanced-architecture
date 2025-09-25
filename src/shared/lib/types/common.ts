export type Paths<T> = T extends string
  ? []
  : {
      [K in Extract<keyof T, string>]: [K, ...Paths<T[K]>];
    }[Extract<keyof T, string>];

export type Join<T extends string[]> = T extends []
  ? never
  : T extends [infer F]
    ? F
    : T extends [infer F, ...infer R]
      ? F extends string
        ? `${F}.${Join<Extract<R, string[]>>}`
        : never
      : string;

export type FlattenObject<T> = {
  [K in keyof T]: T[K] extends object
    ? { [P in keyof T[K] as `${string & K}.${string & P}`]: T[K][P] }
    : { [P in K]: T[P] };
}[keyof T];

export type FlattenRecursive<T, Prefix extends string = ''> = {
  [K in keyof T]: T[K] extends object
    ? FlattenRecursive<T[K], `${Prefix}${Prefix extends '' ? '' : '.'}${string & K}`>
    : { [P in `${Prefix}${Prefix extends '' ? '' : '.'}${string & K}`]: T[K] };
}[keyof T];

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
