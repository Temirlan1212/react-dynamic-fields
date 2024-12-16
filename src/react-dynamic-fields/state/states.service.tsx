import React, { createContext, useContext, useState, useCallback } from "react";

// Types
import {
  StateFieldsErrors,
  StateFieldsValues,
  StateFieldsRules,
  StateTouchedFields,
  StateFieldsSchema,
} from "./types";
import { StateName, StateServiceMethodsParams } from "./types";

export type StatesStatusProps = Omit<
  StateServiceMethodsParams["updateStateStatus"],
  "stateName"
>;

// Context Types
export interface StateContextType {
  statesValues: Record<StateName, StateFieldsValues>;
  statesErrors: Record<StateName, StateFieldsErrors>;
  statesTouchedFields: Record<StateName, StateTouchedFields>;
  statesStatus: Record<StateName, StatesStatusProps>;
  updateFieldRules: (
    params: StateServiceMethodsParams["updateFieldRules"]
  ) => void;
  updateFieldValue: (
    params: StateServiceMethodsParams["updateFieldValue"]
  ) => void;
  setFieldError: (params: StateServiceMethodsParams["setFieldError"]) => void;
  validateField: (params: StateServiceMethodsParams["validateField"]) => {
    stateName: StateName;
    fieldName: StateName;
    error: StateName;
  };
  getFieldRules: (
    params: StateServiceMethodsParams["getFieldRules"]
  ) => StateFieldsSchema[0]["rules"];
  isStateValid: (stateName: StateName) => boolean;
  isStateTouched: (stateName: StateName) => boolean;
  updateStateStatus: (
    params: StateServiceMethodsParams["updateStateStatus"]
  ) => void;
}

// Initial Context
const StateContext = createContext<StateContextType | null>(null);

// Provider Component
export const StateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [statesStatus, setStatesStatus] = useState<
    Record<
      string,
      { isSubmitted: boolean; submitCount: number; isValid: boolean }
    >
  >({});

  const [statesValues, setStatesValues] = useState<
    Record<string, StateFieldsValues>
  >({});
  const [statesErrors, setStatesErrors] = useState<
    Record<string, StateFieldsErrors>
  >({});
  const [statesTouchedFields, setStatesTouchedFields] = useState<
    Record<string, StateTouchedFields>
  >({});
  const [statesFieldsRules, setStatesFieldsRules] = useState<
    Record<string, StateFieldsRules>
  >({});

  // Update field statesStatuses
  const updateStateStatus = useCallback(
    ({
      stateName,
      ...rest
    }: StateServiceMethodsParams["updateStateStatus"]) => {
      setStatesStatus((prev) => {
        return { ...prev, [stateName]: { ...rest } };
      });
    },
    []
  );

  // Update field rules
  const updateFieldRules = useCallback(
    ({
      stateName,
      fieldName,
      value,
    }: StateServiceMethodsParams["updateFieldRules"]) => {
      setStatesFieldsRules((prev) => {
        const prevFieldRules = JSON.parse(prev[stateName]?.[fieldName] || "{}");
        if (JSON.stringify(prevFieldRules) === JSON.stringify(value))
          return prev;

        return {
          ...prev,
          [stateName]: {
            ...prev[stateName],
            [fieldName]: JSON.stringify(value),
          },
        };
      });
    },
    []
  );

  // Update field value
  const updateFieldValue = useCallback(
    ({
      stateName,
      fieldName,
      value,
    }: StateServiceMethodsParams["updateFieldValue"]) => {
      setStatesValues((prev) => ({
        ...prev,
        [stateName]: {
          ...prev[stateName],
          [fieldName]: value,
        },
      }));

      setStatesTouchedFields((prev) => ({
        ...prev,
        [stateName]: {
          ...prev[stateName],
          [fieldName]: true,
        },
      }));
    },
    []
  );

  // Set field error
  const setFieldError = useCallback(
    ({
      stateName,
      fieldName,
      error,
    }: StateServiceMethodsParams["setFieldError"]) => {
      setStatesErrors((prev) => ({
        ...prev,
        [stateName]: {
          ...prev[stateName],
          [fieldName]: error,
        },
      }));
    },
    [setStatesErrors]
  );

  // Validate field
  const validateField = useCallback(
    ({
      stateName,
      fieldName,
      rules,
    }: StateServiceMethodsParams["validateField"]) => {
      const value = statesValues[stateName]?.[fieldName];
      let state = { stateName, fieldName, error: "" };

      if (rules.required && !value) {
        state = { ...state, error: "This field is required!" };
        setFieldError(state);
      } else {
        setFieldError(state);
      }

      return state;
    },
    [statesValues, statesFieldsRules, setFieldError]
  );

  // Get field rules
  const getFieldRules = useCallback(
    ({ stateName, fieldName }: StateServiceMethodsParams["getFieldRules"]) => {
      return JSON.parse(
        statesFieldsRules[stateName]?.[fieldName] || "{}"
      ) as StateFieldsSchema[0]["rules"];
    },
    [statesFieldsRules]
  );

  // Check if state is valid
  const isStateValid = useCallback(
    (stateName: string) => {
      return Object.values(statesErrors[stateName] || {}).every(
        (error) => !error
      );
    },
    [statesErrors]
  );

  // Check if state is touched
  const isStateTouched = useCallback(
    (stateName: string) => {
      return Object.values(statesTouchedFields[stateName] || {}).some(
        (touched) => touched === true
      );
    },
    [statesTouchedFields]
  );

  return (
    <StateContext.Provider
      value={{
        statesValues,
        statesErrors,
        statesTouchedFields,
        statesStatus,
        updateFieldRules,
        updateFieldValue,
        setFieldError,
        validateField,
        getFieldRules,
        isStateValid,
        isStateTouched,
        updateStateStatus,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

// Hook to use the context
export const useStatesService = (): StateContextType => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useStatesService must be used within a StateProvider");
  }
  return context;
};
