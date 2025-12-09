import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Custom rules to relax strict checks
  {
    rules: {
      // Allow any type where necessary
      "@typescript-eslint/no-explicit-any": "warn",
      // Allow unused vars with underscore prefix
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      // Allow setState in useEffect for client-side hydration patterns
      "react-hooks/set-state-in-effect": "off",
      // Allow accessing variables before declaration (hoisting)
      "react-hooks/immutability": "off",
      // Allow img elements (for external images)
      "@next/next/no-img-element": "warn",
      // Allow sync scripts for ads
      "@next/next/no-sync-scripts": "warn",
      // Allow unescaped entities
      "react/no-unescaped-entities": "off",
      // Exhaustive deps warning only
      "react-hooks/exhaustive-deps": "warn",
      // GA script warning
      "@next/next/next-script-for-ga": "warn",
    },
  },
]);

export default eslintConfig;
