import { ReactDynamicField, ReactDynamicFields } from "../react-dynamic-fields";
import { ReactDynamicFieldsSchema } from "../react-dynamic-fields/types";
import { StateProvider } from "../state";

const fieldsSchema: ReactDynamicFieldsSchema = [
  {
    defaultValue: { value: "summary", label: "summary" },
    fieldType: "select",
    fieldName: "select-disable",
    placeholder: "select",
    rules: {},
    fieldConditions: [],
    options: [
      { value: "title", label: "title" },
      { value: "summary", label: "summary" },
    ],
  },
  {
    fieldType: "string",
    fieldName: "title",
    placeholder: "Заголовок",
    defaultValue: "",
    rules: {
      required: false,
      maxLength: undefined,
      hidden: false,
      disabled: false,
      minLength: undefined,
    },
    fieldConditions: [
      {
        fieldName: "select-disable",
        comparison: "deepEquals",
        value: { value: "title", label: "title" },
        action: {
          rules: {
            disabled: true,
          },
        },
      },
      {
        fieldName: "summary",
        comparison: "equals",
        value: "limited",
        action: {
          rules: {
            maxLength: 2,
          },
        },
      },
      {
        fieldName: "new",
        comparison: "equals",
        value: "required",
        action: {
          rules: {
            required: true,
          },
        },
      },
    ],
  },
  {
    fieldType: "string",
    fieldName: "summary",
    placeholder: "Summary",
    rules: {},
    defaultValue: "",
    fieldConditions: [
      {
        fieldName: "select-disable",
        comparison: "deepEquals",
        value: { value: "summary", label: "summary" },
        action: {
          rules: {
            disabled: true,
          },
        },
      },
    ],
  },
  {
    defaultValue: "",
    fieldType: "string",
    fieldName: "new",
    placeholder: "New",
    rules: {},
    fieldConditions: [],
  },
];

const fieldsSchema2: ReactDynamicFieldsSchema = [
  {
    fieldType: "string",
    fieldName: "test",
    placeholder: "Test",
    defaultValue: "",
    rules: {
      required: false,
      maxLength: undefined,
      hidden: false,
      disabled: false,
      minLength: undefined,
    },
    fieldConditions: [
      {
        fieldName: "summary",
        comparison: "equals",
        value: "disabled",
        action: {
          rules: {
            disabled: true,
          },
        },
      },
    ],
  },
];

const stateName = "newForm-2";
const stateName2 = "newForm-2";

export function ReactDynamicFieldsExample() {
  return (
    <>
      <StateProvider>
        <ReactDynamicFields
          stateName={stateName}
          renderSchema={({ controller }) => {
            return (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  controller.submit({ fieldsSchema });
                  console.log(controller.getValues());
                }}
              >
                {fieldsSchema.map((fieldSchema, index) => {
                  return (
                    <ReactDynamicField
                      key={index}
                      renderFields={({ fieldName }) => {
                        return {
                          input: ({ rules, value, fieldErrorMessage }) => {
                            return (
                              <>
                                <input
                                  disabled={rules.disabled}
                                  maxLength={rules.maxLength}
                                  minLength={rules.minLength}
                                  defaultValue={value || ""}
                                  className="border"
                                  value={value || ""}
                                  placeholder={fieldSchema.placeholder}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    controller.updateFieldValue({
                                      fieldName,
                                      value,
                                    });
                                  }}
                                />
                                {fieldErrorMessage}
                              </>
                            );
                          },
                          select: ({ value, options, fieldErrorMessage }) => {
                            if (value == null) return;

                            return (
                              <>
                                <select
                                  defaultValue={value.value}
                                  name={value.value}
                                  id={value.value}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    const option = options.find(
                                      (option) => option.value === value
                                    );
                                    if (!option) return;
                                    controller.updateFieldValue({
                                      fieldName,
                                      value: option,
                                    });
                                  }}
                                >
                                  {options.map((option, index) => {
                                    return (
                                      <option
                                        key={index + " " + option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </option>
                                    );
                                  })}
                                </select>
                                {fieldErrorMessage}
                              </>
                            );
                          },
                        };
                      }}
                      fieldSchema={fieldSchema}
                      stateName={stateName}
                    />
                  );
                })}

                <button type="submit">submit</button>
              </form>
            );
          }}
        />

        <ReactDynamicFields
          stateName={stateName2}
          renderSchema={({ controller }) => {
            return (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  controller.submit({ fieldsSchema: fieldsSchema2 });
                }}
              >
                {fieldsSchema2.map((fieldSchema, index) => {
                  return (
                    <ReactDynamicField
                      key={index}
                      renderFields={({ fieldName }) => {
                        return {
                          input: ({ rules, value, fieldErrorMessage }) => {
                            return (
                              <>
                                <input
                                  disabled={rules.disabled}
                                  maxLength={rules.maxLength}
                                  minLength={rules.minLength}
                                  defaultValue={(value as string) || ""}
                                  className="border"
                                  value={(value as string) || ""}
                                  placeholder={fieldSchema.placeholder}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    controller.updateFieldValue({
                                      fieldName,
                                      value,
                                    });
                                  }}
                                />
                                {fieldErrorMessage}
                              </>
                            );
                          },
                        };
                      }}
                      fieldSchema={fieldSchema}
                      stateName={stateName2}
                    />
                  );
                })}

                <button type="submit">submit</button>
              </form>
            );
          }}
        />
      </StateProvider>
    </>
  );
}
