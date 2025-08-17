/** @type {import('prettier').Config} */
module.exports = {
    endOfLine: "lf",
    semi: false,
    singleQuote: false,
    tabWidth: 4,
    trailingComma: "none",
    plugins: [
      "prettier-plugin-svelte",
      "@ianvs/prettier-plugin-sort-imports",
      "prettier-plugin-tailwindcss"
    ],
    overrides: [
      { files: "*.svelte", options: { parser: "svelte" } },
      { files: ["*.ts", "*.tsx"], options: { parser: "typescript" } },
    ]
  }