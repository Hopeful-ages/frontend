module.exports = {
  extends: [
    "next/core-web-vitals",
    "plugin:prettier/recommended" 
  ],
  plugins: [
    "prettier"
  ],
  rules: {
    "react-hooks/exhaustive-deps": "off",
    "no-console": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "no-debugger": "error",
    "prefer-const": "error"
  }
};