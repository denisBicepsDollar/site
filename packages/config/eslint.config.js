import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import {defineConfig, globalIgnores} from 'eslint/config'
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
    globalIgnores(['**/dist/**', '**/build/**', '**/next/**']),
    {
        files: ['**/*.{js,jsx}'],
        extends: [
            js.configs.recommended,
        ],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: "module",
            globals: globals.browser,
            parserOptions: {
                ecmaFeatures: {jsx: true},
            },
        },
    },
    {
        files: ["apps/admin/**/*.{js,jsx}"],
        extends: [
            reactHooks.config.flat.recommended,
            reactRefresh.configs.vite,
        ],
        rules: {
            "no-unused-vars": ["error", {varsIgnorePattern: "^[A-Z_]"}],
        }
    },
    {
        files: ["apps/web/**/*.{js,jsx}"],
        extends: [
            ...nextVitals,
        ],
    },
])
