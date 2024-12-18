import { useEffect, useState } from "react";
import {
  FieldSchemaFieldsValueVariants,
  FieldsSchemaTypes,
} from "./field-schema-types";

export const useOptions = ({
  fieldSchema,
}: {
  fieldSchema: FieldsSchemaTypes["select"] | null;
}) => {
  const [options, setOptions] = useState<
    FieldSchemaFieldsValueVariants["OPTION"][]
  >([]);

  useEffect(() => {
    if (options.length < 1 && fieldSchema?.options)
      setOptions(fieldSchema.options);
  }, [fieldSchema?.options]);

  useEffect(() => {
    const handleFetchOptons = async () => {
      if (fieldSchema?.fetchOptions) {
        try {
          const { data } = await fieldSchema.fetchOptions();
          if (data) setOptions(data);
        } catch (error) {}
      }
    };
    handleFetchOptons();
  }, [fieldSchema?.fetchOptions]);

  return { options };
};
