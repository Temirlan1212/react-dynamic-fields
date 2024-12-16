export const FIELDS_TYPES = {
  STRING: "string",
  NUMBER: "number",
  SELECT: "select",
} as const;

export type FieldsTypes = (typeof FIELDS_TYPES)[keyof typeof FIELDS_TYPES];
