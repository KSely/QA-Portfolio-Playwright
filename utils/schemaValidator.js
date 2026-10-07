import Ajv from "ajv";

const ajv = new Ajv({ allErrors: true });

export function createSchemaValidator(schema) {
  const validate = ajv.compile(schema);

  return (data) => {
    const valid = validate(data);

    return {
      valid,
      errors: validate.errors || [],
    };
  };
}
