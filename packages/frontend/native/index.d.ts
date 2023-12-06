/* auto-generated by NAPI-RS */
/* eslint-disable */

export class SqliteConnection {
  constructor(path: string)
  connect(): Promise<void>
  addBlob(key: string, blob: Uint8Array): Promise<void>
  getBlob(key: string): Promise<BlobRow | null>
  deleteBlob(key: string): Promise<void>
  getBlobKeys(): Promise<Array<string>>
  getUpdates(docId?: string | undefined | null): Promise<Array<UpdateRow>>
  getUpdatesCount(docId?: string | undefined | null): Promise<number>
  getAllUpdates(): Promise<Array<UpdateRow>>
  insertUpdates(updates: Array<InsertRow>): Promise<void>
  replaceUpdates(docId: string | undefined | null, updates: Array<InsertRow>): Promise<void>
  initVersion(): Promise<void>
  setVersion(version: number): Promise<void>
  getMaxVersion(): Promise<number>
  close(): Promise<void>
  get isClose(): boolean
  static validate(path: string): Promise<ValidationResult>
  migrateAddDocId(): Promise<void>
}

export interface BlobRow {
  key: string
  data: Buffer
  timestamp: Date
}

export interface InsertRow {
  docId?: string
  data: Uint8Array
}

export function mintChallengeResponse(resource: string, bits?: number | undefined | null): Promise<string>

export interface UpdateRow {
  id: number
  timestamp: Date
  data: Buffer
  docId?: string
}

export enum ValidationResult {
  MissingTables = 0,
  MissingDocIdColumn = 1,
  MissingVersionColumn = 2,
  GeneralError = 3,
  Valid = 4
}

export function verifyChallengeResponse(response: string, bits: number, resource: string): Promise<boolean>

