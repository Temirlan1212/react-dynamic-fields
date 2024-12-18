"use client";
import {
  ReactDynamicFieldProps,
  ReactDynamicFieldsFieldsSchemaTypes,
} from "../types";
import { useState } from "../state/use-state";
import { useEffect } from "react";

export function ReactDynamicField({
  fieldSchema,
  renderFields,
  stateName,
}: ReactDynamicFieldProps) {
  const fieldType = fieldSchema.fieldType;
  const fieldName = fieldSchema.fieldName;
  const fieldConditions = fieldSchema.fieldConditions;
  const stateMethods = useState(stateName);

  const fieldValuesState = stateMethods.getValues();
  const fieldErrorsState = stateMethods.getErrors();
  const fieldValue = fieldValuesState[fieldName];
  const fieldErrorMessage = fieldErrorsState[fieldName];

  const conditionActionProperties = stateMethods.getConditionActionProperties({
    fieldConditions,
  });

  const rules = conditionActionProperties.rules;

  useEffect(() => {
    const stateStatus = stateMethods.getStateStatus();
    if (stateStatus == undefined) return;
    if (stateStatus.isSubmitted)
      stateMethods.validateField({ fieldName, rules });
  }, [fieldValuesState]);

  useEffect(() => {
    if (fieldValue != null) return;
    stateMethods.updateFieldValue({
      fieldName,
      value: fieldSchema.defaultValue,
    });
  }, [fieldSchema.defaultValue, fieldValue]);

  if (rules.hidden) return null;

  const { input, number, select } = renderFields({ fieldName });

  const renderInput = () => {
    if (fieldType === "string" && input && typeof fieldValue === typeof "") {
      return input({
        actionProperties: conditionActionProperties,
        value:
          fieldValue as ReactDynamicFieldsFieldsSchemaTypes["string"]["defaultValue"],
        fieldErrorMessage: fieldErrorMessage,
      });
    }
  };

  const renderNumber = () => {
    if (fieldType === "number" && number && typeof fieldValue === typeof 0) {
      return number({
        actionProperties: conditionActionProperties,
        value:
          fieldValue as ReactDynamicFieldsFieldsSchemaTypes["number"]["defaultValue"],
        fieldErrorMessage: fieldErrorMessage,
      });
    }
  };

  const renderSelect = () => {
    if (fieldType === "select" && select) {
      return select({
        actionProperties: conditionActionProperties,
        value:
          fieldValue as ReactDynamicFieldsFieldsSchemaTypes["select"]["defaultValue"],
        fieldErrorMessage: fieldErrorMessage,
        options: fieldSchema["options"],
      });
    }
  };

  return (
    <>
      {renderInput()}
      {renderNumber()}
      {renderSelect()}
    </>
  );
}
