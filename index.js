// Copyright 2021 Anthony Mugendi
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const matcher = require('matcher'),
	Dot = require('dot-object'),
	dotSep = 'º¬',
	dot1 = new Dot(dotSep),
	dot2 = new Dot('_'),
	is = Dot.dot(require('is_js')),
	merge = require('deepmerge'),
	{ keys, values } = Object;

const arrIndexPat = /\[([0-9]+)\]/g,
	beginningDotSep = new RegExp(`^${dotSep}`);

class ObjQuiz {
	constructor(obj) {
		if (!is.object(obj))
			throw new Error(
				'You must pass an object while initializing this class'
			);

		this.flatten_obj(obj);
	}

	flatten_obj(obj) {
		this.obj = obj;

		let o = dot1.dot(removeCircular(obj));

		let newKey;
		for (let k in o) {
			newKey = k
				// add separators for each array index
				.replace(arrIndexPat, `${dotSep}$1`)
				// remove any leading dot sep
				.replace(beginningDotSep, '');

			// if key needs to change
			if (newKey !== k) {
				o[newKey] = o[k];
				delete o[k];
			}
		}

		this.flatObj = o;
	}

	quiz(keyPattern, Check, val = null, parentLevel = 0) {
		// console.log({ keyPattern, Check, val });

		if (is.string(keyPattern) === false && is.array(keyPattern) === false)
			throw new Error(`keyPattern argument must be a string or an array`);

		// Get all keys for the flattened Object
		let allKeys = all_flatted_keys(this.flatObj);

		let allPatterns = arrify(keyPattern).map((keyPattern) =>
				keyPattern.replace(/\./g, dotSep)
			),
			o = matcher(allKeys, allPatterns).reduce(
				(a, b) => Object.assign(a, { [b]: dot1.pick(b, this.obj) }),
				{}
			);

		// console.log('flatObj', this.flatObj);
		// console.log({ allKeys, allPatterns });
		// console.log({ o });

    if(keys(o).length===0){
      return {};
    }

		// return;

		let isMethod;


		if (Check) {

			if (is.string(Check) === false)
				throw new Error(
					`Check argument must be a string. ${Check} (${typeof Check}) entered.`
				);

			Check = Check.trim();
			// console.log(this.flatObj);
			isMethod = Check.replace(/^is\./, '');

			if (is.function(is[isMethod]) === false)
				throw new Error(`${Check} is not a known type check`);
		}

    // console.log({o});

		for (let k in o) {

			// test is Check & remove values not matching
			// console.log(isMethod, o[k], is[isMethod](o[k], val));

			try {
				if (Check && is[isMethod](o[k], val) === false) {
					throw 'Not Found';
				}
			} catch (error) {
				delete o[k];
				continue;
			}
		}

		let ks = get_key_parent(keys(o), parentLevel),
			matchedDotObj = {},
			v;

		// console.log(ks);
		// console.log(this.flatObj);
		// console.log(Dot.pick('0.friends', this.obj));

		for (let k of ks) {
			v = dot1.object({ [k]: dot1.pick(k, this.obj) });

			// console.log({k},  v);
			matchedDotObj = merge(matchedDotObj, v);
		}

		return matchedDotObj;
	}
}

function all_flatted_keys(obj) {
	return Object.keys(obj)
		.map((k) => {
			let arr = k.split(dotSep);
			let arr2 = [];

			while (arr.length > 0) {
				arr2.push(arr.join(dotSep));
				arr.pop();
			}

			// console.log(arr2);
			return arr2;
		})
		.reduce((a, b) => a.concat(b), [])
		.filter(onlyUnique);
}

function get_key_parent(ks, parentLevel = 0) {
	let arr;

	// parentLevel = -1;

	ks = ks
		.map((k) => {
			// split key to get parent easily
			arr = k.split(dotSep);

			let level = 0;

			// || arrIndexPat.test(last(arr))

			if (parentLevel !== 0) {
				//Return set parent level
				// If that level is an array, then go up one more step
				while (
					(level < parentLevel ||
						arrIndexPat.test(last(arr)) ||
						parentLevel == -1) &&
					arr.length > 1
				) {
					arr.pop();
					level++;
					// console.log({arr});
				}
			}

			// return recombined path
			return arr.join(dotSep);
		})
		.filter(onlyUnique);


	return ks;
}

function last(arr) {
	return arr[arr.length - 1];
}

function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
}

function removeCircular(obj) {
	// RETURN IMMEDIATELY if not object
	if (!is.object(obj)) return obj;

	const seen = new Map();
	const recurse = (obj) => {
		seen.set(obj, true);
		if (is.object(obj)) {
			for (let [k, v] of Object.entries(obj)) {
				if (typeof v !== 'object') continue;
				if (seen.has(v)) delete obj[k];
				else recurse(v);
			}
		}
	};
	recurse(obj);

	return obj;
}

function arrify(arr) {
	return Array.isArray(arr) ? arr : [arr];
}

module.exports = ObjQuiz;
