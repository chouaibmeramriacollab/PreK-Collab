/* tslint:disable */
/* eslint-disable */

/* auto-generated by NAPI-RS */

export interface WatchOptions {
  recursive?: boolean;
}
/** Watcher kind enumeration */
export enum WatcherKind {
  /** inotify backend (linux) */
  Inotify = 'Inotify',
  /** FS-Event backend (mac) */
  Fsevent = 'Fsevent',
  /** KQueue backend (bsd,optionally mac) */
  Kqueue = 'Kqueue',
  /** Polling based backend (fallback) */
  PollWatcher = 'PollWatcher',
  /** Windows backend */
  ReadDirectoryChangesWatcher = 'ReadDirectoryChangesWatcher',
  /** Fake watcher for testing */
  NullWatcher = 'NullWatcher',
  Unknown = 'Unknown',
}
export function moveFile(src: string, dst: string): Promise<void>;
export interface BlobRow {
  key: string;
  data: Buffer;
  timestamp: Date;
}
export interface UpdateRow {
  id: number;
  timestamp: Date;
  data: Buffer;
}
export class Subscription {
  toString(): string;
  unsubscribe(): void;
}
export type FSWatcher = FsWatcher;
export class FsWatcher {
  static watch(p: string, options?: WatchOptions | undefined | null): FsWatcher;
  static kind(): WatcherKind;
  toString(): string;
  subscribe(
    callback: (event: import('./event').NotifyEvent) => void,
    errorCallback?: (err: Error) => void
  ): Subscription;
  static unwatch(p: string): void;
  static close(): void;
}
export class SqliteConnection {
  constructor(path: string);
  connect(): Promise<void>;
  addBlob(key: string, blob: Uint8Array): Promise<number>;
  getBlob(key: string): Promise<BlobRow | null>;
  deleteBlob(key: string): Promise<void>;
  getBlobKeys(): Promise<Array<string>>;
  getUpdates(): Promise<Array<UpdateRow>>;
  insertUpdates(updates: Array<Uint8Array>): Promise<void>;
  close(): Promise<void>;
  get isClose(): boolean;
  static validate(path: string): Promise<boolean>;
}
