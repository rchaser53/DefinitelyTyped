// Type definitions for Rethinkdb 1.10.0
// Project: http://rethinkdb.com/
// Definitions by: Sean Hess <https://seanhess.github.io/>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// Reference: http://www.rethinkdb.com/api/#js
// TODO: Document manipulation and below

///<reference types="bluebird"/>

export declare function connect(host: ConnectionOptions, cb?: (err: Error, conn: Connection) => void): Promise<Connection>;

export declare function dbCreate(name: string): Operation<CreateResult>;
export declare function dbDrop(name: string): Operation<DropResult>;
export declare function dbList(): Operation<string[]>;

export declare function db(name: string): Db;
export declare function table(name: string, options?: { useOutdated: boolean }): Table;

export declare function asc(property: string): Sort;
export declare function desc(property: string): Sort;

export declare var count: Aggregator;
export declare function sum(prop: string): Aggregator;
export declare function avg(prop: string): Aggregator;

export declare function row(name: string): Expression<any>;
export declare function expr(stuff: any): Expression<any>;

export declare function now(): Time;

// Control Structures
export declare function branch(test: Expression<boolean>, trueBranch: Expression<any>, falseBranch: Expression<any>): Expression<any>;


export declare class Cursor {
    hasNext(): boolean;
    each(cb: (err: Error, row: any) => void, done?: () => void): void;
    each<T>(cb: (err: Error, row: T) => void, done?: () => void): void;
    each(cb: (err: Error, row: any) => boolean, done?: () => void): void; // returning false stops iteration
    each<T>(cb: (err: Error, row: T) => boolean, done?: () => void): void; // returning false stops iteration
    next(cb: (err: Error, row: any) => void): void;
    next<T>(cb: (err: Error, row: T) => void): void;
    toArray(cb: (err: Error, rows: any[]) => void): void;
    toArray<T>(cb: (err: Error, rows: T[]) => void): void;
    toArray(): Promise<any[]>;
    toArray<T>(): Promise<T[]>;
    close(cb: (err: Error) => void): void;
    close(): void;
}

interface ConnectionOptions {
    host: string;
    port: number;
    db?: string;
    authKey?: string;
}

interface Connection {
    close(cb: (err: Error) => void): void;
    close(opts: { noreplyWait: boolean }, cb: (err: Error) => void): void;
    close(): void;
    close(opts: { noreplyWait: boolean }): Promise<void>;
    reconnect(cb?: (err: Error, conn: Connection) => void): Promise<Connection>;
    use(dbName: string): void;
    addListener(event: string, cb: Function): void;
    on(event: string, cb: Function): void;
}

interface Db {
    tableCreate(name: string, options?: TableOptions): Operation<CreateResult>;
    tableDrop(name: string): Operation<DropResult>;
    tableList(): Operation<string[]>;
    table(name: string, options?: GetTableOptions): Table;
}

interface TableOptions {
    primary_key?: string; // 'id'
    durability?: string; // 'soft'
    cache_size?: number;
    datacenter?: string;
}

interface GetTableOptions {
    useOutdated: boolean;
}

interface Writeable {
    update(obj: Object, options?: UpdateOptions): Operation<WriteResult>;
    replace(obj: Object, options?: UpdateOptions): Operation<WriteResult>;
    replace(expr: ExpressionFunction<any>): Operation<WriteResult>;
    delete(options?: UpdateOptions): Operation<WriteResult>;
}

interface Table extends Sequence {
    indexCreate(name: string, index?: ExpressionFunction<any>): Operation<CreateResult>;
    indexDrop(name: string): Operation<DropResult>;
    indexList(): Operation<string[]>;

    insert(obj: any[], options?: InsertOptions): Operation<WriteResult>;
    insert(obj: any, options?: InsertOptions): Operation<WriteResult>;

    get(key: string): Sequence; // primary key
    getAll(key: string, index?: Index): Sequence; // without index defaults to primary key
    getAll(...keys: string[]): Sequence;
}

interface Sequence extends Operation<Cursor>, Writeable {

    between(lower: any, upper: any, index?: Index): Sequence;
    filter(rql: ExpressionFunction<boolean>): Sequence;
    filter(rql: Expression<boolean>): Sequence;
    filter(obj: { [key: string]: any }): Sequence;


    // Join
    // these return left, right
    innerJoin(sequence: Sequence, join: JoinFunction<boolean>): Sequence;
    outerJoin(sequence: Sequence, join: JoinFunction<boolean>): Sequence;
    eqJoin(leftAttribute: string, rightSequence: Sequence, index?: Index): Sequence;
    eqJoin(leftAttribute: ExpressionFunction<any>, rightSequence: Sequence, index?: Index): Sequence;
    zip(): Sequence;

    // Transform
    map(transform: ExpressionFunction<any>): Sequence;
    withFields(...selectors: any[]): Sequence;
    concatMap(transform: ExpressionFunction<any>): Sequence;
    orderBy(...keys: string[]): Sequence;
    orderBy(...sorts: Sort[]): Sequence;
    skip(n: number): Sequence;
    limit(n: number): Sequence;
    slice(start: number, end?: number): Sequence;
    nth(n: number): Expression<any>;
    indexesOf(obj: any): Sequence;
    isEmpty(): Expression<boolean>;
    union(sequence: Sequence): Sequence;
    sample(n: number): Sequence;

    // Aggregate
    reduce(r: ReduceFunction<any>, base?: any): Expression<any>;
    count(): Expression<number>;
    distinct(): Sequence;
    groupedMapReduce(group: ExpressionFunction<any>, map: ExpressionFunction<any>, reduce: ReduceFunction<any>, base?: any): Sequence;
    groupBy(...aggregators: Aggregator[]): Expression<Object>; // TODO: reduction object
    contains(prop: string): Expression<boolean>;

    // Manipulation
    pluck(...props: string[]): Sequence;
    without(...props: string[]): Sequence;
}

interface ExpressionFunction<U> {
    (doc: Expression<any>): Expression<U>;
}

interface JoinFunction<U> {
    (left: Expression<any>, right: Expression<any>): Expression<U>;
}

interface ReduceFunction<U> {
    (acc: Expression<any>, val: Expression<any>): Expression<U>;
}

interface InsertOptions {
    upsert: boolean; // true
    durability: string; // 'soft'
    return_vals: boolean; // false
}

interface UpdateOptions {
    non_atomic: boolean;
    durability: string; // 'soft'
    return_vals: boolean; // false
}

interface WriteResult {
    inserted: number;
    replaced: number;
    unchanged: number;
    errors: number;
    deleted: number;
    skipped: number;
    first_error: Error;
    generated_keys: string[]; // only for insert
}

interface JoinResult {
    left: any;
    right: any;
}

interface CreateResult {
    created: number;
}

interface DropResult {
    dropped: number;
}

interface Index {
    index: string;
    left_bound?: string; // 'closed'
    right_bound?: string; // 'open'
}

interface Expression<T> extends Writeable, Operation<T> {
    (prop: string): Expression<any>;
    merge(query: Expression<Object>): Expression<Object>;
    append(prop: string): Expression<Object>;
    contains(prop: string): Expression<boolean>;

    and(b: boolean): Expression<boolean>;
    or(b: boolean): Expression<boolean>;
    eq(v: any): Expression<boolean>;
    ne(v: any): Expression<boolean>;
    not(): Expression<boolean>;

    gt(value: T): Expression<boolean>;
    ge(value: T): Expression<boolean>;
    lt(value: T): Expression<boolean>;
    le(value: T): Expression<boolean>;

    add(n: number): Expression<number>;
    sub(n: number): Expression<number>;
    mul(n: number): Expression<number>;
    div(n: number): Expression<number>;
    mod(n: number): Expression<number>;

    hasFields(...fields: string[]): Expression<boolean>;

    default(value: T): Expression<T>;
}

interface Operation<T> {
    run(conn: Connection, cb?: (err: Error, result: T) => void): Promise<T>;
}

interface Aggregator { }
interface Sort { }

interface Time { }
