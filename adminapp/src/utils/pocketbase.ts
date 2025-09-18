import type { RecordModel } from 'pocketbase';

/**
 * Helper function to cast PocketBase RecordModel to a specific type
 * This ensures proper TypeScript typing while preserving all the record data
 */
export function castRecord<T extends Record<string, any>>(record: RecordModel): T {
  return record as unknown as T;
}

/**
 * Helper function to cast array of PocketBase RecordModels to a specific type
 */
export function castRecords<T extends Record<string, any>>(records: RecordModel[]): T[] {
  return records as unknown as T[];
}
