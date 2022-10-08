const { createUnplugin } = require('unplugin')
const { compile } = require('imba/compiler')
const babel = require("@babel/core")

const unplugin = createUnplugin((options) => {
	return {
		name: 'unplugin-imba',
		// webpack's id filter is outside of loader logic,
		// an additional hook is needed for better perf on webpack
		transformInclude(id) {
			return id.endsWith('.imba')
		},
		// just like rollup transform
		transform(code, id) {
			const compiled = compile(code, { sourceId: id })
			// TODO: should be safari 9. So this might not work in desktop><
			const tr = babel.transformSync(compiled.js, {
				presets: [["@babel/preset-env", {
					targets:{
						safari: 9
					}
				}]]
			})
			return tr?.code
		},
		// more hooks coming
	}
})
module.exports.unplugin = unplugin
module.exports.vitePlugin = unplugin.vite
module.exports.rollupPlugin = unplugin.rollup
module.exports.webpackPlugin = unplugin.webpack
module.exports.esbuildPlugin = unplugin.esbuild