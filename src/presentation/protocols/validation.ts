export interface Validation {
  validate: (fieldName: string, input: Record<string, unknown>) => string | null;
}
