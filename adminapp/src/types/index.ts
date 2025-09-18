// Re-export all types for easier imports
export * from './auth';
export * from './database';
export * from './frontend';
export * from './order';
export * from './payment';

// Common utility types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
  data?: any;
}
