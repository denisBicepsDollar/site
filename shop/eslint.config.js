import js from "@eslint/js";
import globals from "globals";
import json from "@eslint/json";
import css from "@eslint/css";
import {defineConfig} from "eslint/config";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs}"],
        plugins: {js},
        extends: ["js/recommended"],
        languageOptions: {globals: globals.browser},
    },
    {files: ["**/*.json"], plugins: {json}, language: "json/json", extends: ["json/recommended"]},
    {files: ["**/*.css"], plugins: {css}, language: "css/css", extends: ["css/recommended"]},
    {
        files: ["**/*.css"],
        plugins: {css},
        language: "css/css",
        extends: ["css/recommended"],
        rules: {
            "css/no-invalid-properties": "off",


            // Отключаем проверку на Baseline (уберет ошибки про accent-color, resize, backdrop-filter, clip)
            "css/use-baseline": "off",

            // Разрешаем использование !important в стилях
            "css/no-important": "off",
        },
    },
]);
