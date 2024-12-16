import {
  StateName,
  StateFieldsValues,
  StateFieldValueTypes,
} from "../shared/shared-types";
import { ComparisonTypes } from "../shared/util/comparison";
import { FIELDS_TYPES, FieldsTypes } from "../shared/util/fields";

export type Option = Record<string, string>;
export type Options = Option[];

export type FieldSchemaFieldsValueVariants = {
  OPTION: Option;
  STRING: string;
  NUMBER: number;
};

export type FieldSchemaFieldsValues =
  | FieldSchemaFieldsValueVariants["NUMBER"]
  | FieldSchemaFieldsValueVariants["STRING"]
  | FieldSchemaFieldsValueVariants["OPTION"];

export type FieldSchemaFieldName = StateName;
export type FieldSchemaDepandsFieldName = FieldSchemaFieldName;
export type FieldSchemaValueTypes = StateFieldValueTypes;
export type FieldSchemaFieldTypes = FieldsTypes;
export const FIELD_SCHEMA_FIELD_TYPES = FIELDS_TYPES;

export type FieldSchemaRules = {
  hidden?: boolean | undefined;
  disabled?: boolean | undefined;
  maxLength?: undefined | number | undefined;
  minLength?: undefined | number | undefined;
  maxLengthErrorMessage?: string;
  minLengthErrorMessage?: string;
  maxNumber?: undefined | number | undefined;
  minNumber?: undefined | number | undefined;
  maxNumberErrorMessage?: string;
  minNumberErrorMessage?: string;
  required?: boolean | undefined;
  requiredErrorMessage?: string;
};

export type FieldSchemaAction<Rules> = {
  rules: Rules;
};

export type FieldsSchemaCondition<Rules> = {
  fieldName: FieldSchemaDepandsFieldName;
  comparison: ComparisonTypes;
  value: FieldSchemaValueTypes;
  action: FieldSchemaAction<Rules>;
};

export type FieldStringSchemaRules = Pick<
  FieldSchemaRules,
  | "disabled"
  | "hidden"
  | "maxLength"
  | "minLength"
  | "maxLengthErrorMessage"
  | "minLengthErrorMessage"
  | "required"
  | "requiredErrorMessage"
>;

export type FieldStringSchema = {
  fieldType: (typeof FIELD_SCHEMA_FIELD_TYPES)["STRING"];
  placeholder: string;
  fieldName: FieldSchemaFieldName;
  fieldConditions: FieldsSchemaCondition<FieldStringSchemaRules>[];
  rules: FieldStringSchemaRules;
  defaultValue: FieldSchemaFieldsValueVariants["STRING"];
};

export type FieldNumberSchemaRules = Pick<
  FieldSchemaRules,
  | "disabled"
  | "hidden"
  | "maxNumber"
  | "minNumber"
  | "required"
  | "requiredErrorMessage"
  | "maxLengthErrorMessage"
  | "maxNumberErrorMessage"
>;

export type FieldNumberSchema = {
  fieldType: (typeof FIELD_SCHEMA_FIELD_TYPES)["NUMBER"];
  placeholder: string;
  fieldName: FieldSchemaFieldName;
  fieldConditions: FieldsSchemaCondition<FieldNumberSchemaRules>[];
  rules: FieldNumberSchemaRules;
  defaultValue: FieldSchemaFieldsValueVariants["NUMBER"];
};

export type FieldSelectSchemaRules = Pick<
  FieldSchemaRules,
  "disabled" | "hidden" | "required" | "requiredErrorMessage"
>;

export type FieldSelectSchema = {
  fieldType: (typeof FIELD_SCHEMA_FIELD_TYPES)["SELECT"];
  placeholder: string;
  fieldName: FieldSchemaFieldName;
  fieldConditions: FieldsSchemaCondition<FieldSelectSchemaRules>[];
  rules: FieldSelectSchemaRules;
  defaultValue: FieldSchemaFieldsValueVariants["OPTION"];
  options: FieldSchemaFieldsValueVariants["OPTION"][];
};

export type FieldSchema =
  | FieldStringSchema
  | FieldNumberSchema
  | FieldSelectSchema;

export type FieldsSchemaTypes = {
  [FIELD_SCHEMA_FIELD_TYPES.STRING]: FieldStringSchema;
  [FIELD_SCHEMA_FIELD_TYPES.NUMBER]: FieldNumberSchema;
  [FIELD_SCHEMA_FIELD_TYPES.SELECT]: FieldSelectSchema;
};

export type FieldsSchema = FieldSchema[];
