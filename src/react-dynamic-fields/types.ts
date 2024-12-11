import { FieldSchema, FieldSchemaRules, FieldsSchema } from "../fields-schema";
import {
  StateFieldValueTypes,
  FieldsSchemaTypes,
  StateName,
} from "../shared/shared-types";
import { UseStateReturnType } from "../state/use-state";

export type ReactDynamicFieldSchema = FieldSchema;
export type ReactDynamicFieldsSchema = FieldsSchema;
export type ReactDynamicFieldsSchemaRules = FieldSchemaRules;
export type ReactDynamicFieldsFieldsSchemaTypes = FieldsSchemaTypes;
export type ReactDynamicFieldsUseStateReturnType = UseStateReturnType;

export type ReactDynamicFieldsValueTypes = StateFieldValueTypes;

export type ReactDynamicFieldsRenderField<Rules> = {
  rules: Rules;
  value: ReactDynamicFieldsValueTypes;
  fieldErrorMessage: string;
};

export type ReactDynamicFieldsRenderFields = ({
  fieldName,
}: {
  fieldName: string;
}) => {
  input?: (
    props: ReactDynamicFieldsRenderField<
      ReactDynamicFieldsFieldsSchemaTypes["string"]["rules"]
    >
  ) => React.ReactNode;
  number?: (
    props: ReactDynamicFieldsRenderField<
      ReactDynamicFieldsFieldsSchemaTypes["number"]["rules"]
    >
  ) => React.ReactNode;
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
