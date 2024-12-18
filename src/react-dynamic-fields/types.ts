import {
  FieldSchema,
  FieldSchemaRules,
  FieldsSchema,
  FieldSchemaFieldsValueVariants,
  FieldsSchemaTypes,
} from "./lib/field-schema-types";
import { StateFieldValueTypes, StateName, UseStateReturnType } from "./state";

export type ReactDynamicFieldSchema = FieldSchema;
export type ReactDynamicFieldsSchema = FieldsSchema;
export type ReactDynamicFieldsSchemaRules = FieldSchemaRules;
export type ReactDynamicFieldsFieldsSchemaTypes = FieldsSchemaTypes;
export type ReactDynamicFieldsUseStateReturnType = UseStateReturnType;

export type ReactDynamicFieldsValueTypes = StateFieldValueTypes;
export type ReactDynamicFieldSchemaFieldsValueVariants =
  FieldSchemaFieldsValueVariants;

export type ReactDynamicFieldsRenderField<ActionProps, Value> = {
  actionProperties: ActionProps;
  value: Value;
  fieldErrorMessage: string;
};

export type ReactDynamicFieldsRenderFields = ({
  fieldName,
}: {
  fieldName: string;
}) => {
  input?: (
    props: ReactDynamicFieldsRenderField<
      ReactDynamicFieldsFieldsSchemaTypes["string"]["fieldConditions"][0]["action"],
      ReactDynamicFieldsFieldsSchemaTypes["string"]["defaultValue"]
    >
  ) => React.ReactNode;
  number?: (
    props: ReactDynamicFieldsRenderField<
      ReactDynamicFieldsFieldsSchemaTypes["number"]["fieldConditions"][0]["action"],
      ReactDynamicFieldsFieldsSchemaTypes["number"]["defaultValue"]
    >
  ) => React.ReactNode;
  select?: (
    props: ReactDynamicFieldsRenderField<
      ReactDynamicFieldsFieldsSchemaTypes["select"]["fieldConditions"][0]["action"],
      ReactDynamicFieldsFieldsSchemaTypes["select"]["defaultValue"]
    > &
      ReactDynamicFieldsFieldsSchemaTypes["select"]
  ) => React.ReactNode | Promise<React.ReactNode>;
};

export type ReactDynamicFieldProps = {
  stateName: StateName;
  fieldSchema: ReactDynamicFieldSchema;
  renderFields: ReactDynamicFieldsRenderFields;
};

export type ReactDynamicFieldsProps = {
  stateName: StateName;
  renderSchema: (props: {
    ReactDynamicField: (props: ReactDynamicFieldProps) => JSX.Element | null;
    controller: ReactDynamicFieldsUseStateReturnType;
  }) => React.ReactNode;
};
