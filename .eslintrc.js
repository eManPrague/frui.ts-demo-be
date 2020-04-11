module.exports = {
  extends: [
    "@emanprague/eslint-config/eslint-default"
  ],
  rules: {
    "@typescript-eslint/camelcase": ["error", { "properties": "never" }]
  }
};
