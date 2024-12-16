import {
  FieldSchemaFieldsValues,
  FieldsSchema,
} from "../lib/field-schema-types";

export type StateFieldValueTypes = FieldSchemaFieldsValues;
export type StateName = string;
export type StateFieldsValues = Record<StateName, StateFieldValueTypes>;
export type StateFieldsErrors = Record<StateName, string>;
export type StateTouchedFields = Record<StateName, boolean>;
export type StateFieldsSchema = FieldsSchema;
export type StateFieldsRules = Record<StateName, string>;
export type StateFieldsRulesHistory = Record<
  StateName,
  StateFieldsSchema[0]["rules"][]
>;
export type FieldsRules = StateFieldsSchema[0]["rules"];

// service types

export interface StateSchema {
  [key: string]: any;
}

export type UpdateFieldRulesParams<T extends object> = {
  fieldName: string;
  value: StateFieldsSchema[0]["rules"];
} & T;

export type SetFieldRulesParams<T extends object> = {
  fieldName: string;
  value: StateFieldsSchema[0]["rules"];
} & T;

export type GetFieldRulesParams<T extends object> = {
  fieldName: string;
} & T;

export type UpdateFieldValueParams<T extends object> = {
  fieldName: string;
  value: StateFieldValueTypes;
} & T;

export type SetFieldErrorParams<T extends object> = {
  fieldName: string;
  error: string;
} & T;

export type UpdateStateStatusParams<T extends object> = {
  isSubmitted: boolean;
  submitCount: number;
  isValid: boolean;
} & T;

export type ValidateFieldParams<T extends object> = {
  fieldName: string;
  rules: StateFieldsSchema[0]["rules"];
} & T;

export type StateServiceMethodsParamsGenerics<T extends object> = {
  updateFieldValue: UpdateFieldValueParams<T>;
  updateFieldRules: UpdateFieldRulesParams<T>;
  validateField: ValidateFieldParams<T>;
  getFieldRules: GetFieldRulesParams<T>;
  getFieldRulesHistory: GetFieldRulesParams<T>;
  setFieldRules: SetFieldRulesParams<T>;
  setFieldError: SetFieldErrorParams<T>;
  updateStateStatus: UpdateStateStatusParams<T>;
};

export type StateServiceMethodsParams = StateServiceMethodsParamsGenerics<{
  stateName: string;
}>;

// UseStateMethodsParamsTypes
export type UseStateMethodsParams = StateServiceMethodsParamsGenerics<{}>;
