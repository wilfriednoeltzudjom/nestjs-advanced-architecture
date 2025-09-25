import { Kysely } from 'kysely';

export type KyselyDatabase<T = any> = Kysely<T>;
