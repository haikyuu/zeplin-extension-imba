function iter$__(a){ let v; return a ? ((v=a.toIterable) ? v.call(a) : a) : a; };

/*body*/
import {variants,aliases} from 'imba/compiler';

/**
@param {string} mod
*/
export default function mapStyle(declarations,cls,cssΞvars,mod){
	
	let styles = [];
	
	for (let $1 = 0, $2 = iter$__(declarations), $12 = $2.length; $1 < $12; $1++) {
		let declaration = $2[$1];
		if (declaration.prop.startsWith('--')) { continue; };
		let {prop: _prop,value: value} = declaration;
		if (declaration.prop === 'color' || declaration.value.includes('rgb(')) {
			
			const parts = cls.split('-');
			if (parts.length === 3) {
				
				const numΞpart = parts[2].match(/(\d+)/);
				if (numΞpart && numΞpart[1] == '50') {
					
					value = parts[1] + "1";
				} else {
					
					value = parts[1] + parts[2][0];
				};
			} else {
				
				value = parts[1];
			};
			
			for (let $3 = 0, $4 = iter$__(cssΞvars), $5 = $4.length; $3 < $5; $3++) {
				let v = $4[$3];
				if (declaration.value.includes(("/ var(" + (v.prop)) && v.value != "1")) {
					
					value = ("" + value + "/" + (v.value));
				};
			};
		};
		
		
		for (let $6 = 0, $7 = Object.keys(aliases), $8 = $7.length, k, v; $6 < $8; $6++){
			k = $7[$6];v = aliases[k];
			if (v === _prop) {
				
				_prop = k;
			};
		};
		// todo: handle colors, css variables, opacity
		// if value.endsWith "rem"
		// 	value = value.replace /rem$/g, ''
		const props = [
			['bxs','box-shadow','shadow'],
			['rd','radius','rounded'],
			['fs','font-size','text']
		// ['e', 'easings', ]
		];
		for (let $9 = 0, $10 = iter$__(props), $11 = $10.length; $9 < $11; $9++) {
			let p = $10[$9];
			if (_prop == p[0]) {
				
				let size = cls.replace(("" + (p[2]) + "-"),'');
				if (variants[p[1]][size]) {
					
					value = size;
				} else if (cls == 'shadow') {
					
					value = 'sm';
				};
			};
		};
		
		styles.push({prop: _prop,value: value});
	};
	for (let $13 = 0, $14 = iter$__(styles), $21 = $14.length; $13 < $21; $13++) {
		let style = $14[$13];
		for (let $15 = 0, $16 = Object.keys(aliases), $20 = $16.length, k, v; $15 < $20; $15++){
			k = $16[$15];v = aliases[k];
			if (Array.isArray(v)) {
				
				let i = v.indexOf(style.prop);
				if (i > -1) {
					
					let others = [];
					for (let $17 = 0, $18 = iter$__(v), $19 = $18.length; $17 < $19; $17++) {
						let other = $18[$17];
						const st = styles.find(function(s) { return s.prop == other && style.value == s.value; });
						if (st) {
							
							others.push(st);
						};
					};
					if (v.length == others.length) {
						
						const grouped = {prop: k,value: style.value};
						styles = styles.filter(function(ss) {
							
							return !(others.find(function(other) {
								
								return other.prop == ss.prop && other.value == ss.value;
							}));
						});
						styles.push(grouped);
					};
				};
			};
		};
	};
	return styles.map(function(style) {
		
		const matches = style.value?.matchAll?.(/var\(--(.*?)\)/g);
		for (let m of iter$__(matches)){
			
			for (let $22 = 0, $23 = iter$__(cssΞvars), $24 = $23.length; $22 < $24; $22++) {
				let decl = $23[$22];
				if (decl.__global) { continue; };
				let withΞfallback = m[1].matchAll(/([^,]*),([^,]*)/g);
				withΞfallback = [...withΞfallback];
				if (withΞfallback.length) {
					
					if (style.value.includes(m[0])) {
						
						style.value = style.value.replaceAll(m[0],decl.value || withΞfallback[2].trim());
					};
				};
				if (decl.prop.replace('--','') == m[1] && style.value.includes(decl.prop)) {
					
					style.value = style.value.replaceAll(m[0],decl.value);
				};
			};
			
			style.value = style.value.replace(m[0],"");
		};
		if (style.prop == 'transform') {
			
			style.value = style.value?.replaceAll?.(/[a-zA-Z]*\(\)\s?/g,"");
			const fm = style.value?.matchAll?.(/([a-zA-Z]*)\(([^,)]*)((,)([^,)]*))?((,)([^,)]*))?\)/g);
			// handle translate and rotate
			// use https://regex101.com/r/QW5wdK/1
			let s = "";
			for (let f of iter$__(fm)){
				
				const fn = f[1];
				const x = f[2];
				const y = f[5];
				const z = f[8];
				let _ref = ["x","y","z"];
				if (fn == "translate") {
					
					for (let i = 0, $25 = [x,y,z], $26 = $25.length; i < $26; i++) {
						let v = $25[i];
						if (v?.indexOf?.('rem') > -1) {
							
							v = + v.replace('rem','');
							v /= 0.25;
							s += ("" + (_ref[i]) + ":" + v + " ");
						};
					};
				} else if (fn == "rotate" && x) {
					
					s += ("rotate:" + x);
				};
			};
			return s.trim();
		};
		return ("" + (style.prop) + mod + ":" + (style.value));
	});
};
