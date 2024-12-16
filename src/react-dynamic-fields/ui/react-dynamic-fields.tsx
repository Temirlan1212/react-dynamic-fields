"use client";
import { useState } from "../state/use-state";
import { ReactDynamicField } from "./react-dynamic-field";
import { ReactDynamicFieldsProps } from "../types";

export function ReactDynamicFields({
  renderSchema,
  stateName,
}: ReactDynamicFieldsProps) {
  const controller = useState(stateName);

  return (
    <div className="p-5 flex flex-col gap-4">
      {renderSchema({
        ReactDynamicField,
        controller,
      })}
    </div>
  );
}
