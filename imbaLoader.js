const { compile } = require('imba/compiler')
const babel = require("@babel/core")

module.exports = function (source, id = "id" + new Date()) {
	const compiled = compile(source, { sourceId: id })
	// TODO: should be safari 9. So this might not work in desktop><
	const tr = babel.transformSync(compiled.js, {
		presets: [["@babel/preset-env", {
			targets: {
				safari: 9
			}
		}]]
	})
	return tr?.code
}