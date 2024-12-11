# Dynamic Form Documentation

This project demonstrates a dynamic form implementation using `ReactDynamicFields`, `ReactDynamicField`, and `StateProvider`. The form system allows creating schema-driven forms with conditional logic and dynamic behavior.

## Overview

The dynamic form system supports:

1. **Schema-Driven Field Rendering**: Form fields are defined by a schema (`ReactDynamicFieldsSchema`) that describes field properties, rules, and conditions.
2. **Conditional Logic**: Fields dynamically update rules such as `disabled`, `required`, or `maxLength` based on the value of other fields.
3. **State Management**: The `StateProvider` manages form states, enabling seamless field interactions.
4. **Reusable Components**: Fields and forms are modular and reusable across different configurations.

## Components

### 1. `StateProvider`

This component provides the context for managing form states. It allows forms and their fields to interact independently.

### 2. `ReactDynamicFields`

A component that renders a form based on a schema and provides a `controller` for handling form actions such as field updates and submissions.

### 3. `ReactDynamicField`

A component representing a single field. It renders the field based on its schema and integrates it with the form's state.

---

## Usage

### 1. Define Field Schemas

Field schemas define the structure and behavior of form fields. Below is an example schema:

```typescript
const fieldsSchema: ReactDynamicFieldsSchema = [
  {
    fieldType: "string",
    fieldName: "title",
    placeholder: "Title",
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
```

### 2. Integrate with `ReactDynamicFields`

Use the `ReactDynamicFields` component to render the form:

```tsx
<ReactDynamicFields
  stateName="formState"
  renderSchema={({ controller }) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        controller.submit({ fieldsSchema });
      }}
    >
      {fieldsSchema.map((fieldSchema, index) => (
        <ReactDynamicField
          key={index}
          fieldSchema={fieldSchema}
          stateName="formState"
          renderFields={({ fieldName }) => ({
            input: ({ rules, value, fieldErrorMessage }) => (
              <>
                <input
                  disabled={rules.disabled}
                  maxLength={rules.maxLength}
                  minLength={rules.minLength}
                  defaultValue={(value as string) || ""}
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
          })}
        />
      ))}
      <button type="submit">Submit</button>
    </form>
  )}
/>
```

### 3. Add Conditional Logic

Field conditions allow dynamic updates based on other field values. For example:

```typescript
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
];
```

When the `summary` field equals "disabled," the `title` field will be disabled.

### 4. State Management

Each form uses a unique `stateName` to manage its state. This ensures independence between forms:

```tsx
const stateName = "form1";
const stateName2 = "form2";

<StateProvider>
  <ReactDynamicFields stateName={stateName} renderSchema={...} />
  <ReactDynamicFields stateName={stateName2} renderSchema={...} />
</StateProvider>
```

---

## Example

Below is a complete example:

```tsx
export function ReactDynamicFieldsExample() {
  return (
    <StateProvider>
      <ReactDynamicFields
        stateName="exampleForm"
        renderSchema={({ controller }) => (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              controller.submit({ fieldsSchema });
            }}
          >
            {fieldsSchema.map((fieldSchema, index) => (
              <ReactDynamicField
                key={index}
                fieldSchema={fieldSchema}
                stateName="exampleForm"
                renderFields={({ fieldName }) => ({
                  input: ({ rules, value, fieldErrorMessage }) => (
                    <>
                      <input
                        disabled={rules.disabled}
                        maxLength={rules.maxLength}
                        minLength={rules.minLength}
                        defaultValue={(value as string) || ""}
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
                })}
              />
            ))}
            <button type="submit">Submit</button>
          </form>
        )}
      />
    </StateProvider>
  );
}
```

---

## Features

- Dynamic field generation based on schema
- Conditional rules for field behavior
- Modular and reusable components
- State isolation for multiple forms

---

## Future Improvements

- Add support for additional field types (e.g., `select`, `checkbox`)
- Enhance validation rules
- Improve styling and theming support

---

## License

This project is licensed under [MIT License](LICENSE).
