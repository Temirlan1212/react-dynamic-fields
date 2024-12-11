"use client";
import { ReactDynamicFieldProps } from "./types";
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

  const rules = stateMethods.getConditionRules({ fieldConditions });

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

  const { input, number } = renderFields({ fieldName });

  const renderInput = () => {
    if (fieldType === "string" && input) {
      return input({
        rules: rules,
        value: fieldValue,
        fieldErrorMessage: fieldErrorMessage,
      });
    }
  };

  const renderNumber = () => {
    if (fieldType === "number" && number) {
      return number({
        rules: rules,
        value: fieldValue,
        fieldErrorMessage: fieldErrorMessage,
      });
    }
  };

  return (
    <>
      {renderInput()}
      {renderNumber()}
    </>
  );
}
