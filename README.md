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
    defaultValue: { value: "summary", label: "summary" },
    fieldType: "select",
    fieldName: "select-disable",
    placeholder: "Select",
    options: [
      { value: "title", label: "Title" },
      { value: "summary", label: "Summary" },
    ],
  },
  {
    fieldType: "string",
    fieldName: "title",
    placeholder: "Enter Title",
    defaultValue: "",
    rules: { required: true },
    fieldConditions: [
      {
        fieldName: "select-disable",
        comparison: "deepEquals",
        value: { value: "title", label: "Title" },
        action: { rules: { disabled: true } },
      },
    ],
  },
];
```

### 3. Render the Form

```tsx
export function DynamicFormExample() {
  return (
    <ReactDynamicFieldsProvider>
      <ReactDynamicFields
        stateName="example-form"
        renderSchema={({ controller }) => (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              controller.submit({ fieldsSchema });
              console.log(controller.getValues());
            }}
          >
            {fieldsSchema.map((fieldSchema, index) => (
              <ReactDynamicField
                key={index}
                fieldSchema={fieldSchema}
                stateName="example-form"
                renderFields={({ fieldName }) => ({
                  input: ({ value, rules }) => (
                    <input
                      disabled={rules.disabled}
                      defaultValue={value as string}
                      placeholder={fieldSchema.placeholder}
                      onChange={(e) =>
                        controller.updateFieldValue({
                          fieldName,
                          value: e.target.value,
                        })
                      }
                    />
                  ),
                  select: ({ value, options }) => (
                    <select
                      defaultValue={value?.value}
                      onChange={(e) => {
                        const selected = options.find(
                          (opt) => opt.value === e.target.value
                        );
                        controller.updateFieldValue({
                          fieldName,
                          value: selected,
                        });
                      }}
                    >
                      {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ),
                })}
              />
            ))}
            <button type="submit">Submit</button>
          </form>
        )}
      />
    </ReactDynamicFieldsProvider>
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
  "fieldName": "other-field",
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
