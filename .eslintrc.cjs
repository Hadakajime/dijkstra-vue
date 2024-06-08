/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution")

module.exports = {
	root: true,
	"extends": [
		"plugin:vue/vue3-essential",
		"eslint:recommended",
		"@vue/eslint-config-typescript",
		"@vue/eslint-config-prettier/skip-formatting"
	],
	parserOptions: {
		ecmaVersion: "latest"
	},
	// add your custom rules here
	rules: {
		"prefer-promise-reject-errors": "off",
		quotes: ["warn", "double", { avoidEscape: true }],

		// this rule, if on, would require explicit return type on the `render` function
		"@typescript-eslint/explicit-function-return-type": "off",

		// in plain CommonJS modules, you can't use `import foo = require('foo')` to pass this rule, so it has >                '@typescript-eslint/no-var-requires': 'off',

		// The core 'no-unused-vars' rules (in the eslint:recommended ruleset)
		// does not work with type definitions
		"no-unused-vars": "off",

		// allow debugger during development only
		"no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",

		// allow unreachable code, but warn instead of deleting it!!!
		"no-unreachable": "warn",

		"array-element-newline": "always"
	}
}
