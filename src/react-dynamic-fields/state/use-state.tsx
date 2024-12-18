import React, { useEffect } from "react";
import { StatesStatusProps, useStatesService } from "./states.service";
import { StateFieldsSchema, StateName, UseStateMethodsParams } from "./types";
import { ReactDynamicFieldSchema } from "../types";
import { compareValues } from "../lib/comparison";
import { reactDynamicFieldsSchemaDefaultRules } from "..";
import { FieldSchemaStylesProperties } from "../lib/field-schema-types";

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

  const getMatchedConditions = ({
    fieldConditions,
  }: Pick<ReactDynamicFieldSchema, "fieldConditions">) => {
    return fieldConditions
      .map((condition) => {
        const { value, comparison, otherFieldName } = condition;
        const targetValue = getValues()?.[otherFieldName];
        const isMatch = compareValues(targetValue, value, comparison);
        return isMatch ? condition : null;
      })
      .filter((item) => item != null);
  };

  const getConditionActionProperties = (
    props: Pick<ReactDynamicFieldSchema, "fieldConditions">
  ) => {
    let conditionRules = reactDynamicFieldsSchemaDefaultRules;
    let conditionStyles: FieldSchemaStylesProperties["style"] | undefined =
      undefined;
    let conditionClassNames: FieldSchemaStylesProperties["className"][] = [];

    getMatchedConditions(props).forEach((condition) => {
      const rules = condition.action.rules;
      const styles = condition.action.styles?.style;
      const className = condition.action.styles?.className;

      for (let key in rules) {
        const rule = rules[key as keyof typeof rules];
        if (rule) conditionRules = { ...conditionRules, [key]: rule };
      }

      for (let key in styles) {
        const style = styles[key as keyof typeof styles];
        if (conditionStyles == null) conditionStyles = {};
        if (style) conditionStyles = { ...conditionStyles, [key]: style };
      }

      conditionClassNames.push(className);
    });

    return {
      rules: conditionRules,
      styles: {
        style: conditionStyles,
        className: conditionClassNames.join(" "),
      },
    };
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
        const conditionActionProperties = getConditionActionProperties({
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
            rules: conditionActionProperties.rules,
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
    getTouchedFields,
    getConditionActionProperties,
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
