# ReactDynamicFieldsExample

## Overview

The `ReactDynamicFieldsExample` demonstrates the usage of the `ReactDynamicFields` and `ReactDynamicField` components to dynamically generate and manage form fields in a React application. The example leverages a schema-driven approach for rendering fields, applying conditions, and handling form state using a `StateProvider`.

## Features

- Dynamically render input and select fields based on schema definitions.
- Support for field-level rules and conditional logic.
- Centralized state management for forms using `StateProvider`.
- Seamless integration with custom controllers to handle field values and validation.
- Built-in support for rendering multiple independent forms with distinct schemas.

## Installation

Ensure you have the following dependencies installed:

```bash
npm install react react-dom
```

For the required components (`ReactDynamicFields`, `ReactDynamicField`, and `StateProvider`), ensure they are imported or available in your project.

## Usage

### Code Example

Below is a minimal implementation of the `ReactDynamicFieldsExample` component:

```tsx
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
    ],
  },
];

const stateName = "exampleForm";

export function ReactDynamicFieldsExample() {
  return (
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
              {fieldsSchema.map((fieldSchema, index) => (
                <ReactDynamicField
                  key={index}
                  renderFields={({ fieldName }) => {
                    return {
                      input: ({ rules, value, fieldErrorMessage }) => (
                        <>
                          <input
                            disabled={rules.disabled}
                            maxLength={rules.maxLength}
                            defaultValue={value || ""}
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
                      ),
                      select: ({ value, options, fieldErrorMessage }) => (
                        <>
                          <select
                            defaultValue={value?.value}
                            onChange={(e) => {
                              const selectedValue = e.target.value;
                              const option = options.find(
                                (opt) => opt.value === selectedValue
                              );
                              if (!option) return;
                              controller.updateFieldValue({
                                fieldName,
                                value: option,
                              });
                            }}
                          >
                            {options.map((option, idx) => (
                              <option key={idx} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          {fieldErrorMessage}
                        </>
                      ),
                    };
                  }}
                  fieldSchema={fieldSchema}
                  stateName={stateName}
                />
              ))}

              <button type="submit">Submit</button>
            </form>
          );
        }}
      />
    </StateProvider>
  );
}
```

### Props

#### `ReactDynamicFields`

| Prop           | Type                    | Description                                 |
| -------------- | ----------------------- | ------------------------------------------- |
| `stateName`    | `string`                | Unique identifier for form state.           |
| `renderSchema` | `(args) => JSX.Element` | Function to render form schema dynamically. |

#### `ReactDynamicField`

| Prop           | Type                    | Description                                |
| -------------- | ----------------------- | ------------------------------------------ |
| `fieldSchema`  | `FieldSchema`           | Schema defining the field's configuration. |
| `stateName`    | `string`                | Unique identifier for form state.          |
| `renderFields` | `(args) => JSX.Element` | Function to render specific field types.   |

## Field Schema Structure

Each field in the schema should adhere to the following structure:

```ts
{
  fieldType: "string" | "select";  // Type of the field.
  fieldName: string;               // Unique name for the field.
  placeholder?: string;            // Placeholder text for the field.
  defaultValue?: any;              // Default value for the field.
  rules?: {
    required?: boolean;
    maxLength?: number;
    minLength?: number;
    hidden?: boolean;
    disabled?: boolean;
  };
  options?: Array<{ value: string; label: string }>; // For select fields only.
  fieldConditions?: Array<{
    fieldName: string;
    comparison: "equals" | "deepEquals";
    value: any;
    action: {
      rules: Partial<Rules>;
    };
  }>;
}
```

## How It Works

1. Define a schema (`fieldsSchema`) to configure fields and their behavior.
2. Use `ReactDynamicFields` to render the form dynamically based on the schema.
3. Handle state and actions via the provided `controller`.
4. Optionally apply conditional logic through `fieldConditions` in the schema.

## Running the Example

1. Integrate the component into your project.
2. Define `fieldsSchema` and ensure that `StateProvider` wraps your component tree.
3. Test dynamic rendering and conditional logic.

## License

This example is available under the MIT License.
