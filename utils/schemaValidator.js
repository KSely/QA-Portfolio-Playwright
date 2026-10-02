const Ajv = require("ajv");

const ajv = new Ajv({ allErrors: true });

function createSchemaValidator(schema) {
  const validate = ajv.compile(schema);

  return (data) => {
    const valid = validate(data);

    return {
      valid,
      errors: validate.errors || [],
    };
  };
}

module.exports = {
  createSchemaValidator,
};
