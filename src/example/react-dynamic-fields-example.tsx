import {
  ReactDynamicField,
  ReactDynamicFields,
  ReactDynamicFieldsProvider,
  ReactDynamicFieldsSchema,
} from "../react-dynamic-fields";

const fieldsSchema: ReactDynamicFieldsSchema = [
  {
    defaultValue: {},
    fieldType: "select",
    fieldName: "select-disable",
    placeholder: "select",
    rules: {},
    fieldConditions: [],
    options: [],
    fetchOptions: async () => {
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries/population/cities"
      );
      const data = await response.json();
      return { data: data.data };
    },
    labelFieldName: "country",
    valueFieldName: "city",
  },
  {
    fieldType: "string",
    fieldName: "title",
    placeholder: "Заголовок",
    defaultValue: "",
    style: { width: "600px" },
    rules: {
      required: false,
      maxLength: undefined,
      hidden: false,
      disabled: false,
      minLength: undefined,
    },
    fieldConditions: [
      {
        depandFieldName: "select-disable",
        comparison: "includesInObject",
        value: "TIRANA",
        action: {
          rules: {
            disabled: true,
          },
          styles: {
            style: { width: "100px" },
            className: "",
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
        depandFieldName: "select-disable",
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

const stateName = "state";

export function ReactDynamicFieldsExample() {
  return (
    <>
      <ReactDynamicFieldsProvider>
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
                          input: ({
                            actionProperties: { rules, styles },
                            value,
                            fieldErrorMessage,
                          }) => {
                            return (
                              <>
                                <input
                                  style={styles?.style || fieldSchema.style}
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
                          select: ({
                            value,
                            options,
                            fieldErrorMessage,
                            labelFieldName,
                            valueFieldName,
                          }) => {
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
                                      (option) =>
                                        option?.[valueFieldName] === value
                                    );
                                    if (!option) return;
                                    controller.updateFieldValue({
                                      fieldName,
                                      value: option,
                                    });
                                  }}
                                >
                                  {options.map((option, index) => {
                                    const value = option?.[valueFieldName];
                                    const label = option?.[labelFieldName];
                                    return (
                                      <option
                                        key={index + " " + value}
                                        value={value}
                                      >
                                        {label}
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
      </ReactDynamicFieldsProvider>
    </>
  );
}
