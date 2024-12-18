# react-dynamic-fields-core

**`react-dynamic-fields-core`** is a dynamic library for creating flexible, condition-based forms in React. Define field schemas, handle field conditions, and manage form states effortlessly.

---

## Features

- **Dynamic Form Rendering**: Build forms based on a JSON schema.
- **Field Conditions**: Automatically manage field rules (e.g., disabled, hidden) based on other fields' states.
- **Custom Rendering**: Supports custom rendering of field components.
- **Centralized State Management**: Manage form states efficiently.
- **TypeScript Support**: Fully typed for a robust developer experience.

---

## Installation

Install the package using `npm` or `yarn`:

```bash
npm install react-dynamic-fields-core
```

or

```bash
yarn add react-dynamic-fields-core
```

---

## Usage

### 1. Import the Required Components

```tsx
import {
  ReactDynamicField,
  ReactDynamicFields,
  ReactDynamicFieldsProvider,
  ReactDynamicFieldsSchema,
} from "react-dynamic-fields-core";
```

### 2. Define a Field Schema

A field schema specifies form fields, their rules, and conditional logic.

```tsx
const fieldsSchema: ReactDynamicFieldsSchema = [
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
        otherFieldName: "select-to-disable",
        comparison: "includesInObject",
        value: "title",
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
        otherFieldName: "select-to-disable",
        comparison: "includesInObject",
        value: "summary",
        action: {
          rules: {
            disabled: true,
          },
        },
      },
    ],
  },
  {
    defaultValue: {},
    fieldType: "select",
    fieldName: "cities",
    placeholder: "Города",
    rules: {},
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
    fieldConditions: [
      {
        otherFieldName: "select-to-disable",
        comparison: "includesInObject",
        value: "cities",
        action: {
          rules: {
            disabled: true,
          },
        },
      },
    ],
  },
];

const fieldsSchemaExtended: ReactDynamicFieldsSchema = [
  {
    defaultValue: {},
    fieldType: "select",
    fieldName: "select-to-disable",
    placeholder: "Select field you want to disable",
    rules: {},
    fieldConditions: [],
    options: fieldsSchema as unknown as Record<string, string>[],
    labelFieldName: "placeholder",
    valueFieldName: "fieldName",
  },
  ...fieldsSchema,
];
```

### 3. Render the Form

```tsx
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
                  controller.submit({ fieldsSchema: fieldsSchemaExtended });
                  console.log(controller.getValues());
                }}
              >
                {fieldsSchemaExtended.map((fieldSchema, index) => {
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
                            actionProperties: { rules, styles },
                          }) => {
                            if (value == null) return;

                            return (
                              <>
                                <select
                                  style={styles?.style}
                                  disabled={rules.disabled}
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
```

---

## Props

### `ReactDynamicFields`

| Prop           | Type       | Description                         |
| -------------- | ---------- | ----------------------------------- |
| `stateName`    | `string`   | Unique identifier for form state.   |
| `renderSchema` | `function` | Function to render the form schema. |

### `ReactDynamicField`

| Prop           | Type       | Description                          |
| -------------- | ---------- | ------------------------------------ |
| `fieldSchema`  | `object`   | Schema for a single field.           |
| `stateName`    | `string`   | Identifier for managing field state. |
| `renderFields` | `function` | Function to render field components. |

---

## Schema Structure

A schema object can contain the following properties:

| Key               | Type                 | Description                             |
| ----------------- | -------------------- | --------------------------------------- |
| `fieldType`       | `string`             | Type of the field (`string`, `select`). |
| `fieldName`       | `string`             | Unique field name.                      |
| `placeholder`     | `string`             | Placeholder text for the field.         |
| `defaultValue`    | `any`                | Default value for the field.            |
| `rules`           | `object`             | Validation rules (e.g., required).      |
| `fieldConditions` | `array`              | Conditional logic for field rules.      |
| `options`         | `array` (for select) | Options for dropdown fields.            |

Example `fieldConditions`:

```json
{
  "otherFieldName": "other-field",
  "comparison": "equals",
  "value": "disabled",
  "action": {
    "rules": {
      "disabled": true
    }
  }
}
```

---

## License

[MIT](./LICENSE)

---

## Contributions

Contributions are welcome! Open an issue or submit a pull request to improve the library.
