import {
  FieldSchema,
  FieldSchemaRules,
  FieldsSchema,
  FieldSchemaFieldsValueVariants,
} from "../fields-schema";
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
export type ReactDynamicFieldSchemaFieldsValueVariants =
  FieldSchemaFieldsValueVariants;

export type ReactDynamicFieldsRenderField<Rules, Value> = {
  rules: Rules;
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
      ReactDynamicFieldsFieldsSchemaTypes["string"]["rules"],
      ReactDynamicFieldsFieldsSchemaTypes["string"]["defaultValue"]
    >
  ) => React.ReactNode;
  number?: (
    props: ReactDynamicFieldsRenderField<
      ReactDynamicFieldsFieldsSchemaTypes["number"]["rules"],
      ReactDynamicFieldsFieldsSchemaTypes["number"]["defaultValue"]
    >
  ) => React.ReactNode;
  select?: (
    props: ReactDynamicFieldsRenderField<
      ReactDynamicFieldsFieldsSchemaTypes["select"]["rules"],
      ReactDynamicFieldsFieldsSchemaTypes["select"]["defaultValue"]
    > & {
      options: ReactDynamicFieldsFieldsSchemaTypes["select"]["defaultValue"][];
    }
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
