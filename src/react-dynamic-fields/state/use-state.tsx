import React, { useEffect } from "react";
import { StatesStatusProps, useStatesService } from "./states.service";
import { StateFieldsSchema, StateName, UseStateMethodsParams } from "./types";
import { ReactDynamicFieldSchema } from "../types";
import { compareValues } from "../lib/comparison";
import { reactDynamicFieldsSchemaDefaultRules } from "..";

export const useState = (stateName: StateName) => {
  const {
    statesValues,
    statesErrors,
    statesStatus,
    statesTouchedFields,
    updateFieldValue,
    updateFieldRules,
    validateField,
    isStateValid,
    getFieldRules,
    isStateTouched,
    updateStateStatus,
  } = useStatesService();

  // Get state status
  const getStateStatus = (): StatesStatusProps | undefined =>
    statesStatus?.[stateName];

  // Get values
  const getValues = React.useCallback(() => {
    return statesValues[stateName] || {};
  }, [statesValues, stateName]);

  // Get errors
  const getErrors = React.useCallback(() => {
    return statesErrors[stateName] || {};
  }, [statesErrors, stateName]);

  // Get touched fields
  const getTouchedFields = React.useCallback(() => {
    return statesTouchedFields[stateName] || {};
  }, [statesTouchedFields, stateName]);

  const getConditionsRules = ({
    fieldConditions,
  }: Pick<ReactDynamicFieldSchema, "fieldConditions">) => {
    return fieldConditions
      .map(({ value, comparison, action, fieldName }) => {
        const targetValue = getValues()?.[fieldName];
        const isMatch = compareValues(targetValue, value, comparison);
        return isMatch ? action.rules : null;
      })
      .filter((item) => item != null);
  };

  const getConditionRules = (
    props: Pick<ReactDynamicFieldSchema, "fieldConditions">
  ) => {
    let conditionRules = reactDynamicFieldsSchemaDefaultRules;

    getConditionsRules(props).map((rules) => {
      for (let key in rules) {
        const rule = rules[key as keyof typeof rules];
        if (rule) conditionRules = { ...conditionRules, [key]: rule };
      }
    });

    return conditionRules;
  };

  const getFieldSchema = ({
    fieldsSchema,
    byName,
  }: {
    fieldsSchema: StateFieldsSchema;
    byName: string;
  }) => {
    return fieldsSchema.find((fieldSchema) => fieldSchema.fieldName === byName);
  };

  // Submit handler
  const submit = React.useCallback(
    ({ fieldsSchema }: { fieldsSchema: StateFieldsSchema }) => {
      const currentValues = getValues();
      const errors: Record<string, string> = {};

      Object.keys(currentValues).forEach((fieldName) => {
        const fieldSchema = getFieldSchema({ fieldsSchema, byName: fieldName });
        if (fieldSchema == null) return;
        const conditionRules = getConditionRules({
          fieldConditions: fieldSchema.fieldConditions,
        });

        let result: ReturnType<typeof validateField> = validateField({
          stateName,
          fieldName,
          rules: fieldSchema.rules,
        });
        if (!result.error)
          result = validateField({
            stateName,
            fieldName,
            rules: conditionRules,
          });
        if (result.error) {
          errors[fieldName] = result.error;
        }
      });

      const isValid = Object.keys(errors).length === 0;

      const stateStatus = getStateStatus();
      if (stateStatus != undefined) {
        updateStateStatus({
          isSubmitted: true,
          submitCount: stateStatus.submitCount + 1,
          isValid: isValid,
          stateName,
        });
      }

      return { isValid, errors };
    },
    [stateName, getValues, validateField]
  );

  useEffect(() => {
    if (stateName == null) return;
    const stateStatus = getStateStatus();
    if (stateStatus != undefined) return;
    updateStateStatus({
      isSubmitted: false,
      submitCount: 0,
      isValid: true,
      stateName,
    });
  }, [stateName]);

  return {
    stateName,
    statesStatus,
    getStateStatus,
    getValues,
    getErrors,
    getConditionsRules,
    getConditionRules,
    getTouchedFields,
    updateFieldValue: (params: UseStateMethodsParams["updateFieldValue"]) =>
      updateFieldValue({ ...params, stateName }),
    updateFieldRules: (params: UseStateMethodsParams["updateFieldRules"]) =>
      updateFieldRules({ ...params, stateName }),
    getFieldRules: (params: UseStateMethodsParams["getFieldRules"]) =>
      getFieldRules({ ...params, stateName }),
    validateField: (params: UseStateMethodsParams["validateField"]) =>
      validateField({ ...params, stateName }),
    isStateValid: () => isStateValid(stateName),
    isStateTouched: () => isStateTouched(stateName),
    submit,
  };
};

export type UseStateReturnType = ReturnType<typeof useState>;
