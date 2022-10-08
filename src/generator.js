import {
    isDeclarationInherited,
    generateColorNameResolver,
    generateVariableName
} from "zeplin-extension-style-kit/utils";
import mapStyle from './map-style'


const PREFIX = "$";
const SEPARATOR = ":";
const SUFFIX = " ";
const INDENTATION = "\t";

class CSS {
    constructor(container, params) {
        this.params = params;
        this.container = container;
    }

    formatColorVariable(color) {
        return `var(${PREFIX}${generateVariableName(color.originalName || color.name, this.params.variableNameFormat)})`;
    }

    filterDeclarations(childDeclarations, parentDeclarations) {
        const { params: { showDefaultValues, showDimensions, showPaddingMargin } } = this;

        return childDeclarations.filter(declaration => {
            if (!showDimensions && (declaration.name === "width" || declaration.name === "height")) {
                return false;
            }

            if (!showPaddingMargin && (declaration.name === "margin" || declaration.name === "padding")) {
                return false;
            }

            const parentDeclaration = parentDeclarations.find(p => p.name === declaration.name);

            if (parentDeclaration) {
                if (!parentDeclaration.equals(declaration)) {
                    return true;
                }

                return !isDeclarationInherited(declaration.name);
            }

            if (declaration.hasDefaultValue && declaration.hasDefaultValue()) {
                return showDefaultValues;
            }

            return true;
        });
    }

    declaration(d) {

        const value = d.getValue(
            this.params,
            generateColorNameResolver({
                container: this.container,
                useLinkedStyleguides: this.params.useLinkedStyleguides,
                formatVariableName: color => this.formatColorVariable(color)
            })
        );
		const declarations = [{prop: d.name, value}]
		const name = mapStyle(declarations, "cl1", [], '')
        return `${name[0]}`;
    }

    declarationsBlock(declarations) {
        return ` ${declarations.map(this.declaration, this).join(" ")}\n`;
    }

    variable(name, value) {
        const generatedName = generateVariableName(name, this.params.variableNameFormat);
        return `${PREFIX}${generatedName}${SEPARATOR}${value.toStyleValue(this.params)}${SUFFIX}`;
    }

    ruleSet({ selector, declarations }, { parentDeclarations = [], scope = "" } = {}) {
        const filteredDeclarations = this.filterDeclarations(declarations, parentDeclarations);
        const ruleSelector = scope ? `${scope} ${selector}` : selector;
        if (!filteredDeclarations.length) {
            return "";
        }

        return `${ruleSelector} ${this.declarationsBlock(filteredDeclarations)}`;
    }

    atRule({ identifier, declarations }) {
        return `@${identifier} ${this.declarationsBlock(declarations)}`;
    }
}

export default CSS;
