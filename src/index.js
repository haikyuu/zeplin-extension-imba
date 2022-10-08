import { createExtension } from "../stylesheet-extensions/packages/base-extension";

import Generator from "./generator";
import { COPYRIGHT } from "./constants";

const exportPrefix = ``;

const INDENTATION = "  ";

// @ts-ignore
export default createExtension({
	language: "css",
	Generator,
	colorsOptions: {
		prefix: `:root ${INDENTATION}`,
		separator: ` `,
		suffix: ` `
	},
	spacingOptions: {
		prefix: ":root ",
		separator: " ",
		suffix: ""
	},
	exportTextStylesOptions: {
		prefix: exportPrefix
	},
	exportColorsOptions: {
		prefix: exportPrefix
	},
	exportSpacingOptions: {
		prefix: exportPrefix
	}
});
