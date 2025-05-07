const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");
const prettier = require("eslint-plugin-prettier");
const globals = require("globals");
const prettierConfig = require("eslint-config-prettier");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = [{
    ignores: [
        "**/node_modules/",
        "**/playground.js",
        "**/build-cdn/",
        "**/jest.config.js",
        "**/jest.config.ts",
        "eslint.config.js",
    ],
}, ...compat.extends("eslint:recommended"), {
    plugins: {
        prettier,
    },

    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.browser,
            ...globals.commonjs,
            ...globals.jest,
        },

        ecmaVersion: 12,
        sourceType: "commonjs",

        parserOptions: {
            project: "./tsconfig.json",
        },
    },
    files: [
        "**/*.js",
    ],
    rules: {
        ...prettierConfig.rules,
        "prettier/prettier": ["warn"],
        "require-await": "error",
        "no-unreachable": "off",
        // "@typescript-eslint/no-floating-promises": ["error"],
        "lines-between-class-members": [1, "always"],
        "comma-dangle": 0,

        "padded-blocks": ["off", {
            classes: "always",
        }],
    },
}];
